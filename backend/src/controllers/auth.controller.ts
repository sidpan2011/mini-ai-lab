import { Response } from "express";
import { AuthRequest } from "../models/auth";
import { AuthService } from "../services/auth.service";
import { signUpSchema, loginSchema } from "../validators";

export class AuthController {
    static async signup(req: AuthRequest, res: Response): Promise<Response> {
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Request body is required" });
            }

            const { email, password } = req.body;
            const validation = signUpSchema.safeParse({ email, password });

            if (!validation.success) {
                return res.status(400).json({ error: validation.error.message });
            }

            const result = await AuthService.signup({ email, password });
            return res.status(201).json(result);
        } catch (error: any) {
            if (error.message === "Email already in use") {
                return res.status(409).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async login(req: AuthRequest, res: Response): Promise<Response> {
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Request body is required" });
            }

            const { email, password } = req.body;
            const validation = loginSchema.safeParse({ email, password });

            if (!validation.success) {
                return res.status(400).json({ error: validation.error.message });
            }

            const result = await AuthService.login({ email, password });
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === "Invalid credentials") {
                return res.status(401).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
