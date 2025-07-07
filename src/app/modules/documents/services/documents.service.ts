
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Document {
  id: string;
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
}
