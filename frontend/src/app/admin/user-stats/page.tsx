"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/user-stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <h2 className="text-2xl font-semibold mb-3">User Usage Stats</h2>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="min-w-full border border-gray-300 mt-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Username</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Total API Usage</th>
            </tr>
          </thead>

          <tbody>
            {stats.map((s) => (
              <tr key={s.userId}>
                <td className="border px-4 py-2">
                  {s.user?.name || "Unknown"}
                </td>
                <td className="border px-4 py-2">
                  {s.user?.email || "Unknown"}
                </td>
                <td className="border px-4 py-2">{s.totalUsage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
