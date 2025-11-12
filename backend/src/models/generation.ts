export interface CreateGenerationDto {
    prompt: string;
    style: string;
}

export interface GenerationResponse {
    id: number;
    imageUrl: string;
    prompt: string;
    style: string;
    createdAt: Date;
    status: string;
}
