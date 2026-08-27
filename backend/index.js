// import express from 'express';
// import dotenv from 'dotenv';
// import { connectDb } from './database/db.js';
// import userRoutes from './routes/userRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import statusRoutes from './routes/statusRoutes.js';
// import cookieParser from "cookie-parser";
// import authRoutes from "./routes/authRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import cors from 'cors';

// dotenv.config();

// const app = express();

// app.use(cors({
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   credentials: true
// }));
// app.use(express.json({ limit: "10mb" }));

// app.use(cookieParser());

// const PORT = process.env.PORT || 7000;

// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

// app.use('/api/user', userRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/status', statusRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);

// connectDb()
//   .then(() => console.log('DB connected'))
//   .catch((error) => console.error('DB connection failed:', error));

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server started on port ${PORT}`);
// });

import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 7000;

connectDb()
  .then(() => console.log('DB connected'))
  .catch((error) => console.error('DB connection failed:', error));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});