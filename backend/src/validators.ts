import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const generationSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }),
  style: z.string().min(1),
});