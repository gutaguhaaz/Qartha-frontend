
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  position?: string;
  phone?: string;
  organization?: string;
  language: string;
  is_admin: boolean;
  is_active: boolean;
  is_verified?: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name: string;
  position?: string;
  phone?: string;
  organization?: string;
  language: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}
