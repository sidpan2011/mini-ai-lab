import { ApiClient } from "./client";
import { LoginRequest, SignupRequest, AuthResponse } from "@/lib/types/api";

export class AuthApi {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );
    return response;
  }

  /**
   * Signup user
   */
  static async signup(credentials: SignupRequest): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(
      "/api/auth/signup",
      credentials
    );
    return response;
  }
}
