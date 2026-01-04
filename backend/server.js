import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authroutes from './src/routes/auth.js';
import videoroutes from './src/routes/videos.js';
import channelRoutes from './src/routes/channel.js';

dotenv.config();
const app = express();

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(process.cwd(), "public")));
app.use('/api/auth', authroutes);
app.use('/api/videos', videoroutes);
app.use("/api/channel", channelRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.log(error.message);
  });