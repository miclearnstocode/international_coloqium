import {
  FaEdit,
  FaUndo,
  FaSave,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { PageDefinition, SectionDefinition } from "@/app/admin/content-structures";

export const ContentEditorView = ({
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
}: {
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
}) => (
  <div className="flex flex-col h-full">
    {/* ── Header ── */}
    <div className="flex justify-between items-center mb-4">
      <span className="text-xs font-bold text-gray-700">
        Editing: {selectedPage.name}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onDiscard}
          disabled={!hasUnsavedChanges || isSaving}
          className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${
            hasUnsavedChanges && !isSaving
              ? "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
          }`}
        >
          <FaUndo /> Discard
        </button>
        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${
            hasUnsavedChanges && !isSaving
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
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
      </div>
    </div>

    {/* ── Error banner ── */}
    {saveError && (
      <div className="mb-3 bg-red-50 border border-red-200 rounded p-2 flex items-start gap-2">
        <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
        <p className="text-xs text-red-700">{saveError}</p>
      </div>
    )}

    {/* ── Body ── */}
    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto">
      {editorAvailable ? (
        <div className="space-y-6">
          {draftContent.map((section, sIdx) => (
            <div
              key={sIdx}
              className="bg-white p-4 rounded border border-gray-200 shadow-sm"
            >
              <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">
                {section.section}
              </h4>
              <div className="space-y-3">
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={field.value}
                        onChange={(e) =>
                          onFieldChange(sIdx, field.key, e.target.value)
                        }
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) =>
                          onFieldChange(sIdx, field.key, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}

                {section.list && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-600">
                        {section.list.label}
                      </span>
                      <button
                        onClick={() => onAddListItem(sIdx)}
                        className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                      >
                        + Add Item
                      </button>
                    </div>
                    <div className="space-y-2">
                      {section.list.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex gap-2 items-start bg-gray-50 p-2 rounded border border-gray-100"
                        >
                          <span className="text-[10px] text-gray-400 font-mono w-4 mt-1">
                            {iIdx + 1}.
                          </span>
                          <div className="flex-1 flex flex-col gap-1.5 w-full">
                            {Object.keys(item).map((key) => {
                              const value = item[key];

                              // Nested arrays (items, members, bullets, etc.)
                              if (Array.isArray(value)) {
                                return (
                                  <div key={key} className="w-full">
                                    <label className="block text-[9px] text-gray-400 uppercase mb-0.5">
                                      {key} (one per line)
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
                                      rows={Math.min(6, Math.max(2, value.length))}
                                      className="w-full p-1.5 border border-gray-200 rounded text-[10px] focus:outline-none focus:border-blue-400 resize-y"
                                      placeholder={`Enter ${key}, one per line`}
                                    />
                                  </div>
                                );
                              }

                              // Regular fields
                              return (
                                <input
                                  key={key}
                                  type="text"
                                  value={value || ""}
                                  onChange={(e) =>
                                    onListItemChange(sIdx, iIdx, {
                                      ...item,
                                      [key]: e.target.value,
                                    })
                                  }
                                  placeholder={key}
                                  className="w-full p-1 border border-gray-200 rounded text-[10px] focus:outline-none focus:border-blue-400"
                                />
                              );
                            })}
                          </div>
                          <button
                            onClick={() => onDeleteListItem(sIdx, iIdx)}
                            className="text-red-400 hover:text-red-600 p-1 mt-1"
                            title="Delete"
                          >
                            <FaTrash className="text-[10px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
          <FaEdit className="text-3xl mb-2" />
          <p>Editor not available for this page yet.</p>
        </div>
      )}
    </div>

    {/* ── Sticky unsaved-changes bar ── */}
    {hasUnsavedChanges && (
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3 flex justify-between items-center">
        <span className="text-xs text-blue-800 font-medium">
          You have unsaved changes.
        </span>
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
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
);