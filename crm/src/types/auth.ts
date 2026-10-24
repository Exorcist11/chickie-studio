export type UserRole = "ROLE_ADMIN" | "ROLE_STAFF";

export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  user: AuthUser;
}

export interface TokenResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
}

export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}
