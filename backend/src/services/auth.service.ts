import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { JwtService } from "./jwt.service";
import { SignUpModel, LoginModel, AuthResponse } from "../models/auth";

export class AuthService {
    static async signup(data: SignUpModel): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.user.create({
            data: { email: data.email, password: hashedPassword },
        });

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        const accessToken = JwtService.signToken({ sub: newUser.id, email: newUser.email });
        return {
            accessToken,
            user: { id: newUser.id, email: newUser.email },
        };
    }

    static async login(data: LoginModel): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const accessToken = JwtService.signToken({ sub: user.id, email: user.email });
        return {
            accessToken,
            user: { id: user.id, email: user.email },
        };
    }
}
