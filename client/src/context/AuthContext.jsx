import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// 1. Create the Context object
const AuthContext = createContext();

// Define the API base URL (ensure this matches your backend port)
const API_URL = "http://localhost:3000/auth";

// 2. Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

// 3. Context Provider Component
export const AuthProvider = ({ children }) => {
  // State to hold the user data (id, username, email, role) and token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // --- Effect to initialize user state from token on load ---
  useEffect(() => {
    if (token) {
      // Decode or verify token locally (simpler approach: check validity via API later)
      // For now, we assume if we have a token, we are logged in.
      // In a real app, you'd verify the token payload here.
      // We'll rely on the backend to reject requests if the token is invalid.
    }
    setLoading(false);
  }, [token]);

  // --- Login Function ---
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token: receivedToken, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(userData);

      // Set the default Authorization header for all future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${receivedToken}`;

      return true; // Login successful
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return false; // Login failed
    }
  };

  // --- Logout Function ---
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // Remove the authorization header
    delete axios.defaults.headers.common["Authorization"];
  };

  // --- Registration Function ---
  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, userData);
      return true; // Registration successful
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      throw error; // Let the component handle the error message
    }
  };

  // Helper to check for admin role
  const isAdmin = user && user.role === "admin";

  // Value provided by the context
  const contextValue = {
    user,
    token,
    isAdmin,
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Show a loading state while checking the token */}
      {loading ? <div>Loading user session...</div> : children}
    </AuthContext.Provider>
  );
};
