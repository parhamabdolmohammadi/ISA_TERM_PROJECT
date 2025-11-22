"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/user-stats");
        const data = await res.json();
        setStats(data);
      } finally {
        setLoadingStats(false);
      }
    }

    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadStats();
    loadUsers();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex justify-end mb-6">
        <Link
          href="/admin/users"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          View User Stats →
        </Link>
      </div>

      {/* ======================== */}
      {/*  ENDPOINT TABLE SECTION  */}
      {/* ======================== */}
      <h2 className="text-2xl font-semibold mb-3">Endpoint Stats</h2>

      {loadingStats ? (
        <p>Loading…</p>
      ) : (
        <table className="min-w-full border border-gray-300 mb-12">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Method</th>
              <th className="border px-4 py-2">Endpoint</th>
              <th className="border px-4 py-2">Count</th>
              <th className="border px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.endpoint}>
                <td className="border px-4 py-2">{s.method}</td>
                <td className="border px-4 py-2">{s.endpoint}</td>
                <td className="border px-4 py-2">{s.count}</td>
                <td className="border px-4 py-2">
                  {new Date(s.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ======================== */}
      {/*      USER LIST TABLE     */}
      {/* ======================== */}
      <h2 className="text-2xl font-semibold mb-3">User List</h2>

      {loadingUsers ? (
        <p>Loading users…</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">
                  {/* Not functional yet */}
                  <button className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
