"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaHome,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaPlus,
  FaEllipsisH,
} from "react-icons/fa";

import { Sidebar } from "@/app/admin/admin-components/Sidebar";
import { AdminHeader } from "@/app/admin/admin-components/AdminHeader";
import { FilterTab } from "@/app/admin/admin-components/FilterTab";
import {
  PAGES,
  hasStructure,
  PageDefinition,
  SectionDefinition,
} from "@/app/admin/content-structures";
import { PageDetailsView } from "@/app/admin/admin-components/PageDetailsView";
import { ContentEditorView } from "@/app/admin/admin-components/ContentEditorView";
import { getCategoryColor } from "@/app/admin/admin-components/utils";
import { useConfirm } from "@/app/admin/admin-components/useConfirm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

const splitFieldKey = (key: string) =>
  key.includes(".") ? key.split(".").slice(1).join(".") : key;

export default function AdminPages() {
  // ── Confirm dialog hook ──
  const { confirm, ConfirmDialogHost } = useConfirm();

  // ── Existing state (unchanged) ──
  const [pages, setPages] = useState<PageDefinition[]>(PAGES);
  const [selectedPage, setSelectedPage] = useState<PageDefinition>(PAGES[0]);
  const [activeTab, setActiveTab] = useState<"details" | "editor">("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Published" | "Draft" | "Archived"
  >("All");
  const [draftContent, setDraftContent] = useState<SectionDefinition[]>([]);
  const [pristineDraft, setPristineDraft] = useState<SectionDefinition[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // ── Load draft from DB (unchanged) ──
  useEffect(() => {
    let cancelled = false;

    const loadDraftFromDB = async () => {
      setIsLoadingContent(true);
      setHasUnsavedChanges(false);
      setSaveError(null);

      const baseStructure: SectionDefinition[] = JSON.parse(
        JSON.stringify(selectedPage.structure)
      );

      try {
        const res = await fetch(`${API_BASE}/api/content/${selectedPage.slug}`);
        if (!res.ok) throw new Error("Failed to fetch page content");

        const data: {
          content: Record<string, Record<string, string>>;
          items: Record<string, any[]>;
        } = await res.json();

        const merged: SectionDefinition[] = baseStructure.map((section) => {
          const fields = section.fields.map((f) => {
            const lookupKey = splitFieldKey(f.key);
            const dbValue = data.content?.[section.section]?.[lookupKey];
            return dbValue !== undefined && dbValue !== null
              ? { ...f, value: dbValue }
              : f;
          });

          let list = section.list;
          if (section.list) {
            const dbItems = data.items?.[section.list.key];
            if (Array.isArray(dbItems) && dbItems.length > 0) {
              list = { ...section.list, items: dbItems };
            }
          }

          return { ...section, fields, list };
        });

        if (!cancelled) {
          setDraftContent(merged);
          setPristineDraft(JSON.parse(JSON.stringify(merged)));
        }
      } catch (err) {
        console.error("[AdminPages] Failed to load DB content:", err);
        if (!cancelled) {
          setDraftContent(baseStructure);
          setPristineDraft(JSON.parse(JSON.stringify(baseStructure)));
        }
      } finally {
        if (!cancelled) setIsLoadingContent(false);
      }
    };

    loadDraftFromDB();
    return () => {
      cancelled = true;
    };
  }, [selectedPage]);

  // ── Dirty check (unchanged) ──
  useEffect(() => {
    const original = JSON.stringify(pristineDraft);
    const draft = JSON.stringify(draftContent);
    setHasUnsavedChanges(original !== draft);
  }, [draftContent, pristineDraft]);

  // ── Derived (unchanged) ──
  const filteredPages = useMemo(
    () =>
      pages.filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter =
          activeFilter === "All" || p.status === activeFilter;
        return matchSearch && matchFilter;
      }),
    [pages, searchQuery, activeFilter]
  );

  const counts = useMemo(
    () => ({
      All: pages.length,
      Published: pages.filter((p) => p.status === "Published").length,
      Draft: pages.filter((p) => p.status === "Draft").length,
      Archived: pages.filter((p) => p.status === "Archived").length,
    }),
    [pages]
  );

  const editorAvailable = hasStructure(selectedPage.slug);

  // ── Field/list edit handlers (unchanged) ──
  const handleFieldChange = (sIdx: number, fieldKey: string, value: string) => {
    setDraftContent((prev) => {
      const next = [...prev];
      const section = { ...next[sIdx] };
      section.fields = section.fields.map((f) =>
        f.key === fieldKey ? { ...f, value } : f
      );
      next[sIdx] = section;
      return next;
    });
  };

  const handleListItemChange = (sIdx: number, iIdx: number, itemData: any) => {
    setDraftContent((prev) => {
      const next = [...prev];
      const section = { ...next[sIdx] };
      if (section.list) {
        const items = [...section.list.items];
        items[iIdx] = itemData;
        section.list = { ...section.list, items };
      }
      next[sIdx] = section;
      return next;
    });
  };

  const handleDeleteListItem = (sIdx: number, iIdx: number) => {
    setDraftContent((prev) => {
      const next = [...prev];
      const section = { ...next[sIdx] };
      if (section.list) {
        section.list = {
          ...section.list,
          items: section.list.items.filter((_, i) => i !== iIdx),
        };
      }
      next[sIdx] = section;
      return next;
    });
  };

  const handleAddListItem = (sIdx: number) => {
    setDraftContent((prev) => {
      const next = [...prev];
      const section = { ...next[sIdx] };
      if (section.list) {
        const template = section.list.items[0] || {};
        const newItem: any = {};
        Object.keys(template).forEach((k) => {
          newItem[k] = Array.isArray(template[k]) ? [] : "";
        });
        section.list = {
          ...section.list,
          items: [...section.list.items, newItem],
        };
      }
      next[sIdx] = section;
      return next;
    });
  };

  const handleViewPage = () => {
    const url = `${selectedPage.path}?preview=1`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ── The actual DB write (renamed from handleSave) ──
  const performSave = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const updates = draftContent.flatMap((section) =>
        section.fields.map((f) => ({
          section_key: section.section,
          field_key: splitFieldKey(f.key),
          field_value: f.value,
          field_type: f.type || "text",
        }))
      );

      if (updates.length > 0) {
        const res = await fetch(
          `${API_BASE}/api/admin/content/${selectedPage.slug}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ updates }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Failed to save fields");
        }
      }

      for (const section of draftContent) {
        if (!section.list) continue;
        const res = await fetch(
          `${API_BASE}/api/admin/content/${selectedPage.slug}/items/${section.list.key}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: section.list.items }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.detail || `Failed to save list "${section.list.key}"`
          );
        }
      }

      const timestamp = new Date().toLocaleString();
      const updatedPage: PageDefinition = {
        ...selectedPage,
        structure: JSON.parse(JSON.stringify(draftContent)),
        updated: timestamp,
      };
      setPages((prev) =>
        prev.map((p) => (p.slug === selectedPage.slug ? updatedPage : p))
      );
      setSelectedPage(updatedPage);
      setPristineDraft(JSON.parse(JSON.stringify(draftContent)));
      setHasUnsavedChanges(false);
      setPreviewKey((k) => k + 1);
    } catch (err: any) {
      console.error("[AdminPages] Save failed:", err);
      setSaveError(err.message || "Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [draftContent, selectedPage]);

  // ── Save handler: asks for confirmation, then runs the actual save ──
  const handleSave = useCallback(async () => {
    // Count what's about to change so the message is informative
    const fieldCount = draftContent.reduce(
      (sum, s) => sum + s.fields.filter((f) => f.value?.trim()).length,
      0
    );
    const listCount = draftContent.filter((s) => s.list).length;

    const ok = await confirm({
      title: `Save changes to "${selectedPage.name}"?`,
      message: (
        <>
          You're about to publish{" "}
          <strong>{fieldCount}</strong> content field
          {fieldCount === 1 ? "" : "s"}
          {listCount > 0 && (
            <>
              {" "}
              and <strong>{listCount}</strong> list
              {listCount === 1 ? "" : "s"}
            </>
          )}{" "}
          to the live site. Visitors will see the update immediately.
        </>
      ),
      confirmLabel: "Yes, Save",
      cancelLabel: "Keep editing",
      variant: "primary",
    });

    if (!ok) return;

    await performSave();
  }, [confirm, draftContent, selectedPage, performSave]);

  const handleDiscard = () => {
    setDraftContent(JSON.parse(JSON.stringify(pristineDraft)));
    setHasUnsavedChanges(false);
    setSaveError(null);
  };

  const handleAddPage = () => {
    const newPage: PageDefinition = {
      slug: `new-page-${pages.length + 1}`,
      name: "New Page",
      path: `/new-page-${pages.length + 1}`,
      category: "Uncategorized",
      status: "Draft",
      updated: new Date().toLocaleString(),
      structure: [],
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col">
        <AdminHeader />

        <div className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden">
          {/* LEFT: Pages table (unchanged) */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <FaHome /> <FaChevronRight className="text-xs" /> <span>Pages</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Pages
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage the content of the 3rd International Agri-Life &
                    BioresourceScience Symposium website.
                  </p>
                </div>
                <button
                  onClick={handleAddPage}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <FaPlus /> Add New Page
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FilterTab
                  label="All Pages"
                  count={counts.All}
                  active={activeFilter === "All"}
                  onClick={() => setActiveFilter("All")}
                />
                <FilterTab
                  label="Published"
                  count={counts.Published}
                  color="green"
                  active={activeFilter === "Published"}
                  onClick={() => setActiveFilter("Published")}
                />
                <FilterTab
                  label="Draft"
                  count={counts.Draft}
                  color="yellow"
                  active={activeFilter === "Draft"}
                  onClick={() => setActiveFilter("Draft")}
                />
                <FilterTab
                  label="Archived"
                  count={counts.Archived}
                  active={activeFilter === "Archived"}
                  onClick={() => setActiveFilter("Archived")}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages..."
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 bg-white">
                  <FaFilter className="text-xs" /> All Categories{" "}
                  <FaChevronDown className="text-xs" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 w-10">
                        <input type="checkbox" />
                      </th>
                      <th className="px-6 py-4">Page Title</th>
                      <th className="px-6 py-4">URL Slug</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Updated</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredPages.length > 0 ? (
                      filteredPages.map((page) => (
                        <tr
                          key={page.slug}
                          onClick={() => setSelectedPage(page)}
                          className={`cursor-pointer ${
                            selectedPage.slug === page.slug
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPage.slug === page.slug}
                              onChange={() => setSelectedPage(page)}
                            />
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {page.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                            {page.slug}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                page.category
                              )}`}
                            >
                              {page.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                page.status === "Published"
                                  ? "bg-green-100 text-green-700"
                                  : page.status === "Archived"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  page.status === "Published"
                                    ? "bg-green-500"
                                    : page.status === "Archived"
                                      ? "bg-gray-500"
                                      : "bg-yellow-500"
                                }`}
                              ></span>
                              {page.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs">
                            {page.updated}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-gray-400 hover:text-gray-600">
                              <FaEllipsisH />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No pages found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-auto border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
                <span className="text-xs text-gray-500">
                  Showing 1–{filteredPages.length} of {pages.length} pages
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded border border-gray-300 text-gray-400"
                    disabled
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  <button className="w-6 h-6 rounded bg-blue-600 text-white text-xs">
                    1
                  </button>
                  <button
                    className="p-1 rounded border border-gray-300 text-gray-400"
                    disabled
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details / Editor */}
          <div className="w-96 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "details"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Page Details
              </button>
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "editor"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Content Editor
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "details" ? (
                <PageDetailsView
                  selectedPage={selectedPage}
                  draftContent={draftContent}
                  editorAvailable={editorAvailable}
                  isSaving={isSaving}
                  onEdit={() => setActiveTab("editor")}
                  onViewPage={handleViewPage}
                  previewKey={previewKey}
                />
              ) : isLoadingContent ? (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                  Loading content…
                </div>
              ) : (
                <ContentEditorView
                  selectedPage={selectedPage}
                  editorAvailable={editorAvailable}
                  draftContent={draftContent}
                  hasUnsavedChanges={hasUnsavedChanges}
                  isSaving={isSaving}
                  saveError={saveError}
                  onFieldChange={handleFieldChange}
                  onListItemChange={handleListItemChange}
                  onAddListItem={handleAddListItem}
                  onDeleteListItem={handleDeleteListItem}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Confirm dialog portal — rendered once, driven by useConfirm ── */}
      {ConfirmDialogHost}
    </div>
  );
}