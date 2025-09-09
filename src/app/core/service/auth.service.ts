import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterRequest, PasswordChangeRequest } from '../models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = `${environment.apiBaseUrl}auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): User | null {
    const localUser = localStorage.getItem('currentUser');
    const sessionUser = sessionStorage.getItem('currentUser');

    if (localUser) {
      return JSON.parse(localUser);
    } else if (sessionUser) {
      return JSON.parse(sessionUser);
    }
    return null;
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    // Transformar el request para que coincida con el backend
    const backendRequest = {
      username: loginData.email, // El backend usa username pero enviamos email
      password: loginData.password
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, backendRequest)
      .pipe(
        tap(response => {
          // Guardar token usando la clave que espera el backend
          localStorage.setItem('qartha_token', response.access_token);
          localStorage.setItem('access_token', response.access_token);

          // Guardar usuario según remember_me
          const storage = loginData.remember_me ? localStorage : sessionStorage;
          storage.setItem('currentUser', JSON.stringify(response.user));
          storage.setItem('qartha_user', JSON.stringify(response.user));

          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  register(registerData: RegisterRequest): Observable<User> {
    // Transformar el request para que coincida con el backend
    const backendRequest = {
      username: registerData.username,
      password: registerData.password,
      email: registerData.email
    };

    return this.http.post<User>(`${this.API_URL}/register`, backendRequest)
      .pipe(catchError(this.handleError));
  }

  logout(): Observable<any> {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('qartha_token');
    localStorage.removeItem('qartha_user');
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`)
      .pipe(catchError(this.handleError));
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/me`, userData)
      .pipe(
        tap(user => {
          const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
          storage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  changePassword(passwordData: PasswordChangeRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/me/password`, passwordData)
      .pipe(catchError(this.handleError));
  }

  verifyToken(): Observable<any> {
    return this.http.get(`${this.API_URL}/verify-token`)
      .pipe(catchError(this.handleError));
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('qartha_token') || localStorage.getItem('access_token');
    return !!token && !!this.currentUserValue;
  }

  private handleError(error: any) {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error?.detail) {
      // Handle validation errors array
      if (Array.isArray(error.error.detail)) {
        const firstError = error.error.detail[0];
        errorMessage = firstError.msg || 'Error de validación';
      } else {
        errorMessage = error.error.detail;
      }
    } else if (error.status === 401) {
      errorMessage = 'Token JWT inválido o expirado';
    } else if (error.status === 403) {
      errorMessage = 'Permisos insuficientes';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos';
    } else if (error.status === 422) {
      errorMessage = 'Error de validación en los datos enviados';
    } else if (error.status === 409) {
      errorMessage = 'El usuario ya existe';
    }

    return throwError(() => new Error(errorMessage));
  }
}