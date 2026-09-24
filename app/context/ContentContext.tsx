"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

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

/** Normalise whatever the backend sends as a role string into a canonical set. */
function resolveIsAdmin(role: unknown): boolean {
  if (!role || typeof role !== "string") return false;
  const normalised = role.toLowerCase().replace(/[\s_-]/g, "");
  // accept: "admin", "superadmin", "super_admin", "super-admin", "ADMIN", etc.
  return normalised === "admin" || normalised === "superadmin";
}

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

  // Refs so callbacks never become stale
  const pendingFieldsRef = useRef(pendingFields);
  const pendingItemsRef = useRef(pendingItems);
  useEffect(() => { pendingFieldsRef.current = pendingFields; }, [pendingFields]);
  useEffect(() => { pendingItemsRef.current = pendingItems; }, [pendingItems]);

  // ===== Fetch page content =====
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content/${pageSlug}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || {});
        setItems(data.items || {});
      }
    } catch (err) {
      console.error("[ContentContext] Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  // ===== Load draft from localStorage (preview mode) =====
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

      const draftContent: Record<string, Record<string, string>> = {};
      const draftItems: Record<string, any[]> = {};

      pageDraft.forEach((section) => {
        section.fields?.forEach((f) => {
          if (!draftContent[section.section]) draftContent[section.section] = {};
          const shortKey = f.key.includes(".") ? f.key.split(".").slice(1).join(".") : f.key;
          draftContent[section.section][shortKey] = f.value;
        });
        if (section.list) draftItems[section.list.key] = section.list.items;
      });

      setContent((prev) => {
        const merged = { ...prev };
        Object.entries(draftContent).forEach(([section, fields]) => {
          merged[section] = { ...(merged[section] || {}), ...fields };
        });
        return merged;
      });
      setItems((prev) => ({ ...prev, ...draftItems }));
    } catch (err) {
      console.error("[ContentContext] Failed to apply local draft:", err);
    }
  }, [pageSlug, wantsPreview]);

  // ===== Verify admin role =====
  const verifyAdmin = useCallback(async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      console.debug("[ContentContext] verifyAdmin: no token in localStorage");
      setIsSuperAdmin(false);
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const user = await res.json();
        console.debug("[ContentContext] /api/auth/me response:", user);

        const isAdmin = resolveIsAdmin(user.role);
        console.debug(
          `[ContentContext] role="${user.role}" → resolveIsAdmin=${isAdmin}`
        );
        setIsSuperAdmin(isAdmin);
        return isAdmin;
      } else {
        console.warn(
          `[ContentContext] /api/auth/me returned ${res.status} — treating as non-admin`
        );
      }
    } catch (err) {
      console.error("[ContentContext] verifyAdmin fetch error:", err);
    }

    setIsSuperAdmin(false);
    return false;
  }, []);

  // ===== Boot: fetch content + verify admin + enable edit mode if ?edit=1 =====
  useEffect(() => {
    (async () => {
      await fetchContent();
      const admin = await verifyAdmin();

      if (admin && wantsEdit) {
        console.debug("[ContentContext] Admin confirmed + ?edit=1 → enabling edit mode");
        setIsEditMode(true);
        return;
      }
      setIsEditMode(false);

      // Non-admin: strip ?edit=1 from the URL so the page looks totally normal
      if (wantsEdit && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("edit");
        window.history.replaceState(null, "", url.toString());
      }
    })();
  }, [fetchContent, verifyAdmin, wantsEdit]);

  // Apply draft AFTER content is fetched
  useEffect(() => {
    if (!loading) applyLocalDraft();
  }, [loading, applyLocalDraft]);

  // ===== THE KEY BIT: toggle body.editing for the CSS =====
  useEffect(() => {
    if (typeof document === "undefined") return;
    const on = isEditMode && isSuperAdmin;
    console.debug(`[ContentContext] body.editing → ${on} (isEditMode=${isEditMode}, isSuperAdmin=${isSuperAdmin})`);
    document.body.classList.toggle("editing", on);
    return () => {
      document.body.classList.remove("editing");
    };
  }, [isEditMode, isSuperAdmin]);

  // ===== Field / list updates =====
  const updateField = useCallback((section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
    setPendingFields((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateItems = useCallback((section: string, newItems: any[]) => {
    setItems((prev) => ({ ...prev, [section]: newItems }));
    setPendingItems((prev) => ({ ...prev, [section]: newItems }));
    setHasUnsavedChanges(true);
  }, []);

  // ===== Save =====
  const saveContent = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated. Please login as admin.");

    const currentPendingFields = pendingFieldsRef.current;
    const currentPendingItems = pendingItemsRef.current;

    const updates = Object.entries(currentPendingFields).flatMap(([section_key, fields]) =>
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
        throw new Error((err as any).detail || "Failed to save content");
      }
    }

    for (const [section_key, sectionItems] of Object.entries(currentPendingItems)) {
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
        throw new Error((err as any).detail || `Failed to save items for ${section_key}`);
      }
    }

    setPendingFields({});
    setPendingItems({});
    setHasUnsavedChanges(false);
    await fetchContent();
  }, [pageSlug, fetchContent]);

  const toggleEditMode = useCallback(() => {
    if (!isSuperAdmin) return;
    setIsEditMode((prev) => {
      const next = !prev;
      if (prev && hasUnsavedChanges) {
        if (!confirm("You have unsaved changes. Discard them?")) return prev;
        setPendingFields({});
        setPendingItems({});
        setHasUnsavedChanges(false);
        fetchContent();
      }
      return next;
    });
  }, [isSuperAdmin, hasUnsavedChanges, fetchContent]);

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
      toggleEditMode,
      updateField,
      updateItems,
      saveContent,
      fetchContent,
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