import { AuthApi } from "@/lib/api/auth";
import { AuthResponse } from "@/lib/types/api";

describe("AuthApi", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const mockResponse: AuthResponse = {
        accessToken: "mock-token-123",
        user: {
          id: "user-1",
          email: "test@example.com",
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await AuthApi.login(credentials);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(credentials),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw error on failed login", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid credentials" }),
      });

      const credentials = {
        email: "test@example.com",
        password: "wrong-password",
      };

      await expect(AuthApi.login(credentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      await expect(AuthApi.login(credentials)).rejects.toThrow("Network error");
    });
  });

  describe("signup", () => {
    it("should successfully signup with valid credentials", async () => {
      const mockResponse: AuthResponse = {
        accessToken: "mock-token-456",
        user: {
          id: "user-2",
          email: "newuser@example.com",
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const credentials = {
        email: "newuser@example.com",
        password: "password123",
      };

      const result = await AuthApi.signup(credentials);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/auth/signup",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(credentials),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw error when email already exists", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Email already exists" }),
      });

      const credentials = {
        email: "existing@example.com",
        password: "password123",
      };

      await expect(AuthApi.signup(credentials)).rejects.toThrow(
        "Email already exists"
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const credentials = {
        email: "newuser@example.com",
        password: "password123",
      };

      await expect(AuthApi.signup(credentials)).rejects.toThrow(
        "Network error"
      );
    });
  });
});
