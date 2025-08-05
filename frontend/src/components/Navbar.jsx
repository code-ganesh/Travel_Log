import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link styling
import {
  HomeIcon,
  StarIcon,
  MapIcon,
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation(); // Get current location to highlight active link

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Full page reload to ensure auth state is clear
  };

  // Helper function to determine if a link is active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="backdrop-blur-md bg-white/85 fixed w-full z-50 shadow-xl border-b border-gray-100">
      {/* Main container: flex items-center justify-between to push left and right groups to ends */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Left Group: Logo */}
        <div className="flex-shrink-0"> {/* Ensures logo doesn't shrink */}
          <Link
            to="/home"
            className="text-3xl font-extrabold text-gray-900 hover:text-pink-600 transition-colors duration-200 tracking-tight"
          >
            DreamTrip
          </Link>
        </div>

        {/* Middle Group: Nav Links & Search Bar - This group will be centered and take available space */}
        <div className="flex-grow flex items-center justify-center gap-12"> {/* flex-grow to take available space, justify-center to center its children, gap for spacing */}
          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-16 text-gray-700 font-medium"> {/* Increased space-x for more gap between nav links */}
            <Link
              to="/home"
              className={`flex items-center px-4 py-2 rounded-lg hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 ${
                isActiveLink("/home") ? "text-pink-600 bg-pink-50 shadow-sm" : "" // Active state styling with subtle shadow
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-2" /> Home
            </Link>
            <Link
              to="/explore"
              className={`flex items-center px-4 py-2 rounded-lg hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 ${
                isActiveLink("/explore") ? "text-pink-600 bg-pink-50 shadow-sm" : ""
              }`}
            >
              <MapIcon className="h-5 w-5 mr-2" /> Explore
            </Link>
            <Link
              to="/bucketlist"
              className={`flex items-center px-4 py-2 rounded-lg hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 ${
                isActiveLink("/bucketlist") ? "text-pink-600 bg-pink-50 shadow-sm" : ""
              }`}
            >
              <StarIcon className="h-5 w-5 mr-2" /> Bucketlist
            </Link>
            <Link
              to="/ai"
              className={`px-4 py-2 rounded-lg hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 ${
                isActiveLink("/ai") ? "text-pink-600 bg-pink-50 shadow-sm" : ""
              }`}
            >
              AI Itinerary
            </Link>
          </div>
          {/* Search Bar */}
          <div className="hidden md:flex"> {/* No mx-auto here, as parent handles centering */}
            <input
              type="text"
              placeholder="Search destinations..."
              className="px-6 py-2.5 w-full max-w-md rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Group: Bell, Profile, Mobile Toggle */}
        <div className="flex-shrink-0 flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-pink-600 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center border-2 border-white font-bold">1</span>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-full py-1.5 px-3"
            >
              <UserCircleIcon className="h-8 w-8 text-blue-500" />
              <span className="hidden md:inline font-semibold text-base">{user?.name || "User"}</span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 text-sm text-gray-700 overflow-hidden transform origin-top-right animate-fade-in-scale">
                <div className="px-4 py-3 bg-pink-50 font-bold border-b border-gray-100 text-gray-800">
                  👋 Welcome, {user?.name || "User"}
                </div>
                <div className="px-4 py-3 space-y-1">
                  <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                  <p><strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border-t border-gray-100 font-semibold transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 hover:text-pink-600 transition-colors duration-200 p-2.5 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2 text-gray-700">
          <Link to="/home" className="block px-4 py-2 rounded-md hover:text-pink-600 hover:bg-pink-50 transition-colors duration-200">Home</Link>
          <Link to="/explore" className="block px-4 py-2 rounded-md hover:text-pink-600 hover:bg-pink-50 transition-colors duration-200">Explore</Link>
          <Link to="/bucketlist" className="block px-4 py-2 rounded-md hover:text-pink-600 hover:bg-pink-50 transition-colors duration-200">Bucketlist</Link>
          <Link to="/ai" className="block px-4 py-2 rounded-md hover:text-pink-600 hover:bg-pink-50 transition-colors duration-200">AI Itinerary</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
