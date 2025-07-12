import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

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

export interface Document {
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

  constructor(private http: HttpClient) {}

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

  obtenerDocumentos(): Observable<Document[]> {
    // Cambiar por la línea comentada cuando el backend esté configurado
    // return this.http.get<Document[]>(`${this.apiUrl}/documents`);

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
}