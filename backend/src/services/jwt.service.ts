import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export class JwtService {
    static signToken(payload: object, expiresIn: string | number = "7d"): string {
        return jwt.sign(payload, JWT_SECRET as string, { expiresIn } as SignOptions);
    }

    static verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET as string);
    }
}
