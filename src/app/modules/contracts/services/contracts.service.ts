import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
  private apiUrl = environment.apiBaseUrl || 'https://tu-repl-url.replit.app/api/v1';

  constructor(private http: HttpClient) {}

  // Obtener plantillas disponibles
  getTemplates(): Observable<{ templates: string[], count: number }> {
    const url = `${this.apiUrl}/contracts/templates`;
    console.log('🌐 Making request to:', url);
    console.log('🔧 Using API URL base:', this.apiUrl);

    return this.http.get<{ templates: string[], count: number }>(url).pipe(
      tap(response => {
        console.log('✅ Templates response received:', response);
      }),
      catchError(error => {
        console.error('❌ Templates request failed:', error);
        console.error('❌ Failed URL:', url);
        throw error;
      })
    );
  }

  getTemplateFields(templateName: string): Observable<TemplateField[]> {
    const url = `${this.apiUrl}/contracts/test-template/${templateName}`;
    console.log('🌐 Making template fields request to:', url);
    console.log('📋 Template name:', templateName);

    return this.http.get<TemplateField[]>(url).pipe(
      tap(response => {
        console.log('✅ Template fields response received:', response);
      }),
      catchError(error => {
        console.error('❌ Template fields request failed:', error);
        console.error('❌ Failed URL:', url);
        console.error('❌ Template name:', templateName);
        throw error;
      })
    );
  }

  // Generar contrato
  generateContract(request: ContractGenerateRequest): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    return this.http.post(`${this.apiUrl}/contracts/generate-contract`, request, {
      headers,
      responseType: 'blob'
    });
  }

  // Descargar plantilla original
  downloadTemplate(templateName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    return this.http.get(`${this.apiUrl}/contracts/download-template/${templateName}`, {
      headers,
      responseType: 'blob'
    });
  }

  // Generar cláusula con IA
  generateClause(prompt: string): Observable<GPTClauseResponse> {
    const request: GPTClauseRequest = { prompt };
    return this.http.post<GPTClauseResponse>(`${this.apiUrl}/contracts/generate-clause-gpt`, request);
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