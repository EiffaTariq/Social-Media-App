// import express from 'express';
// import dotenv from 'dotenv';
// import { connectDb } from './database/db.js';
// import userRoutes from './routes/userRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import statusRoutes from './routes/statusRoutes.js';
// import cors from 'cors';

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cors({
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   credentials: true
// }));

// const PORT = process.env.PORT || 7000;

// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

// app.use('/api/user', userRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/status', statusRoutes);

// connectDb()
//   .then(() => console.log('DB connected'))
//   .catch((error) => console.error('DB connection failed:', error));

// app.listen(PORT, () => {
//   console.log(`✅ Server started on port ${PORT}`);
// });

import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 7000;

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/status', statusRoutes);

connectDb()
  .then(() => console.log('DB connected'))
  .catch((error) => console.error('DB connection failed:', error));

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});