import { GenerationsApi } from "@/lib/api/generations";
import { CreateGenerationResponse, Generation } from "@/lib/types/generation";

describe("GenerationsApi", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "mock-token");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    it("should successfully create a generation", async () => {
      const mockResponse: CreateGenerationResponse = {
        id: 1,
        imageUrl: "https://example.com/generated.jpg",
        prompt: "A beautiful sunset",
        style: "realistic",
        createdAt: "2024-01-01T00:00:00Z",
        status: "completed",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const request = {
        image: mockFile,
        prompt: "A beautiful sunset",
        style: "realistic",
      };

      const result = await GenerationsApi.create(request);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/generations",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer mock-token",
          },
          body: expect.any(FormData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw Model overloaded error on 503 status", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ message: "Model overloaded" }),
      });

      const mockFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const request = {
        image: mockFile,
        prompt: "A beautiful sunset",
        style: "realistic",
      };

      await expect(GenerationsApi.create(request)).rejects.toThrow(
        "Model overloaded"
      );
    });

    it("should throw generic error on other failures", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid image format" }),
      });

      const mockFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const request = {
        image: mockFile,
        prompt: "A beautiful sunset",
        style: "realistic",
      };

      await expect(GenerationsApi.create(request)).rejects.toThrow(
        "Invalid image format"
      );
    });

    it("should support abort signal for cancellation", async () => {
      const abortController = new AbortController();
      const mockResponse: CreateGenerationResponse = {
        id: 1,
        imageUrl: "https://example.com/generated.jpg",
        prompt: "A beautiful sunset",
        style: "realistic",
        createdAt: "2024-01-01T00:00:00Z",
        status: "completed",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const mockFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const request = {
        image: mockFile,
        prompt: "A beautiful sunset",
        style: "realistic",
      };

      await GenerationsApi.create(request, abortController.signal);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/generations",
        expect.objectContaining({
          signal: abortController.signal,
        })
      );
    });
  });

  describe("getGenerations", () => {
    it("should successfully fetch generations with default limit", async () => {
      const mockGenerations: Generation[] = [
        {
          id: 1,
          imageUrl: "https://example.com/image1.jpg",
          prompt: "Sunset",
          style: "realistic",
          createdAt: "2024-01-01T00:00:00Z",
          status: "completed",
        },
        {
          id: 2,
          imageUrl: "https://example.com/image2.jpg",
          prompt: "Mountain",
          style: "artistic",
          createdAt: "2024-01-02T00:00:00Z",
          status: "completed",
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGenerations,
      });

      const result = await GenerationsApi.getGenerations();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/generations?limit=5",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer mock-token",
          },
        })
      );

      expect(result).toEqual(mockGenerations);
    });

    it("should fetch generations with custom limit", async () => {
      const mockGenerations: Generation[] = [];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGenerations,
      });

      await GenerationsApi.getGenerations(10);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/generations?limit=10",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer mock-token",
          },
        })
      );
    });

    it("should throw error on failed fetch", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Unauthorized" }),
      });

      await expect(GenerationsApi.getGenerations()).rejects.toThrow(
        "Unauthorized"
      );
    });
  });
});
