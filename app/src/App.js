import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage'
import LoginPage from './pages/authPages/LoginPage';
import RegisterPage from './pages/authPages/RegisterPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path='/guest-dashboard' element={<GuestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
