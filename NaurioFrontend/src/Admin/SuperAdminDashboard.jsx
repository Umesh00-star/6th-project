// src/pages/SuperAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", role: "ADMIN" });

  useEffect(() => {
    fetch("http://localhost:8080/api/admins", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setAdmins);
  }, [user]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/api/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(form),
    });
    setForm({ email: "", password: "", role: "ADMIN" });
    window.location.reload();
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">SuperAdmin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      <p>Welcome, {user?.username} (Role: {user?.role})</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="flex gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded-lg"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="border p-2 rounded-lg"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ADMIN">Admin</option>
            <option value="SUPERADMIN">SuperAdmin</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </form>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-4">All Admins</h2>
        <ul className="space-y-2">
          {admins.map((a) => (
            <li key={a.id} className="p-3 border rounded-lg">
              {a.email} - <span className="font-bold">{a.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
