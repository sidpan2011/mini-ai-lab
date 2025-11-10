"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api/auth";
import { User, LoginRequest, SignupRequest } from "@/lib/types/api";

// Helper to decode JWT and get expiry
function decodeToken(token: string): { exp: number } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (_error) {
    return null;
  }
}

// Helper to check if token is expired
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount - only runs once
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    let timeoutId: NodeJS.Timeout | null = null;

    if (token && storedUser) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token expired, clearing auth");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        try {
          setUser(JSON.parse(storedUser));

          // Set up auto-logout when token expires
          const decoded = decodeToken(token);
          if (decoded && decoded.exp) {
            const expiryTime = decoded.exp * 1000;
            const timeUntilExpiry = expiryTime - Date.now();

            if (timeUntilExpiry > 0) {
              timeoutId = setTimeout(() => {
                console.log("Token expired, logging out");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                router.push("/login");
              }, timeUntilExpiry);
            }
          }
        } catch (_error) {
          console.error("Error parsing stored user:", _error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }

    // Always set loading to false
    setIsLoading(false);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Only run once on mount

  /**
   * Login function
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthApi.login(credentials);

      // Store token and user in localStorage
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update state
      setUser(response.user);

      // Redirect to studio
      router.push("/studio");

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Login failed" };
    }
  };

  /**
   * Signup function
   */
  const signup = async (credentials: SignupRequest) => {
    try {
      const response = await AuthApi.signup(credentials);

      // Store token and user in localStorage
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update state
      setUser(response.user);

      // Redirect to studio
      router.push("/studio");

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Signup failed" };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}
