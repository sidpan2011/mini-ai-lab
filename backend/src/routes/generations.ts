import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";
import { generationSchema } from "../validators";
import { jwtRequired, AuthRequest } from "../middleware/auth";

const generationRouter = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: () => UPLOAD_DIR,
    filename: (_req, file, cb) => {
        const name = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, name);
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png"];
        cb(null, allowed.includes(file.mimetype));
    }
})

function randomOverload() {
    return Math.random() < 0.2;
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

generationRouter.post("/", jwtRequired, upload.single("image"), async (req: AuthRequest, res) => {
    const body = { prompt: req.body.prompt, style: req.body.style };
    const parsed = generationSchema.safeParse(body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });

    // simulate 1-2s delay
    const delay = 1000 + Math.floor(Math.random() * 1000);
    await sleep(delay);

    if (randomOverload()) {
        return res.status(503).json({ message: "Model overloaded" });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : `https://${req.get("host")}/placeholder/${Date.now()}.png`;

    const gen = await prisma.generation.create({
        data: {
            userId: req.user!.sub,
            prompt: parsed.data.prompt,
            style: parsed.data.style,
            imageUrl,
            status: "succeeded"
        }
    });

    return res.status(201).json({
        id: gen.id,
        imageUrl: gen.imageUrl,
        prompt: gen.prompt,
        style: gen.style,
        createdAt: gen.createdAt,
        status: gen.status
    });
});

generationRouter.get("/", jwtRequired, async (req: AuthRequest, res) => {
    const limit = Math.min(Number(req.query.limit ?? 5), 50) || 5;
    const gens = await prisma.generation.findMany({
        where: { userId: req.user!.sub },
        orderBy: { createdAt: "desc" },
        take: limit
    });
    return res.json(gens);
});



export default generationRouter;