import express from "express";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.routes";
import generationRouter from "./routes/generation.routes";
import { getUploadDir } from "./services/upload.service";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req: any, res: any) => {
        res.send("Hello, World!");
    });

    app.use("/api/auth", authRouter);
    app.use("/api/generations", generationRouter);

    // Static uploads route
    app.use("/uploads", express.static(path.resolve(getUploadDir())));

    return app;
}
