import {
  Generation,
  CreateGenerationRequest,
  CreateGenerationResponse,
} from "@/lib/types/generation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class GenerationsApi {
  /**
   * Create a new generation
   */
  static async create(
    data: CreateGenerationRequest,
    signal?: AbortSignal
  ): Promise<CreateGenerationResponse> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("prompt", data.prompt);
    formData.append("style", data.style);

    const response = await fetch(`${API_URL}/api/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal,
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Handle "Model overloaded" error specifically
      if (
        response.status === 503 &&
        responseData.message === "Model overloaded"
      ) {
        throw new Error("Model overloaded");
      }
      throw new Error(responseData.error || "Failed to create generation");
    }

    return responseData;
  }

  /**
   * Get user's generations
   */
  static async getGenerations(limit: number = 5): Promise<Generation[]> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${API_URL}/api/generations?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch generations");
    }

    return data;
  }
}
