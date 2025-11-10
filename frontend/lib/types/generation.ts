// Generation types
export interface Generation {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: string;
}

export interface CreateGenerationRequest {
  image: File;
  prompt: string;
  style: string;
}

export interface CreateGenerationResponse {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: string;
}
