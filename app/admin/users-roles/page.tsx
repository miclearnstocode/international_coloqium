"use client";

import React, { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {FaHome, FaChevronRight, FaSearch, FaUser, FaUserShield, FaUserTie, FaTrash, FaEdit, FaSave, FaTimes, } from "react-icons/fa";
import { Sidebar } from "@/app/admin/admin-components/Sidebar";
import { AdminHeader } from "@/app/admin/admin-components/AdminHeader";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { apiFetch } from "../../lib/api";

type Role = "user" | "staff" | "admin" | "evaluator";

interface UserRow {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  created_at: string | null;
  is_self: boolean;
}

interface Stats {
  total: number;
  admin: number;
  staff: number;
  evaluator: number;
  user: number;
}

export default function UsersAndRolesPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, admin: 0, staff: 0, evaluator: 0, user: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("user");
  const [savingId, setSavingId] = useState<number | null>(null);

  const deleteDialog = useRef<HTMLDialogElement>(null);
  const deleteCancel = useRef<HTMLButtonElement>(null);
  const deletingRequest = useRef(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [finalDeleteStep, setFinalDeleteStep] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const element = deleteDialog.current;
    if (deleteTarget && element && !element.open) element.showModal();
    if (deleteTarget && finalDeleteStep) deleteCancel.current?.focus();
  }, [deleteTarget, finalDeleteStep]);

  const [showEvaluatorForm, setShowEvaluatorForm] = useState(false);
  const [creatingEvaluator, setCreatingEvaluator] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createMessage, setCreateMessage] = useState("");

  const token = () =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // ===== Fetch users =====
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to load users");
      }
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, admin: 0, staff: 0, evaluator: 0, user: 0 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createEvaluator = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setCreatingEvaluator(true);
    setCreateError("");
    setCreateMessage("");
    try {
      const res = await apiFetch("/api/admin/users/evaluators", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(fields)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Could not create evaluator account.");
      setShowEvaluatorForm(false);
      setCreateMessage("Evaluator account created. They can now sign in.");
      await fetchUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create evaluator account.");
    } finally {
      setCreatingEvaluator(false);
    }
  };

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
      const res = await apiFetch(`/api/admin/users/${id}`, {
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

  function requestDelete(user: UserRow) {
    if (user.is_self || deletingRequest.current) return;
    setDeleteError("");
    setDeleteMessage("");
    setFinalDeleteStep(false);
    setDeleteTarget(user);
  }

  async function deleteUser() {
    if (!deleteTarget || deleteTarget.is_self || !finalDeleteStep || deletingRequest.current) return;
    const user = deleteTarget;
    deletingRequest.current = true;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await apiFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Could not delete the account.");
      }

      setUsers((items) => items.filter((item) => item.id !== user.id));
      setDeleteMessage(`${user.full_name}’s account was deleted.`);
      deleteDialog.current?.close();
      await fetchUsers();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Could not delete the account.");
    } finally {
      deletingRequest.current = false;
      setDeleting(false);
    }
  }

  // ===== Role badge =====
  const RoleBadge = ({ role }: { role: UserRow["role"] }) => {
    const map = {
      admin: { cls: "bg-purple-100 text-purple-700", Icon: FaUserShield, label: "Admin" },
      staff: { cls: "bg-blue-100 text-blue-700", Icon: FaUserTie, label: "Staff" },
      evaluator: { cls: "bg-green-100 text-green-800", Icon: FaUserTie, label: "Evaluator" },
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
        <AdminHeader />

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

          <button
            type="button"
            onClick={() => { setShowEvaluatorForm(!showEvaluatorForm); setCreateError(""); setCreateMessage(""); }}
            disabled={creatingEvaluator}
            aria-expanded={showEvaluatorForm}
            className="mb-4 rounded-lg bg-[#0B2A4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {showEvaluatorForm ? "Cancel" : "Create evaluator"}
          </button>
          {createMessage && <p role="status" className="mb-4 text-sm text-green-800">{createMessage}</p>}
          {showEvaluatorForm && (
            <form onSubmit={createEvaluator} className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-1 text-sm font-medium">
                  Full name
                  <input name="full_name" required maxLength={100} autoComplete="off" className="rounded border border-zinc-300 px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Email
                  <input name="email" type="email" required maxLength={100} autoComplete="off" className="rounded border border-zinc-300 px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Password
                  <input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="rounded border border-zinc-300 px-3 py-2" />
                </label>
              </div>
              {createError && <p role="alert" className="mt-3 text-sm text-red-700">{createError}</p>}
              <button disabled={creatingEvaluator} className="mt-4 rounded-lg bg-[#28650C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {creatingEvaluator ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatCard label="Total Users" value={stats.total} color="bg-gray-100 text-gray-700" />
            <StatCard label="Admins" value={stats.admin} color="bg-purple-100 text-purple-700" />
            <StatCard label="Staff" value={stats.staff} color="bg-blue-100 text-blue-700" />
            <StatCard label="Evaluators" value={stats.evaluator} color="bg-green-100 text-green-800" />
            <StatCard label="Regular Users" value={stats.user} color="bg-gray-100 text-gray-700" />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <RoleTab label="All" active={roleFilter === "all"} onClick={() => setRoleFilter("all")} />
              <RoleTab label="Admins" active={roleFilter === "admin"} onClick={() => setRoleFilter("admin")} />
              <RoleTab label="Staff" active={roleFilter === "staff"} onClick={() => setRoleFilter("staff")} />
              <RoleTab label="Evaluator" active={roleFilter === "evaluator"} onClick={() => setRoleFilter("evaluator")} />
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

          {deleteMessage && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{deleteMessage}</p>}

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
                                onChange={(e) => setEditRole(e.target.value as Role)}
                                disabled={user.is_self}
                                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white disabled:bg-gray-100"
                              >
                                <option value="user">User</option>
                                <option value="staff">Staff</option>
                                <option value="evaluator">Evaluator</option>
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
                                    type="button"
                                    aria-haspopup="dialog"
                                    aria-label={`Delete ${user.full_name}`}
                                    onClick={() => requestDelete(user)}
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
        <dialog
          ref={deleteDialog}
          aria-labelledby="delete-user-title"
          aria-describedby="delete-user-description"
          onCancel={(event) => { if (deletingRequest.current) event.preventDefault(); }}
          onClose={() => { setDeleteTarget(null); setFinalDeleteStep(false); setDeleteError(""); }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border-t-4 border-rose-700 bg-white p-6 text-[#0B2A4A] shadow-2xl backdrop:bg-[#061F39]/65 backdrop:backdrop-blur-sm"
        >
          <div className="mb-4 grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-800">
            <FaTrash aria-hidden="true" />
          </div>
          <h2 id="delete-user-title" className="text-xl font-bold">{finalDeleteStep ? "Confirm account deletion" : "Delete this user?"}</h2>
          {deleteTarget && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="wrap-break-word font-semibold">{deleteTarget.full_name}</p>
                <p className="wrap-break-word text-slate-600">{deleteTarget.email}</p>
              </div>
              <p id="delete-user-description" className="text-slate-600">
                {finalDeleteStep
                  ? "This permanently removes the account. Select Delete user to confirm."
                  : "Review the account details before continuing to the final confirmation."}
              </p>
            </div>
          )}
          {deleting && <LoadingIndicator label="Deleting user…" className="mt-4 text-sm font-semibold" />}
          {deleteError && <p role="alert" className="mt-4 text-sm text-rose-800">{deleteError}</p>}
          <div className={`mt-6 flex flex-wrap gap-2 text-sm font-semibold ${finalDeleteStep ? "flex-row-reverse justify-start" : "justify-end"}`}>
            <button ref={deleteCancel} type="button" disabled={deleting} onClick={() => deleteDialog.current?.close()} className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 disabled:opacity-60">
              Cancel
            </button>
            {finalDeleteStep ? (
              <button key="delete" type="button" disabled={deleting} onClick={() => void deleteUser()} className="rounded-lg bg-rose-800 px-4 py-2 text-white hover:bg-rose-900 disabled:opacity-60">
                {deleting ? "Deleting…" : "Delete user"}
              </button>
            ) : (
              <button key="continue" type="button" onClick={() => setFinalDeleteStep(true)} className="rounded-lg bg-[#0B2A4A] px-4 py-2 text-white hover:bg-[#163F59]">
                Continue
              </button>
            )}
          </div>
        </dialog>
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