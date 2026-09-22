"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FaHome, FaChevronRight, FaSearch, FaUser, FaUserShield,
  FaUserTie, FaTrash, FaEdit, FaSave, FaTimes, FaEllipsisH,
} from "react-icons/fa";

import { Sidebar } from "@/app/admin/admin-components/Sidebar";
import { AdminHeader } from "@/app/admin/admin-components/AdminHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

interface UserRow {
  id: number;
  full_name: string;
  email: string;
  role: "user" | "staff" | "admin";
  created_at: string | null;
  is_self: boolean;
}

interface Stats {
  total: number;
  admin: number;
  staff: number;
  user: number;
}

export default function UsersAndRolesPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, admin: 0, staff: 0, user: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "staff" | "user">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"user" | "staff" | "admin">("user");
  const [savingId, setSavingId] = useState<number | null>(null);

  const token = () =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // ===== Fetch users =====
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to load users");
      }
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, admin: 0, staff: 0, user: 0 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Filtered list =====
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // ===== Handlers =====
  const startEdit = (user: UserRow) => {
    setEditingId(user.id);
    setEditName(user.full_name);
    setEditRole(user.role);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: number) => {
    setSavingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ full_name: editName, role: editRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to update user");
      }
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...data.user, is_self: u.is_self } : u))
      );
      // Refresh stats
      fetchUsers();
      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (user: UserRow) => {
    if (user.is_self) return;
    if (!confirm(`Delete ${user.full_name}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ===== Role badge =====
  const RoleBadge = ({ role }: { role: UserRow["role"] }) => {
    const map = {
      admin: { cls: "bg-purple-100 text-purple-700", Icon: FaUserShield, label: "Admin" },
      staff: { cls: "bg-blue-100 text-blue-700", Icon: FaUserTie, label: "Staff" },
      user:  { cls: "bg-gray-100 text-gray-700", Icon: FaUser, label: "User" },
    } as const;
    const { cls, Icon, label } = map[role];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        <Icon className="text-[10px]" /> {label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col">
        <AdminHeader isEditMode={false} onToggleEditMode={() => {}} />

        <div className="p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <FaHome /> <FaChevronRight className="text-xs" /> <span>Users & Roles</span>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Users & Roles</h1>
              <p className="text-sm text-gray-500">
                Manage registered accounts and their access levels.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users" value={stats.total} color="bg-gray-100 text-gray-700" />
            <StatCard label="Admins" value={stats.admin} color="bg-purple-100 text-purple-700" />
            <StatCard label="Staff" value={stats.staff} color="bg-blue-100 text-blue-700" />
            <StatCard label="Regular Users" value={stats.user} color="bg-gray-100 text-gray-700" />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <RoleTab label="All" active={roleFilter === "all"} onClick={() => setRoleFilter("all")} />
              <RoleTab label="Admins" active={roleFilter === "admin"} onClick={() => setRoleFilter("admin")} />
              <RoleTab label="Staff" active={roleFilter === "staff"} onClick={() => setRoleFilter("staff")} />
              <RoleTab label="Users" active={roleFilter === "user"} onClick={() => setRoleFilter("user")} />
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm w-72"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 text-sm">Loading users…</div>
            ) : error ? (
              <div className="p-12 text-center text-red-600 text-sm">{error}</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => {
                      const isEditing = editingId === user.id;
                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          {/* Name */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{user.full_name}</span>
                                {user.is_self && (
                                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-gray-600 font-mono text-xs">{user.email}</td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value as any)}
                                disabled={user.is_self}
                                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white disabled:bg-gray-100"
                              >
                                <option value="user">User</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <RoleBadge role={user.role} />
                            )}
                          </td>

                          {/* Created */}
                          <td className="px-6 py-4 text-gray-500 text-xs">
                            {user.created_at ?? "—"}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => saveEdit(user.id)}
                                    disabled={savingId === user.id}
                                    className="p-2 rounded bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                                    title="Save"
                                  >
                                    <FaSave className="text-xs" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    title="Cancel"
                                  >
                                    <FaTimes className="text-xs" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(user)}
                                    className="p-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    title="Edit"
                                  >
                                    <FaEdit className="text-xs" />
                                  </button>
                                  <button
                                    onClick={() => deleteUser(user)}
                                    disabled={user.is_self}
                                    className={`p-2 rounded ${
                                      user.is_self
                                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                        : "bg-red-50 text-red-700 hover:bg-red-100"
                                    }`}
                                    title={user.is_self ? "You cannot delete yourself" : "Delete"}
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-500">
                Showing {filtered.length} of {users.length} users
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== Helper components =====

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className={`inline-block text-2xl font-bold px-2 py-0.5 rounded ${color}`}>{value}</p>
  </div>
);

const RoleTab = ({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
      active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);