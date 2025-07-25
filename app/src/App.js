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
import AdoptionOverview from './pages/admin/adoptionOverview/AdoptionOverview.js';
import CreateBlog from './pages/admin/createBlog/CreateBlog.js';
import BlogManager from './pages/admin/blogManager/BlogManager.js';
import StatsAdmin from './pages/admin/statsAdmin/StatsAdmin.js';
import SpeciesManager from './pages/admin/speciesManager/SpeciesManager.js';
import AbuseReportManager from './pages/admin/abuseReportManager/AbuseReportManager.js';
import DeleteReported from './pages/admin/deleteReported/DeleteReported.js';

import GuestDashboard from './pages/guest/guestDashboard/GuestDashboard.js';

import RatingsPage from './pages/ratingsPage/RatingsPage.js';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import BlogOverview from './pages/blogOverview/BlogOverview.js';
import Contract from './pages/admin/contracts/Contracts.js';
import Chat from './pages/Chat/Chat.js';
import AdminChat from './pages/admin/adminChat/AdminChat.js';
import ForgotPassword from './pages/authPages/ForgotPassword.js';
import ResetPassword from './pages/authPages/ResetPassword.js';

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

          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdoptionOverview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-blog"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/blog-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BlogManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StatsAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-species"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SpeciesManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AbuseReportManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/handle-reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DeleteReported />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <ProtectedRoute allowedRoles={['user', 'owner']}>
                <RatingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs"
            element={
              <ProtectedRoute allowedRoles={['user', 'owner']}>
                <BlogOverview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contracts"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Contract />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={['admin', 'owner', 'user']}>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat-gpt"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminChat />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          


        <Route path="/guest-dashboard" element={<GuestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
