import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload: object, expiresIn: string | number = "7d") {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn } as SignOptions);
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET as string);
}