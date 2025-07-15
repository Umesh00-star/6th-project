import React, { createContext, useContext, useState, useEffect } from "react";
import { isloggedIn, logout as clearSession } from "./Auth"; // Import logout to clear backend sessions if needed

// Create a React Context for authentication
const AuthContext = createContext();


// 🔒 AuthProvider Component

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user data
    const [loading, setLoading] = useState(true); // ✅ Add loading state


  // 🔁 Run once on initial mount to load session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {

      //  setUser(JSON.parse(storedUser));
      try {
        setUser(JSON.parse(storedUser)); // Restore user from storage
      } catch (e) {
        console.error("Failed to parse stored user", e);
        setUser(null);
      }
    } else {
      setUser(null); // No session found
    }


    // loadings
    setLoading(false);

  }, []);

  // ✅ Called after successful login
  const login = (userData, token) => {
    // Save user and token to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    // Update state so components re-render
    setUser(userData);
  };

  // 🚪 Called when user logs out
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    clearSession(); // Optional: backend session clearing
    setUser(null);
  };

  // 🔄 Called after updating user profile
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  //  const updateUser = (newUser) => {
  //   setUser(newUser);
  //   localStorage.setItem("user", JSON.stringify(newUser)); // persist on update
  // };

const deleteuser = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    // Call backend to delete user
    const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    // Clear local storage and state
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  } catch (err) {
    throw err; // Let UI handle the error
  }
};


  return (
    // Provide auth-related data and functions to all children components
    <AuthContext.Provider value={{ user, login, logout, updateUser, deleteuser, loading }}>
      {children}
    </AuthContext.Provider>
  );


};

// ==========================
// ✅ useAuth Hook (access context easily)
// ==========================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
