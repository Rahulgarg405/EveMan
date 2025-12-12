import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 container mx-auto px-4 py-4 flex justify-between items-center text-white">
      <Link to="/" className="text-2xl font-bold">
        EveMan
      </Link>

      <div className="flex items-center space-x-6 text-sm">
        <span className="hidden sm:inline">(888) 123 4567</span>
        <span className="hidden sm:inline">rgarg3577@gmail.com</span>

        <Link
          to="/events"
          className="px-5 py-2 bg-white text-[#6F38E8] font-semibold rounded-full flex items-center shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Buy Ticket
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>

        {isAuthenticated ? (
          // --- LOGGED IN STATE ---
          <>
            <span className="hidden lg:inline text-white">
              Hello, {user.username || user.email}!
            </span>

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition duration-300 text-sm"
              >
                Admin Dashboard
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#6F38E8] transition duration-300 text-sm cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          // --- LOGGED OUT STATE ---
          <>
            <Link
              to="/login"
              className="text-white hover:text-gray-300 transition duration-300 hidden md:inline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-gray-300 transition duration-300 hidden md:inline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
