import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage.js';
import LoginPage from './pages/authPages/LoginPage.js';
import RegisterPage from './pages/authPages/RegisterPage.js';
import UserDashboard from './pages/userDashboard/UserDashboard.js';
import OwnerDashboard from './pages/ownerDashboard/OwnerDashboard.js';
import VolunteerDashboard from './pages/volunteerDashboard/VolunteerDashboard.js';
import AdminDashboard from './pages/adminDashboard/AdminDashboard.js';
import GuestDashboard from './pages/guestDashboard/GuestDashboard.js';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/guest-dashboard" element={<GuestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
