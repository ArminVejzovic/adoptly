import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import cors from 'cors';

import authRoutes from './routes/authRoute.js';
import ownerRoutes from './routes/owner/addAnimalRoute.js';
import animalRoutes from './routes/owner/myAnimalsRoute.js';
import profileRoutes from './routes/profileRoute.js';
import adoptionRequestRoute from './routes/user/createAdoptionRequestsRoute.js'
import controlAdoptionRoute from './routes/owner/controlAdoptionRequestsRoute.js'
import createAdoptionRequestRoute from './routes/user/createAdoptionRequestsRoute.js'
import animalInteractionRoute from './routes/user/animalInteractionRoute.js'



const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));



app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/owner', animalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request-adoption', adoptionRequestRoute);
app.use('/api/control-adoption', controlAdoptionRoute);
app.use('/api/adoption', createAdoptionRequestRoute);
app.use('/api/interact', animalInteractionRoute);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
