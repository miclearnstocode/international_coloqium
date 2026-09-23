"use client";

import {
  FaEdit,
  FaEye,
  FaChevronRight,
  FaSync,
  FaExternalLinkAlt,
  FaUndo,
} from "react-icons/fa";
import {
  PageDefinition,
  SectionDefinition,
} from "@/app/admin/content-structures";
import { getCategoryColor } from "./utils";
import { useState } from "react";
import { useConfirm } from "./useConfirm";

export const PageDetailsView = ({
  selectedPage,
  draftContent,
  editorAvailable,
  isSaving,
  hasUnsavedChanges,
  onEdit,
  onViewPage,
  onDiscard,
  previewKey = 0,
}: {
  selectedPage: PageDefinition;
  draftContent?: SectionDefinition[];
  editorAvailable: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  onEdit: () => void;
  onViewPage: () => void;
  onDiscard?: () => void;
  previewKey?: number;
}) => {
  const [localKey, setLocalKey] = useState(0);
  const combinedKey = previewKey + localKey;

  // Confirmation dialog host
  const { confirm, ConfirmDialogHost } = useConfirm();

  // Prefer the DB-merged draft if provided, otherwise fall back to static structure
  const blocks =
    draftContent && draftContent.length > 0
      ? draftContent
      : selectedPage.structure;

  // ── Handlers that need confirmation ──

  const handleEditClick = async () => {
    // No confirmation needed if there are no pending changes
    if (!hasUnsavedChanges) {
      onEdit();
      return;
    }

    const ok = await confirm({
      title: "Open editor with unsaved changes?",
      message:
        "You have unsaved changes on this page. Opening the editor now will keep those changes so you can continue editing, but they won't be saved until you click Save.",
      confirmLabel: "Yes, Continue",
      cancelLabel: "Stay here",
      variant: "info",
    });

    if (ok) onEdit();
  };

  const handleViewPageClick = async () => {
    const ok = await confirm({
      title: "View the live page?",
      message: `Open "${selectedPage.name}" in a new tab? The page will open in preview mode so you can see how your content looks on the live site.`,
      confirmLabel: "Yes, Open",
      cancelLabel: "Cancel",
      variant: "primary",
    });

    if (ok) onViewPage();
  };

  const handleDiscardClick = async () => {
    if (!onDiscard) return;

    const ok = await confirm({
      title: "Discard unsaved changes?",
      message:
        "All changes made since the last save will be lost. This action cannot be undone.",
      confirmLabel: "Yes, Discard",
      cancelLabel: "Keep editing",
      variant: "warning",
    });

    if (ok) onDiscard();
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Live Page Preview ── */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Live Preview
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocalKey((k) => k + 1)}
                className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="Reload preview"
              >
                <FaSync /> Refresh
              </button>
              <a
                href={`${selectedPage.path}?preview=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                title="Open in new tab"
              >
                <FaExternalLinkAlt /> Open
              </a>
            </div>
          </div>

          <div className="w-full h-56 rounded-lg border border-blue-100 overflow-hidden bg-gray-100 relative">
            <iframe
              key={combinedKey}
              src={`${selectedPage.path}?preview=1`}
              title={`Preview: ${selectedPage.name}`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              style={{
                width: "1280px",
                height: "800px",
                transform: "scale(0.28)",
                transformOrigin: "top left",
                border: 0,
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            />
          </div>

          <p className="text-[10px] text-gray-400 mt-1.5 italic">
            Preview scaled to fit. Click "Open" to view the full page.
          </p>
        </div>

        {/* ── Page Title & Status ── */}
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {selectedPage.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 font-mono">
            {selectedPage.slug}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              selectedPage.status === "Published"
                ? "bg-green-100 text-green-700"
                : selectedPage.status === "Archived"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                selectedPage.status === "Published"
                  ? "bg-green-500"
                  : selectedPage.status === "Archived"
                    ? "bg-gray-500"
                    : "bg-yellow-500"
              }`}
            ></span>
            {selectedPage.status}
          </span>
        </div>

        {/* ── Meta Info ── */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Category</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                selectedPage.category
              )}`}
            >
              {selectedPage.category}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Last Updated</span>
            <span className="text-gray-800 text-xs">
              {selectedPage.updated}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Created</span>
            <span className="text-gray-800 text-xs">
              Sep 01, 2025 09:12 AM
            </span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── SEO Settings ── */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">SEO Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                defaultValue="3rd International Agri-Life & BioresourceScience Symposium"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                defaultValue="Join the 3rd International Agri-Life & BioresourceScience Symposium. Advancing sustainable agriculture, life sciences, and bioresource innovation for a better tomorrow."
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Page Visibility ── */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">
            Page Visibility
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
            <span className="text-xs text-gray-600">Visible on website</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Quick Actions ── */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleEditClick}
              disabled={!editorAvailable || isSaving}
              className={`flex items-center justify-center gap-2 py-2 rounded text-xs font-medium ${
                editorAvailable && !isSaving
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaEdit /> Edit Page
            </button>

            <button
              onClick={handleViewPageClick}
              className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded text-xs font-medium hover:bg-green-100 border border-green-200"
            >
              <FaEye /> View Page
            </button>

            {/* Only show Discard when there are unsaved changes */}
            {hasUnsavedChanges && onDiscard && (
              <button
                onClick={handleDiscardClick}
                disabled={isSaving}
                className="col-span-2 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-800 py-2 rounded text-xs font-medium hover:bg-yellow-100 border border-yellow-200 disabled:opacity-50"
              >
                <FaUndo /> Discard Unsaved Changes
              </button>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Page Content Blocks ── */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-gray-800">
              Page Content Blocks
            </h4>
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Manage Blocks
            </a>
          </div>
          <div className="space-y-4">
            {blocks.length > 0 ? (
              blocks.map((section, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">
                      {section.section}
                    </span>
                    <FaChevronRight className="text-gray-400 text-[10px]" />
                  </div>
                  <div className="p-3 space-y-2">
                    {section.fields.map((field, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex justify-between items-start text-xs gap-2"
                      >
                        <span className="text-gray-500 shrink-0 w-24">
                          {field.label}
                        </span>
                        <span
                          className="text-gray-800 truncate text-right flex-1"
                          title={field.value}
                        >
                          {field.value}
                        </span>
                      </div>
                    ))}
                    {section.list && (
                      <div className="mt-2 pt-2 border-t border-gray-50">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                          {section.list.label} ({section.list.items.length})
                        </span>
                        <div className="space-y-1">
                          {section.list.items
                            .slice(0, 3)
                            .map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="text-[10px] text-gray-500 truncate pl-2 border-l-2 border-gray-200"
                              >
                                {item.text ||
                                  item.title ||
                                  item.name ||
                                  item.label ||
                                  "Item"}
                              </div>
                            ))}
                          {section.list.items.length > 3 && (
                            <div className="text-[10px] text-gray-400 pl-2 italic">
                              + {section.list.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-8">
                Content structure for this page will appear here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation dialog host — renders nothing until confirm() is called */}
      {ConfirmDialogHost}
    </>
  );
};