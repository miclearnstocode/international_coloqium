"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

interface PageInfo {
  slug: string;
  name: string;
  path: string;
  field_count: number;
  item_count: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("access_token");

    if (!storedUser || storedUser.role !== "admin") {
      router.push("/login");
      return;
    }
    setUser(storedUser);

    async function fetchPages() {
      try {
        const res = await fetch(`${API_URL}/api/admin/pages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch pages");
        const data = await res.json();
        setPages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#1D3D6D]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0B2A4A] mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{user?.full_name}</span>. Click any page below to edit its content.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`${p.path}?edit=1`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-[#0B2A4A]">{p.name}</h2>
                <span className="text-xs bg-[#D5A54D] text-white px-2 py-1 rounded">
                  {p.slug}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Path: {p.path}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>📝 {p.field_count} fields</span>
                <span>📋 {p.item_count} items</span>
              </div>
              <div className="mt-4 text-sm font-semibold text-[#1D3D6D]">
                Edit Content →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}