import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
    return this.http.get<any>(`${this.apiUrl}/dashboard/summary`).pipe(
      map(response => ({
        documentos_analizados: response.documentos_analizados || 0,
        clausulas_riesgosas: response.clausulas_riesgosas || 0,
        gpt_activado: response.gpt_enabled || response.gpt_activado || false,
        plantillas_disponibles: response.template_count || response.plantillas_disponibles || 0
      }))
    );
  }

  getTypeDistribution(): Observable<TypeCount[]> {
    return this.http.get<TypeCount[]>(`${this.apiUrl}/type-distribution`);
  }

  getDocumentsPerMonth(): Observable<MonthCount[]> {
    return this.http.get<MonthCount[]>(`${this.apiUrl}/documents-per-month`);
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/status`).pipe(
      map(response => ({
        gpt_activo: response.gpt_enabled,
        mongo_conectado: response.mongo_connected,
        ml_cargado: response.ml_loaded,
        plantillas_disponibles: response.template_count
      }))
    );
  }
}