import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage.js'
import LoginPage from './pages/authPages/LoginPage.js';
import RegisterPage from './pages/authPages/RegisterPage.js';
import UserDashboard from './pages/userDashboard/UserDashboard.js';
import OwnerDashboard from './pages/ownerDashboard/OwnerDashboard.js';
import VolunteerDashboard from './pages/volunteerDashboard/VolunteerDashboard.js';
import AdminDashboard from './pages/adminDashboard/AdminDashboard.js';
import GuestDashboard from './pages/guestDashboard/GuestDashboard.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path='/guest-dashboard' element={<GuestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
