import { Router } from "express";
import { GenerationController } from "../controllers/generation.controller";
import { jwtRequired } from "../middleware/auth";
import { upload } from "../services/upload.service";

const generationRouter = Router();

generationRouter.post(
    "/",
    jwtRequired,
    upload.single("image"),
    GenerationController.createGeneration
);

generationRouter.get("/", jwtRequired, GenerationController.getGenerations);

export default generationRouter;
