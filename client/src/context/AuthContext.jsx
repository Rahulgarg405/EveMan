// client/src/context/AuthContext.jsx - SIMPLIFIED

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// NOTE: Ensure this URL matches your backend port (it was previously 5000)
const API_BASE_URL = "http://localhost:3000";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // We combine the token and user data into simple state variables
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  ); // Store/restore the full user object (incl. role)
  const [loading, setLoading] = useState(true);

  // --- Session Restoration and Axios Setup ---
  useEffect(() => {
    // 1. Set the global Axios header if a token exists
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // In this simpler model, we assume if the token and user data are in localStorage, the session is active.
      // A more robust app would still check token validity with a /profile API call here.
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    // 2. Stop loading state
    setLoading(false);
  }, [token]);

  // --- Login Function ---
  const login = async (email, password) => {
    try {
      // 1. Make the API call to your backend
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      // The backend MUST return { token: 'jwt...', user: { id: 1, role: 'admin', ... } }
      const { token: receivedToken, user: userData } = response.data;

      if (!receivedToken || !userData) {
        // Check for missing data in the response
        throw new Error("Login API did not return token or user data.");
      }

      // 2. Store token and user data in localStorage
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // 3. Update state
      setToken(receivedToken);
      setUser(userData);

      // 4. Set global Axios header
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${receivedToken}`;

      return true; // Login successful
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      // Crucial: Clear any stale data if login fails
      logout();
      return false;
    }
  };

  // --- Logout Function ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // --- Registration Function (no change) ---
  const register = async (userData) => {
    try {
      // Use the auth endpoint defined in the backend plan
      await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return true;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  // --- Helper Getters ---
  const isAuthenticated = !!token && !!user;
  const isAdmin = user && user.role === "admin";

  const contextValue = {
    isAuthenticated,
    user,
    isAdmin,
    login,
    logout,
    register,
    loading,
    token,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
