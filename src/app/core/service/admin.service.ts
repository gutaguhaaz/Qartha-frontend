
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface UserUpdateRequest {
  full_name?: string;
  email?: string;
  position?: string;
  phone?: string;
  organization?: string;
  language?: string;
  is_active?: boolean;
  is_admin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private API_URL = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUsers(page: number = 1, perPage: number = 20): Observable<UsersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<UsersResponse>(`${this.API_URL}/users`, { params })
      .pipe(catchError(this.authService['handleError']));
  }

  updateUser(userId: string, userData: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${userId}`, userData)
      .pipe(catchError(this.authService['handleError']));
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${userId}`)
      .pipe(catchError(this.authService['handleError']));
  }

  toggleUserStatus(userId: string, isActive: boolean): Observable<User> {
    return this.updateUser(userId, { is_active: isActive });
  }

  toggleAdminStatus(userId: string, isAdmin: boolean): Observable<User> {
    return this.updateUser(userId, { is_admin: isAdmin });
  }
}
