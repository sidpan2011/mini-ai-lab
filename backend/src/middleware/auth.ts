import { Response, NextFunction } from "express";
import { AuthRequest } from "../models/auth";
import { JwtService } from "../services/jwt.service";

export function jwtRequired(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization?.split("Bearer ")[1];
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    try {
        const payload = JwtService.verifyToken(auth) as any;
        req.user = { sub: payload.sub, email: payload.email };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
