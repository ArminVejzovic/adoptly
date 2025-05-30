import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage.js';
import LoginPage from './pages/authPages/LoginPage.js';
import RegisterPage from './pages/authPages/RegisterPage.js';

import Profile from './pages/profile/Profile.js';
import PublicProfile from './pages/publicProfile/PublicProfile.js';

import UserDashboard from './pages/user/userDashboard/UserDashboard.js';
import AvailableAnimals from './pages/user/availableAnimals/AvailableAnimals.js';
import WishlistAnimals from './pages/user/wishlistAnimals/WishlistAnimals.js';
import AdoptionRequestsUser from './pages/user/adoptionRequests/AdoptionRequestsUser.js';
import AiRecommender from './pages/user/aiRecommender/AiRecommender.js';

import OwnerDashboard from './pages/owner/ownerDashboard/OwnerDashboard.js';
import AddAnimal from './pages/owner/addAnimal/AddAnimal.js';
import MyAnimals from './pages/owner/myAnimals/MyAnimals.js';
import AdoptionRequestsOwner from './pages/owner/adoptionRequests/AdoptionRequestsOwner.js';

import AdminDashboard from './pages/admin/adminDashboard/AdminDashboard.js';
import CreateAdmin from './pages/admin/createAdmin/CreateAdmin.js'
import UserListAdmin from './pages/admin/userListAdmin/UserListAdmin.js';

import GuestDashboard from './pages/guest/guestDashboard/GuestDashboard.js';

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
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
              <Profile />
            </ProtectedRoute>
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
            path="/available-animals"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AvailableAnimals />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/wishlist-animals"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <WishlistAnimals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adoption-requests"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AdoptionRequestsUser />
              </ProtectedRoute>
            }
          />  

          <Route
            path="/ai-recommender"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AiRecommender />
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
          path="/add-animal"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <AddAnimal />
            </ProtectedRoute>
          } />

          <Route
            path="/my-animals"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MyAnimals />
              </ProtectedRoute>
            } />

          <Route
            path="/adoption-requests-owner"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <AdoptionRequestsOwner />
              </ProtectedRoute>
            } />

          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <PublicProfile />
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

          <Route
            path="/create-admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserListAdmin />
              </ProtectedRoute>
            }
          />

        <Route path="/guest-dashboard" element={<GuestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
