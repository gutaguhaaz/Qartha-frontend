
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DocumentsService } from '../../modules/documents/services/documents.service';
import { Document as CoreDocument } from '../../core/models/document';

export interface PreguntaGPT {
  texto: string;
  document_id?: string;
}

export interface RespuestaGPT {
  respuesta: string;
  fuente?: string;
}

export interface AgentStatus {
  gpt_enabled: boolean;
  api_key_configured: boolean;
  status: string;
}

export interface LegalAgentDocument {
  _id: string;
  filename: string;
  type: string;
  pages: number;
  risk_clauses: any[];
  created_at: string;
  user_id?: string;
}

export interface ChatMessage {
  id: string;
  texto: string;
  tipo: 'usuario' | 'agente';
  timestamp: Date;
  fuente?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LegalAgentService {
  private readonly apiUrl = environment.apiBaseUrl;
  private chatHistorySubject = new BehaviorSubject<ChatMessage[]>([]);
  public chatHistory$ = this.chatHistorySubject.asObservable();

  constructor(
    private http: HttpClient,
    private documentsService: DocumentsService
  ) {}

  consultarAgente(pregunta: PreguntaGPT): Observable<RespuestaGPT> {
    return this.http.post<RespuestaGPT>(`${this.apiUrl}/legal-agent/gpt`, pregunta);
  }

  obtenerEstado(): Observable<AgentStatus> {
    return this.http.get<AgentStatus>(`${this.apiUrl}/legal-agent/status`);
  }

  // Método temporal para pruebas - remover cuando el backend esté configurado
  obtenerEstadoPrueba(): Observable<AgentStatus> {
    return new Observable(observer => {
      observer.next({
        gpt_enabled: true,
        api_key_configured: true,
        status: 'Agente Activo'
      });
      observer.complete();
    });
  }

  obtenerDocumentos(): Observable<LegalAgentDocument[]> {
    // Usar el servicio de documentos real para obtener documentos subidos
    return this.documentsService.getDocuments().pipe(
      map((documents: CoreDocument[]) => {
        console.log('📄 Documentos obtenidos del servicio:', documents);
        return documents.map(doc => ({
          _id: doc._id,
          filename: doc.filename,
          type: doc.type,
          pages: doc.pages,
          risk_clauses: doc.risk_clauses || [],
          created_at: doc.created_at,
          user_id: doc.user_id
        }));
      }),
      catchError(error => {
        console.error('❌ Error al obtener documentos reales:', error);
        // Fallback a documentos de prueba si hay error
        return of([
          {
            _id: '1',
            filename: 'Sin documentos disponibles',
            type: 'info',
            pages: 0,
            risk_clauses: [],
            created_at: new Date().toISOString()
          }
        ]);
      })
    );
  }

  agregarMensaje(mensaje: ChatMessage): void {
    const currentHistory = this.chatHistorySubject.value;
    this.chatHistorySubject.next([...currentHistory, mensaje]);
  }

  limpiarHistorial(): void {
    this.chatHistorySubject.next([]);
  }

  obtenerHistorial(): ChatMessage[] {
    return this.chatHistorySubject.value;
  }

  generarId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  queryAgent(query: string): Observable<RespuestaGPT> {
    const body = { texto: query };
    return this.http.post<RespuestaGPT>(`${this.apiUrl}/legal-agent/gpt`, body);
  }

  queryAgentWithDocumentContext(query: string, includeDocuments: boolean = true): Observable<RespuestaGPT> {
    if (!includeDocuments) {
      return this.queryAgent(query);
    }

    // Get user documents first, then send query with context
    return new Observable(observer => {
      this.obtenerDocumentos().subscribe({
        next: (documents) => {
          const documentContext = this.buildDocumentContext(documents);
          const contextualQuery = this.enhanceQueryWithContext(query, documentContext);

          console.log('🔍 Consulta con contexto de documentos:', contextualQuery);

          this.queryAgent(contextualQuery).subscribe({
            next: (response) => observer.next(response),
            error: (error) => observer.error(error)
          });
        },
        error: (error) => {
          console.warn('⚠️ No se pudieron cargar documentos, usando consulta sin contexto');
          this.queryAgent(query).subscribe({
            next: (response) => observer.next(response),
            error: (error) => observer.error(error)
          });
        }
      });
    });
  }

  private buildDocumentContext(documents: LegalAgentDocument[]): string {
    if (!documents || documents.length === 0) {
      return '';
    }

    let context = '\n\nCONTEXTO DE DOCUMENTOS DEL USUARIO:\n';

    documents.forEach((doc, index) => {
      context += `\nDocumento ${index + 1}: ${doc.filename} (Tipo: ${doc.type}, Páginas: ${doc.pages})\n`;
      context += `Fecha de subida: ${new Date(doc.created_at).toLocaleDateString('es-ES')}\n`;

      if (doc.risk_clauses && doc.risk_clauses.length > 0) {
        context += `Cláusulas de riesgo detectadas (${doc.risk_clauses.length}):\n`;
        doc.risk_clauses.forEach((clause, clauseIndex) => {
          const clauseText = clause.clause || clause.clause_text || 'Cláusula sin texto';
          const riskLevel = clause.risk_level || clause.label || 'desconocido';
          context += `- Cláusula ${clauseIndex + 1} (Riesgo: ${riskLevel}): ${clauseText.substring(0, 150)}...\n`;
        });
      } else {
        context += `Sin cláusulas de riesgo detectadas.\n`;
      }
    });

    context += '\nPor favor usa esta información de los documentos para responder preguntas específicas sobre ellos.\n';
    return context;
  }

  private enhanceQueryWithContext(originalQuery: string, documentContext: string): string {
    if (!documentContext) {
      return originalQuery;
    }

    return `${originalQuery}${documentContext}\n\nPor favor, considera la información de los documentos del usuario al responder.`;
  }
}
