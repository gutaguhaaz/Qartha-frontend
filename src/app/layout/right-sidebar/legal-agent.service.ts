
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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
  id: string;
  name: string;
  file_type: string;
  uploaded_at: string;
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
    // Cambiar por la línea comentada cuando el backend esté configurado
    // return this.http.get<LegalAgentDocument[]>(`${this.apiUrl}/documents`);

    // Método temporal para pruebas - remover cuando el backend esté configurado
    return new Observable(observer => {
      observer.next([
        {
          id: '1',
          name: 'Contrato de Trabajo.pdf',
          file_type: 'pdf',
          uploaded_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Acuerdo de Confidencialidad.docx',
          file_type: 'docx',
          uploaded_at: '2024-01-16T14:20:00Z'
        },
        {
          id: '3',
          name: 'Términos y Condiciones.pdf',
          file_type: 'pdf',
          uploaded_at: '2024-01-17T09:15:00Z'
        }
      ]);
      observer.complete();
    });
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
      context += `\nDocumento ${index + 1}: ${doc.name} (Tipo: ${doc.file_type})\n`;

      // Mock document data for context building
      const mockRiskClauses = [
        {
          label: 'Cláusula de ejemplo',
          clause_text: 'Esta es una cláusula de ejemplo para mostrar el contexto...'
        }
      ];

      if (mockRiskClauses && mockRiskClauses.length > 0) {
        context += `Cláusulas detectadas:\n`;
        mockRiskClauses.forEach((clause, clauseIndex) => {
          context += `- Cláusula ${clauseIndex + 1} (${clause.label}): ${clause.clause_text.substring(0, 200)}...\n`;
        });
      }
    });

    return context;
  }

  private enhanceQueryWithContext(originalQuery: string, documentContext: string): string {
    if (!documentContext) {
      return originalQuery;
    }

    return `${originalQuery}${documentContext}\n\nPor favor, considera la información de los documentos del usuario al responder.`;
  }
}
