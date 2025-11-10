import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { AuthApi } from "@/lib/api/auth";

// Mock the AuthApi
jest.mock("@/lib/api/auth");

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  describe("initialization", () => {
    it("should initialize with no user when localStorage is empty", async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should restore user from localStorage if token is valid", async () => {
      const mockUser = { id: "user-1", email: "test@example.com" };
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const mockToken = `header.${btoa(JSON.stringify({ exp: futureExp }))}.signature`;

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should clear localStorage if token is expired", async () => {
      const mockUser = { id: "user-1", email: "test@example.com" };
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const mockToken = `header.${btoa(JSON.stringify({ exp: pastExp }))}.signature`;

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("should handle invalid stored user data", async () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const mockToken = `header.${btoa(JSON.stringify({ exp: futureExp }))}.signature`;

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", "invalid-json");

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("login", () => {
    it("should successfully login and store credentials", async () => {
      const mockResponse = {
        accessToken: "mock-token-123",
        user: { id: "user-1", email: "test@example.com" },
      };

      (AuthApi.login as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(loginResult).toEqual({ success: true });
      expect(localStorage.getItem("token")).toBe("mock-token-123");
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify(mockResponse.user)
      );
      expect(result.current.user).toEqual(mockResponse.user);
      expect(mockPush).toHaveBeenCalledWith("/studio");
    });

    it("should return error on failed login", async () => {
      (AuthApi.login as jest.Mock).mockRejectedValueOnce(
        new Error("Invalid credentials")
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: "test@example.com",
          password: "wrong-password",
        });
      });

      expect(loginResult).toEqual({
        success: false,
        error: "Invalid credentials",
      });
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("signup", () => {
    it("should successfully signup and store credentials", async () => {
      const mockResponse = {
        accessToken: "mock-token-456",
        user: { id: "user-2", email: "newuser@example.com" },
      };

      (AuthApi.signup as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signupResult;
      await act(async () => {
        signupResult = await result.current.signup({
          email: "newuser@example.com",
          password: "password123",
        });
      });

      expect(signupResult).toEqual({ success: true });
      expect(localStorage.getItem("token")).toBe("mock-token-456");
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify(mockResponse.user)
      );
      expect(result.current.user).toEqual(mockResponse.user);
      expect(mockPush).toHaveBeenCalledWith("/studio");
    });

    it("should return error on failed signup", async () => {
      (AuthApi.signup as jest.Mock).mockRejectedValueOnce(
        new Error("Email already exists")
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signupResult;
      await act(async () => {
        signupResult = await result.current.signup({
          email: "existing@example.com",
          password: "password123",
        });
      });

      expect(signupResult).toEqual({
        success: false,
        error: "Email already exists",
      });
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear credentials and redirect to login", async () => {
      const mockUser = { id: "user-1", email: "test@example.com" };
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const mockToken = `header.${btoa(JSON.stringify({ exp: futureExp }))}.signature`;

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
