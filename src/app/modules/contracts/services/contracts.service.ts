
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  ContractGenerateRequest, 
  Template, 
  GPTClauseRequest, 
  GPTClauseResponse,
  TemplateField
} from '../models/contract.models';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Obtener plantillas disponibles
  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.apiUrl}/templates`);
  }

  // Obtener campos de una plantilla específica
  getTemplateFields(templateName: string): Observable<TemplateField[]> {
    return this.http.get<TemplateField[]>(`${this.apiUrl}/test-template/${templateName}`);
  }

  // Generar contrato
  generateContract(request: ContractGenerateRequest): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    return this.http.post(`${this.apiUrl}/generate-contract`, request, {
      headers,
      responseType: 'blob'
    });
  }

  // Descargar plantilla original
  downloadTemplate(templateName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    return this.http.get(`${this.apiUrl}/download-template/${templateName}`, {
      headers,
      responseType: 'blob'
    });
  }

  // Generar cláusula con IA
  generateClause(prompt: string): Observable<GPTClauseResponse> {
    const request: GPTClauseRequest = { prompt };
    return this.http.post<GPTClauseResponse>(`${this.apiUrl}/generate-clause-gpt`, request);
  }

  // Método utilitario para descargar archivos
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
