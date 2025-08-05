import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
import PublicHomePage from './pages/PublicHomePage'; // Renamed from Home.jsx
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';


// Protected Pages
import Home from './pages/Home'; // This is your NEW, logged-in dashboard Home.jsx
import BucketListPage from './pages/BucketListPage';
import ExplorePage from './pages/ExplorePage';
import AiItineraryPage from './pages/AiItineraryPage';
import BucketListItemDetailPage from './pages/BucketListItemDetailPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import AuthLayout from './components/AuthLayout';

import { useAuth } from './context/AuthContext'; // Import useAuth to check auth status at root

function App() {
  return (
    <Router>
      <AppRoutes /> {/* Use a wrapper component to access AuthContext */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

// Wrapper component to access AuthContext for conditional routing
function AppRoutes() {
  const { isAuthenticated } = useAuth(); // Get auth status from context

  return (
    <Routes>
      {/* Public Routes */}
      {/* If authenticated, redirect from '/' to '/home'. Otherwise, show PublicHomePage. */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <PublicHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Wrapped by PrivateRoute and AuthLayout */}
      <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
        <Route path="/home" element={<Home />} /> {/* This is the new logged-in dashboard */}
        <Route path="/bucketlist" element={<BucketListPage />} />
        <Route path="/bucketlist/:id" element={<BucketListItemDetailPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/ai" element={<AiItineraryPage />} />
      </Route>

      {/* Catch-all for undefined routes (optional) */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
    </Routes>
  );
}

export default App;