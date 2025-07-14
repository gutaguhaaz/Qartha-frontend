
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces
export interface DashboardSummary {
  documentos_analizados: number;
  clausulas_riesgosas: number;
  gpt_activado: boolean;
  plantillas_disponibles: number;
}

export interface TypeCount {
  tipo: string;
  cantidad: number;
}

export interface MonthCount {
  mes: string;
  cantidad: number;
}

export interface SystemStatus {
  gpt_activo: boolean;
  mongo_conectado: boolean;
  ml_cargado: boolean;
  plantillas_disponibles: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getTypeDistribution(): Observable<TypeCount[]> {
    return this.http.get<TypeCount[]>(`${this.apiUrl}/type-distribution`);
  }

  getDocumentsPerMonth(): Observable<MonthCount[]> {
    return this.http.get<MonthCount[]>(`${this.apiUrl}/documents-per-month`);
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<SystemStatus>(`${this.apiUrl}/status`);
  }
}
