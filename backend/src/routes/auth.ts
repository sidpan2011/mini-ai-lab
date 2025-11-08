import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { signUpSchema, loginSchema } from "../validators";

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is required" });
        }
        const { email, password } = req.body;
        const { error } = signUpSchema.safeParse({ email, password });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(409).json({ error: "Email already in use" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        if (!newUser) return res.status(500).json({ error: "Failed to create user" });
        const accessToken = signToken({ sub: newUser.id, email: newUser.email });
        return res.status(201).json({ accessToken, user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is required" });
        }
        const { email, password } = req.body;
        const { error } = loginSchema.safeParse({ email, password });
        if (error) return res.status(400).json({ error: error.message });
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });
        const accessToken = signToken({ sub: user.id, email: user.email });
        return res.status(200).json({ accessToken, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default authRouter;