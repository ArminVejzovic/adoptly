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
import animalWishlistRoute from './routes/user/animalWishlistRoute.js'
import showAdoptionRequestRoute from './routes/user/adoptionRequestsRoute.js'
import aiRecommenderRoute from './routes/user/aiRecommenderRoute.js'
import createAdmin from './routes/admin/createAdminRoute.js'
import userManagementRoute from './routes/admin/userManagementRoute.js'
import adoptionOverviewRoute from './routes/admin/adoptrionOverviewRoute.js'
import blogRoute from './routes/admin/blogRoute.js'
import statsRoute from './routes/admin/statsRoute.js'
import speciesRoute from './routes/admin/speciesRoute.js'
import guestRoute from './routes/guest/guestRoute.js'
import reportRoute from './routes/admin/abuseReportRoute.js'
import deleteReported from './routes/admin/resolveReportsRoute.js'
import ratingsRoute from './routes/reviewRoute.js'



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
app.use('/api/wishlist', animalWishlistRoute);
app.use('/api/show-adoption-requests', showAdoptionRequestRoute);
app.use('/api/ai', aiRecommenderRoute);
app.use('/api/create-admin', createAdmin);
app.use('/api/users-management', userManagementRoute);
app.use('/api/adoption-overview', adoptionOverviewRoute);
app.use('/api/blog', blogRoute);
app.use('/api/admin-stats', statsRoute);
app.use('/api/species', speciesRoute);
app.use('/api/guest', guestRoute);
app.use('/api/admin/reports', reportRoute);
app.use('/api/admin/resolve-reports', deleteReported);
app.use('/api/review', ratingsRoute)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
