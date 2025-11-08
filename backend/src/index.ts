import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRouter from './routes/auth';
import generationRouter from './routes/generations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: any, res: any) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRouter);
app.use('/api/generations', generationRouter);

// static uploads route
app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_DIR || "./uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});