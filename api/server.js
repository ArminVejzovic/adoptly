import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import cors from 'cors';

import authRoutes from './routes/authRoute.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
