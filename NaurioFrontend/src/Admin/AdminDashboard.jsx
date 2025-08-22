// src/pages/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>
      <p>Welcome, {user?.username} (Role: {user?.role})</p>
      {/* You can add product/order management UI here */}
    </div>
  );
}
