"use client";

import { useEffect } from "react";
import {
  FaEdit,
  FaUndo,
  FaSave,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { PageDefinition, SectionDefinition } from "@/app/admin/content-structures";

const PREFERRED_LIST_FIELD_ORDER: Record<string, string[]> = {
  announcements: ["month", "day", "category", "title", "description", "link_text", "link_url"],
};

const FIELD_SORT_PRIORITY: Record<string, number> = {
  month: 1, day: 2, date: 3, time: 4,
  category: 10, tag: 11,
  title: 20, name: 21, text: 22,
  description: 30, desc: 31, details: 32,
  link_text: 40, button_text: 41,
  link_url: 50, url: 51, href: 52,
};

const FIELD_LABELS: Record<string, string> = {
  month: "Month (e.g. OCT)",
  day: "Day (e.g. 05)",
  date: "Date",
  time: "Time",
  category: "Category / Tag",
  title: "Announcement Title",
  description: "Description",
  link_text: "Link / Button Text",
  link_url: "Link URL / Destination",
  text: "Text / Item Name",
  name: "Name",
  role: "Role / Position",
  location: "Location",
};

function getFieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getOrderedItemKeys(item: Record<string, any>, listKey?: string): string[] {
  const keys = Object.keys(item);
  const preferred = listKey ? PREFERRED_LIST_FIELD_ORDER[listKey] : undefined;
  if (preferred) {
    return [...preferred.filter((k) => keys.includes(k)), ...keys.filter((k) => !preferred.includes(k))];
  }
  return [...keys].sort((a, b) => {
    const pA = FIELD_SORT_PRIORITY[a] ?? 99;
    const pB = FIELD_SORT_PRIORITY[b] ?? 99;
    if (pA !== pB) return pA - pB;
    return a.localeCompare(b);
  });
}

export const ContentEditorView = ({
  open,
  selectedPage,
  editorAvailable,
  draftContent,
  hasUnsavedChanges,
  isSaving,
  saveError,
  onFieldChange,
  onListItemChange,
  onAddListItem,
  onDeleteListItem,
  onSave,
  onDiscard,
  onClose,
}: {
  open: boolean;
  selectedPage: PageDefinition;
  editorAvailable: boolean;
  draftContent: SectionDefinition[];
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
  saveError?: string | null;
  onFieldChange: (sIdx: number, key: string, value: string) => void;
  onListItemChange: (sIdx: number, iIdx: number, data: any) => void;
  onAddListItem: (sIdx: number) => void;
  onDeleteListItem: (sIdx: number, iIdx: number) => void;
  onSave: () => void;
  onDiscard: () => void;
  onClose: () => void;
}) => {
  // Escape key closes the modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) {
        if (!hasUnsavedChanges || confirm("You have unsaved changes. Close without saving?")) {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, hasUnsavedChanges, isSaving, onClose]);

  if (!open) return null;

  const handleClose = () => {
    if (isSaving) return;
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Close without saving?")) return;
    }
    onClose();
  };

  const handleSaveAndClose = async () => {
    await onSave();
    // onSave handles state; we don't auto-close here — admin can close manually after verifying
  };

  return (
    <div className="fixed inset-0 z-100 flex items-stretch justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      {/* Backdrop click → close */}
      <div className="absolute inset-0" onClick={handleClose} aria-hidden />

      {/* Modal panel */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#0B2A4A] to-[#1D3D6D] text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#D5A54D]/20 border border-[#D5A54D]/40 flex items-center justify-center shrink-0">
              <FaEdit className="text-[#D5A54D]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate">
                Editing: {selectedPage.name}
              </h2>
              <p className="text-xs text-white/70">
                {hasUnsavedChanges ? "You have unsaved changes" : "All changes saved"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onDiscard}
              disabled={!hasUnsavedChanges || isSaving}
              className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${
                hasUnsavedChanges && !isSaving
                  ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              }`}
            >
              <FaUndo /> Discard
            </button>
            <button
              onClick={handleSaveAndClose}
              disabled={!hasUnsavedChanges || isSaving}
              className={`text-sm px-5 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors ${
                hasUnsavedChanges && !isSaving
                  ? "bg-[#D5A54D] hover:bg-[#c2953f] text-white cursor-pointer"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <FaSave /> Save
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
              title="Close"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {saveError && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-start gap-3">
            <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{saveError}</p>
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
          {editorAvailable ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {draftContent.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-gray-100 pb-3">
                    {section.section}
                  </h4>
                  <div className="space-y-5">
                    {section.fields.map((field, fIdx) => (
                      <div key={fIdx}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            value={field.value}
                            onChange={(e) => onFieldChange(sIdx, field.key, e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
                          />
                        ) : (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => onFieldChange(sIdx, field.key, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}

                    {section.list && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-base font-bold text-blue-600">
                            {section.list.label}
                          </span>
                          <button
                            onClick={() => onAddListItem(sIdx)}
                            className="text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 cursor-pointer"
                          >
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-4">
                          {section.list.items.map((item, iIdx) => {
                            const orderedKeys = getOrderedItemKeys(item, section.list?.key);
                            const hasMonthAndDay =
                              orderedKeys.includes("month") && orderedKeys.includes("day");

                            return (
                              <div
                                key={iIdx}
                                className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg border border-gray-200"
                              >
                                <span className="text-sm text-gray-500 font-bold font-mono w-6 mt-2 shrink-0">
                                  {iIdx + 1}.
                                </span>
                                <div className="flex-1 flex flex-col gap-3 w-full min-w-0">
                                  {hasMonthAndDay && (
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                                          {getFieldLabel("month")}
                                        </label>
                                        <input
                                          type="text"
                                          value={item.month || ""}
                                          onChange={(e) =>
                                            onListItemChange(sIdx, iIdx, {
                                              ...item,
                                              month: e.target.value.toUpperCase(),
                                            })
                                          }
                                          placeholder="OCT"
                                          maxLength={4}
                                          className="w-full p-2.5 border border-gray-300 rounded-lg text-base font-bold text-[#1D3D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                                          {getFieldLabel("day")}
                                        </label>
                                        <input
                                          type="text"
                                          value={item.day || ""}
                                          onChange={(e) =>
                                            onListItemChange(sIdx, iIdx, {
                                              ...item,
                                              day: e.target.value,
                                            })
                                          }
                                          placeholder="05"
                                          maxLength={3}
                                          className="w-full p-2.5 border border-gray-300 rounded-lg text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {orderedKeys
                                    .filter((k) =>
                                      hasMonthAndDay ? k !== "month" && k !== "day" : true
                                    )
                                    .map((key) => {
                                      const value = item[key];

                                      if (Array.isArray(value)) {
                                        return (
                                          <div key={key} className="w-full">
                                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                                              {getFieldLabel(key)} (one per line)
                                            </label>
                                            <textarea
                                              value={value.join("\n")}
                                              onChange={(e) =>
                                                onListItemChange(sIdx, iIdx, {
                                                  ...item,
                                                  [key]: e.target.value
                                                    .split("\n")
                                                    .map((s: string) => s.trim())
                                                    .filter(Boolean),
                                                })
                                              }
                                              rows={Math.min(6, Math.max(3, value.length))}
                                              className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white"
                                              placeholder={`Enter ${key}, one per line`}
                                            />
                                          </div>
                                        );
                                      }

                                      if (key === "description" || key === "desc" || key === "details") {
                                        return (
                                          <div key={key} className="w-full">
                                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                                              {getFieldLabel(key)}
                                            </label>
                                            <textarea
                                              value={value || ""}
                                              onChange={(e) =>
                                                onListItemChange(sIdx, iIdx, {
                                                  ...item,
                                                  [key]: e.target.value,
                                                })
                                              }
                                              rows={3}
                                              placeholder={`Enter ${key}...`}
                                              className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white leading-relaxed"
                                            />
                                          </div>
                                        );
                                      }

                                      return (
                                        <div key={key} className="w-full">
                                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                                            {getFieldLabel(key)}
                                          </label>
                                          <input
                                            type="text"
                                            value={value || ""}
                                            onChange={(e) =>
                                              onListItemChange(sIdx, iIdx, {
                                                ...item,
                                                [key]: e.target.value,
                                              })
                                            }
                                            placeholder={`Enter ${key}...`}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                          />
                                        </div>
                                      );
                                    })}
                                </div>
                                <button
                                  onClick={() => onDeleteListItem(sIdx, iIdx)}
                                  className="text-red-400 hover:text-red-600 p-2 mt-1 shrink-0 rounded-lg hover:bg-red-50 cursor-pointer"
                                  title="Delete Item"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-base py-20">
              <FaEdit className="text-5xl mb-4" />
              <p>Editor not available for this page yet.</p>
            </div>
          )}
        </div>

        {/* ── Footer bar (unsaved changes reminder) ── */}
        {hasUnsavedChanges && (
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 flex justify-between items-center">
            <span className="text-sm text-blue-800 font-medium">
              You have unsaved changes.
            </span>
            <div className="flex gap-3">
              <button
                onClick={onDiscard}
                disabled={isSaving}
                className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 cursor-pointer font-medium"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAndClose}
                disabled={isSaving}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer font-bold"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <FaCheck /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};