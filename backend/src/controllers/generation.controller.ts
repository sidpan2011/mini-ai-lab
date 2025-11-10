import { Response } from "express";
import { AuthRequest } from "../models/auth";
import { GenerationService } from "../services/generation.service";
import { generationSchema } from "../validators";

export class GenerationController {
    static async createGeneration(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const body = { prompt: req.body.prompt, style: req.body.style };
            const validation = generationSchema.safeParse(body);

            if (!validation.success) {
                return res.status(400).json({ error: validation.error });
            }

            const imageUrl = req.file
                ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
                : `https://${req.get("host")}/placeholder/${Date.now()}.png`;

            const result = await GenerationService.createGeneration(
                req.user!.sub,
                validation.data,
                imageUrl
            );

            return res.status(201).json(result);
        } catch (error: any) {
            if (error.message === "Model overloaded") {
                return res.status(503).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getGenerations(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const limit = Math.min(Number(req.query.limit ?? 5), 50) || 5;
            const generations = await GenerationService.getGenerations(req.user!.sub, limit);
            return res.json(generations);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
