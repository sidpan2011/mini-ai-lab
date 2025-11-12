import multer from "multer";
import fs from "fs";
// import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const name = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, name);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png"];
        cb(null, allowed.includes(file.mimetype));
    },
});

export function getUploadDir(): string {
    return UPLOAD_DIR;
}
