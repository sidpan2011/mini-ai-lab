// User types
export interface User {
  id: string;
  email: string;
}

// Auth request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

// Auth response types
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Error response type
export interface ApiError {
  error: string;
}
