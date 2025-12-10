// client/src/components/Header.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Smart Event Booking
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6 items-center">
          <Link
            to="/events"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Browse Events
          </Link>

          {user ? (
            // Logged In State
            <>
              <span className="text-gray-500 text-sm hidden sm:inline">
                Hello, {user.username || user.email}!
              </span>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // Logged Out State
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
