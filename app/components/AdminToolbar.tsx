"use client";

import { useContent } from "@/app/context/ContentContext";
import { FaEdit, FaSave, FaEye } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

export default function AdminToolbar() {
  const {
    isEditMode,
    isSuperAdmin,
    toggleEditMode,
    saveContent,
    hasUnsavedChanges,
  } = useContent();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!isSuperAdmin) return null;

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await saveContent();
      setMessage("✅ Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end">
      {message && (
        <div className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-semibold border">
          {message}
        </div>
      )}

      <Link
        href="/admin"
        className="bg-white shadow-lg rounded-full px-4 py-2 text-xs font-semibold text-[#1D3D6D] border-2 border-[#1D3D6D] hover:bg-[#1D3D6D] hover:text-white transition"
      >
        ⚙️ Admin Dashboard
      </Link>

      <div className="bg-white shadow-2xl rounded-full p-2 flex items-center gap-2 border-2 border-[#1D3D6D]">
        <button
          onClick={toggleEditMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition ${
            isEditMode
              ? "bg-[#D5A54D] text-white"
              : "bg-[#1D3D6D] text-white hover:bg-[#16305a]"
          }`}
        >
          {isEditMode ? <FaEye /> : <FaEdit />}
          {isEditMode ? "Preview Mode" : "Edit Mode"}
        </button>

        {isEditMode && (
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition ${
              hasUnsavedChanges
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}