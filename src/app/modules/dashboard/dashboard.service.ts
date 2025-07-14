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
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<any>(`${this.apiUrl}/summary`).pipe(
      map((response) => ({
        documentos_analizados: response.document_count || 0,
        clausulas_riesgosas: response.risk_clause_count || 0,
        gpt_activado: response.gpt_enabled || false,
        plantillas_disponibles: response.template_count || 0,
      })),
    );
  }

  getTypeDistribution(): Observable<TypeCount[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type-distribution`).pipe(
      map((response) => response.map(item => ({
        tipo: item.type,
        cantidad: item.count
      })))
    );
  }

  getDocumentsPerMonth(): Observable<MonthCount[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents-per-month`).pipe(
      map((response) => response.map(item => ({
        mes: this.formatMonth(item.month),
        cantidad: item.count
      })))
    );
  }

  private formatMonth(month: string): string {
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return monthNames[parseInt(monthNum) - 1];
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<any>(`${this.apiUrl}/status`).pipe(
      map((response) => ({
        gpt_activo: response.gpt_enabled,
        mongo_conectado: response.mongo_connected,
        ml_cargado: response.ml_loaded,
        plantillas_disponibles: response.template_count
      }))
    );
  }
}
