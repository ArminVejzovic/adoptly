import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
