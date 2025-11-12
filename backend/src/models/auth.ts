import { Request } from "express";

export interface AuthRequest extends Request {
    user?: { sub: number; email: string };
}

export interface SignUpModel {
    email: string;
    password: string;
}

export interface LoginModel {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: {
        id: number;
        email: string;
    };
}
