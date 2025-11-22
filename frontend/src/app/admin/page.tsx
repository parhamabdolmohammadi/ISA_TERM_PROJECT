"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/enpoint-stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load endpoint stats", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex justify-end mb-6">
        <Link
          href="/admin/user-stats"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          View User Stats →
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Endpoint Stats</h2>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="min-w-full border border-gray-300 mt-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Method</th>
              <th className="border px-4 py-2 text-left">Endpoint</th>
              <th className="border px-4 py-2 text-left">Count</th>
              <th className="border px-4 py-2 text-left">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {stats.map((s) => (
              <tr key={s.id}>
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
    </div>
  );
}
