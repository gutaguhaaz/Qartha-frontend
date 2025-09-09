
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Device, DeviceFilters, Scan } from '../models/device';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('qartha_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Dispositivos
  getDevices(filters: DeviceFilters = {}): Observable<Device[]> {
    let params = new HttpParams()
      .set('skip', (filters.skip || 0).toString())
      .set('limit', (filters.limit || 50).toString());
    
    if (filters.category) {
      params = params.set('category', filters.category);
    }

    return this.http.get<Device[]>(`${this.apiUrl}devices`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  getDevice(id: string): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}devices/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createDevice(device: Partial<Device>): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}devices`, device, {
      headers: this.getAuthHeaders()
    });
  }

  updateDevice(id: string, device: Partial<Device>): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}devices/${id}`, device, {
      headers: this.getAuthHeaders()
    });
  }

  generateQR(deviceId: string): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}devices/${deviceId}/qr`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Escaneos
  registerScan(scan: Partial<Scan>): Observable<Scan> {
    return this.http.post<Scan>(`${this.apiUrl}scans`, scan, {
      headers: this.getAuthHeaders()
    });
  }

  getScans(deviceId?: string): Observable<Scan[]> {
    let params = new HttpParams();
    if (deviceId) {
      params = params.set('device_id', deviceId);
    }

    return this.http.get<Scan[]>(`${this.apiUrl}scans`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Archivos
  uploadFile(file: File, deviceId?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (deviceId) {
      formData.append('device_id', deviceId);
    }

    const token = localStorage.getItem('qartha_token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post(`${this.apiUrl}files`, formData, { headers });
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}files/${fileId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  // Health check
  healthCheck(): Observable<{status: string}> {
    return this.http.get<{status: string}>(`${this.apiUrl.replace('/api/', '')}/health`);
  }
}
