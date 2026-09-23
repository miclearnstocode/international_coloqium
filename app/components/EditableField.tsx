"use client";

import { useContent } from "@/app/context/ContentContext";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

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
  const { content, isEditMode, updateField, saveContent, isSuperAdmin } =
    useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const adminValue = content?.[section]?.[field];
  const value =
    adminValue !== undefined && adminValue !== null ? adminValue : fallback;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEdit = () => {
    if (!isSuperAdmin) return;
    setTempValue(value);
    setIsEditing(true);
    setSaveState("idle");
  };

  const commitEdit = async () => {
    const trimmed = tempValue.trim();

    // No actual change → exit without hitting the API
    if (trimmed === value) {
      setIsEditing(false);
      return;
    }

    setSaveState("saving");
    updateField(section, field, trimmed);

    try {
      await saveContent();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1400);
    } catch (err) {
      console.error(`[EditableField] Save failed for ${section}.${field}:`, err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }

    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSaveState("idle");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
    // For multiline textareas, Ctrl/Cmd+Enter saves
    if (e.key === "Enter" && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      commitEdit();
    }
  };

  const Tag = as as any;

  // ── Read-only for visitors ──
  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  // ── Editing state ──
  if (isEditing) {
    return (
      <div className="relative border-2 border-blue-500 rounded p-2 bg-blue-50 z-50">
        {multiline ? (
          <textarea
            ref={(el) => {
              inputRef.current = el;
            }}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded text-gray-800 bg-white text-base"
            rows={4}
          />
        ) : (
          <input
            ref={(el) => {
              inputRef.current = el;
            }}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded text-gray-800 bg-white text-base"
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={commitEdit}
            disabled={saveState === "saving"}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-700 disabled:opacity-60"
          >
            {saveState === "saving" ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCheck />
            )}
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="bg-gray-400 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-500"
          >
            <FaTimes /> Cancel
          </button>
          <span className="text-[10px] text-gray-500 ml-2">
            {multiline ? "Ctrl+Enter to save · Esc to cancel" : "Enter to save · Esc to cancel"}
          </span>
        </div>
      </div>
    );
  }

  // ── Idle edit mode (pencil on hover) ──
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

      {saveState === "saved" && (
        <span className="absolute -top-3 -right-10 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full z-50 flex items-center gap-1">
          <FaCheck size={8} /> Saved
        </span>
      )}

      {saveState === "error" && (
        <span className="absolute -top-3 -right-12 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full z-50">
          Save failed
        </span>
      )}
    </div>
  );
}