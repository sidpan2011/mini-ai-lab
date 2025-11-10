import dotenv from "dotenv";
import { createApp } from "../src/app";

// Load test environment variables (fallback to .env if .env.test doesn't exist)
dotenv.config({ path: ".env.test" });
dotenv.config(); // Fallback to default .env

const app = createApp();

export default app;
