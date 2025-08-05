import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      // Only parse if savedUser is not null/undefined AND is not the string "undefined" or "null"
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      // If parsing fails, clear invalid data
      localStorage.removeItem("user");
    }
    return null; // Default to null if no valid user data or parsing failed
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    // Ensure the token is not the literal string "undefined" or "null"
    if (savedToken && savedToken !== "undefined" && savedToken !== "null") {
        return savedToken;
    }
    return null; // Default to null if no valid token
  });


  // Define the login function
  const login = (newToken, userDetails) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userDetails));
    setToken(newToken);
    setUser(userDetails);
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken || storedToken === "undefined" || storedToken === "null") {
        setToken(null);
        setUser(null);
        return;
      }
      setToken(storedToken);

      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("User profile fetch failed", err.response?.data || err.message);
        logout(); // Invalidate session if token is bad or fetch fails
      }
    };

    fetchUserDetails();
  }, []);

  const authContextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};