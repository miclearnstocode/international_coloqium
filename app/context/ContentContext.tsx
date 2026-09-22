"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

interface ContentContextType {
  content: Record<string, Record<string, string>>;
  items: Record<string, any[]>;
  isEditMode: boolean;
  isSuperAdmin: boolean;
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
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

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

  // ===== Save everything =====
  const saveContent = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated. Please login as admin.");

    const updates = Object.entries(pendingFields).flatMap(
      ([section_key, fields]) =>
        Object.entries(fields).map(([field_key, field_value]) => ({
          section_key,
          field_key,
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

  return (
    <ContentContext.Provider
      value={{
        content,
        items,
        isEditMode,
        isSuperAdmin,
        hasUnsavedChanges,
        loading,
        toggleEditMode,
        updateField,
        updateItems,
        saveContent,
        refreshContent: fetchContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}