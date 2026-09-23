"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// LocalStorage key used by the admin panel to persist drafts for preview
const DRAFT_STORAGE_KEY = "symposium_draft_content";

interface ContentContextType {
  content: Record<string, Record<string, string>>;
  items: Record<string, any[]>;
  isEditMode: boolean;
  isSuperAdmin: boolean;
  isPreviewMode: boolean;
  hasUnsavedChanges: boolean;
  loading: boolean;
  toggleEditMode: () => void;
  updateField: (section: string, field: string, value: string) => void;
  updateItems: (section: string, items: any[]) => void;
  saveContent: () => Promise<void>;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({
  pageSlug,
  children,
}: {
  pageSlug: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const wantsEdit = searchParams?.get("edit") === "1";
  const wantsPreview = searchParams?.get("preview") === "1";

  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const [pendingFields, setPendingFields] = useState<
    Record<string, Record<string, string>>
  >({});
  const [pendingItems, setPendingItems] = useState<Record<string, any[]>>({});

  // ===== Fetch page content from the API =====
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content/${pageSlug}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || {});
        setItems(data.items || {});
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  // ===== Load draft content from localStorage (admin preview) =====
  // This runs AFTER fetchContent so the draft can override DB content.
  const applyLocalDraft = useCallback(() => {
    if (!wantsPreview) return;
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;

      const drafts = JSON.parse(raw) as Record<
        string,
        {
          section: string;
          fields: { key: string; value: string }[];
          list?: { key: string; items: any[] };
        }[]
      >;

      const pageDraft = drafts[pageSlug];
      if (!pageDraft) return;

      // Convert draft sections into the { content, items } shape the context uses
      const draftContent: Record<string, Record<string, string>> = {};
      const draftItems: Record<string, any[]> = {};

      pageDraft.forEach((section) => {
        section.fields?.forEach((f) => {
          if (!draftContent[section.section]) draftContent[section.section] = {};
          // Extract the short field name after the dot (e.g. "hero.title" → "title")
          const shortKey = f.key.includes(".") ? f.key.split(".").slice(1).join(".") : f.key;
          draftContent[section.section][shortKey] = f.value;
        });

        if (section.list) {
          draftItems[section.list.key] = section.list.items;
        }
      });

      // Merge draft on top of DB content
      setContent((prev) => {
        const merged = { ...prev };
        Object.entries(draftContent).forEach(([section, fields]) => {
          merged[section] = { ...(merged[section] || {}), ...fields };
        });
        return merged;
      });

      setItems((prev) => ({ ...prev, ...draftItems }));
    } catch (err) {
      console.error("Failed to apply local draft:", err);
    }
  }, [pageSlug, wantsPreview]);

  // ===== Verify super admin role =====
  const verifyAdmin = useCallback(async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      setIsSuperAdmin(false);
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        const isAdmin = user.role === "admin";
        setIsSuperAdmin(isAdmin);
        return isAdmin;
      }
    } catch {
      /* ignore */
    }
    setIsSuperAdmin(false);
    return false;
  }, []);

  useEffect(() => {
    (async () => {
      await fetchContent();
      const admin = await verifyAdmin();
      // Auto-enable edit mode if admin arrived with ?edit=1
      if (admin && wantsEdit) {
        setIsEditMode(true);
      }
    })();
  }, [fetchContent, verifyAdmin, wantsEdit]);

  // Apply local draft AFTER DB content is loaded (separate effect so
  // fetchContent's async completion triggers the merge).
  useEffect(() => {
    if (!loading) {
      applyLocalDraft();
    }
  }, [loading, applyLocalDraft]);

  // ===== Update a single field =====
  const updateField = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
    setPendingFields((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
    setHasUnsavedChanges(true);
  };

  // ===== Update a list =====
  const updateItems = (section: string, newItems: any[]) => {
    setItems((prev) => ({ ...prev, [section]: newItems }));
    setPendingItems((prev) => ({ ...prev, [section]: newItems }));
    setHasUnsavedChanges(true);
  };

  // ===== Save everything to the database =====
  const saveContent = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated. Please login as admin.");

    const updates = Object.entries(pendingFields).flatMap(([section_key, fields]) =>
      Object.entries(fields).map(([field_key, field_value]) => ({
        section_key,
        field_key: field_key.includes(".") ? field_key.split(".").slice(1).join(".") : field_key,
        field_value,
        field_type: "text",
      }))
    );

    if (updates.length > 0) {
      const res = await fetch(`${API_BASE}/api/admin/content/${pageSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save content");
      }
    }

    // ── Save each list section ──
    for (const [section_key, sectionItems] of Object.entries(pendingItems)) {
      const res = await fetch(
        `${API_BASE}/api/admin/content/${pageSlug}/items/${section_key}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: sectionItems }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to save items for ${section_key}`);
      }
    }

    setPendingFields({});
    setPendingItems({});
    setHasUnsavedChanges(false);
    await fetchContent();
  };

  // ===== Toggle edit mode =====
  const toggleEditMode = () => {
    if (!isSuperAdmin) return;
    if (isEditMode && hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Discard them?")) return;
      setPendingFields({});
      setPendingItems({});
      setHasUnsavedChanges(false);
      fetchContent();
    }
    setIsEditMode((prev) => !prev);
  };

  // ===== Memoize context value =====
  const value = useMemo(
    () => ({
      content,
      items,
      isEditMode,
      isSuperAdmin,
      isPreviewMode: wantsPreview,
      hasUnsavedChanges,
      loading,
      toggleEditMode,
      updateField,
      updateItems,
      saveContent,
      refreshContent: fetchContent,
    }),
    [
      content,
      items,
      isEditMode,
      isSuperAdmin,
      wantsPreview,
      hasUnsavedChanges,
      loading,
      fetchContent,
      // toggleEditMode / updateField / updateItems / saveContent close over
      // state setters only, so they're stable — no need to include them.
    ]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}