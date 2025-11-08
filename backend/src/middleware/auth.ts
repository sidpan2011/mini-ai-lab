import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export interface AuthRequest extends Request {
    user?: { sub: number; email: string };
  }
  
  export function jwtRequired(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization?.split("Bearer ")[1];
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    try {
      const payload = verifyToken(auth) as any;
      req.user = { sub: payload.sub, email: payload.email };
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }