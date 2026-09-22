"use client";

import { useContent } from "@/app/context/ContentContext";
import { useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

interface EditableFieldProps {
  section: string;
  field: string;
  fallback: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div" | "a";
  className?: string;
  multiline?: boolean;
}

export default function EditableField({
  section,
  field,
  fallback,
  as = "span",
  className = "",
  multiline = false,
}: EditableFieldProps) {
  const { content, isEditMode, updateField } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");

  // Admin value overrides fallback; if not set, fallback is used
  const adminValue = content?.[section]?.[field];
  const value = adminValue !== undefined && adminValue !== null ? adminValue : fallback;

  const startEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateField(section, field, tempValue);
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  const Tag = as as any;

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-blue-500 rounded p-2 bg-blue-50 z-50">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border rounded text-gray-800 bg-white text-base"
            rows={4}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border rounded text-gray-800 bg-white text-base"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={saveEdit}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-700"
          >
            <FaCheck /> Save
          </button>
          <button
            onClick={cancelEdit}
            className="bg-gray-400 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-500"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group inline-block">
      <Tag className={className}>{value}</Tag>
      <button
        onClick={startEdit}
        className="absolute -top-3 -right-3 bg-blue-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50"
        title={`Edit ${section}.${field}`}
      >
        <FaEdit size={12} />
      </button>
    </div>
  );
}