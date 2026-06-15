export interface UserData {
  name: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface AuthState {
  loggedIn: boolean;
  authEnabled: boolean;
  user?: UserData;
  authenticated?: boolean; // Legacy support from app.js
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  user?: UserData;
  error?: string;
}
