
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Document {
  id: string;
  custom_id: number;
  title: string;
  type: 'Contrato' | 'Boletín' | 'Comunicado' | 'Informe' | 'Otro';
  clauses: string[];
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = `${environment.apiBaseUrl}/documents`;

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocument(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  uploadDocument(file: File, title: string, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);
    return this.http.post(`${this.apiUrl.replace('/documents', '')}/upload-document`, formData);
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${documentId}`);
  }

  analyzeClause(clauseText: string): Observable<any> {
    const body = { clause_text: clauseText };
    return this.http.post(`${environment.apiBaseUrl}/clauses/predict`, body);
  }
}
