import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/status', statusRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

export default app;