import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Setting the global Axios header if a token exists
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    setLoading(false);
  }, [token]);

  // --- Login Function ---
  const login = async (email, password) => {
    try {
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

      // Store token and user data in localStorage
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${receivedToken}`;

      return true; // Login successful
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );

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

  // --- Registration Function ---
  const register = async (userData) => {
    try {
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
