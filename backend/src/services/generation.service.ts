import prisma from "../lib/prisma";
import { CreateGenerationDto, GenerationResponse } from "../models/generation";

type Generation = Awaited<ReturnType<typeof prisma.generation.findMany>>[number];

export class GenerationService {
    private static randomOverload(): boolean {
        // Allow disabling random overload in tests
        if (process.env.DISABLE_MODEL_OVERLOAD === "true") {
            return false;
        }
        return Math.random() < 0.2;
    }

    private static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    static async createGeneration(
        userId: number,
        data: CreateGenerationDto,
        imageUrl: string
    ): Promise<GenerationResponse> {
        // Simulate 1-2s delay
        const delay = 1000 + Math.floor(Math.random() * 1000);
        await this.sleep(delay);

        // Simulate 20% chance of overload
        if (this.randomOverload()) {
            throw new Error("Model overloaded");
        }

        const gen = await prisma.generation.create({
            data: {
                userId,
                prompt: data.prompt,
                style: data.style,
                imageUrl,
                status: "succeeded",
            },
        });

        return {
            id: gen.id,
            imageUrl: gen.imageUrl,
            prompt: gen.prompt,
            style: gen.style,
            createdAt: gen.createdAt,
            status: gen.status,
        };
    }

    static async getGenerations(userId: number, limit: number = 5): Promise<GenerationResponse[]> {
        const gens = await prisma.generation.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: Math.min(limit, 50),
        });

        return gens.map((gen: Generation) => ({
            id: gen.id,
            imageUrl: gen.imageUrl,
            prompt: gen.prompt,
            style: gen.style,
            createdAt: gen.createdAt,
            status: gen.status,
        }));
    }
}
