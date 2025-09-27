"use client";

import React, {createContext, useContext, useState, useEffect} from "react";
import Cookies from "js-cookie";
import {apiClient} from "@/lib/api";
import {LoginCredentials} from "@/lib/types";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = Cookies.get("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      console.log("Attempting login with credentials:", credentials);
      const response = await apiClient.login(
        credentials.username,
        credentials.password
      );
      console.log("Login response:", response);

      // Assuming the API returns a token or success indicator
      if (response.success || response.token) {
        const token = response.token || "authenticated"; // Fallback if no token returned
        console.log("Setting token:", token);
        Cookies.set("admin_token", token, {expires: 7}); // 7 days
        setIsAuthenticated(true);
        return true;
      }
      console.log("Login failed - no success or token in response");
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("admin_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
