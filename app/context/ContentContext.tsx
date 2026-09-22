"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ContentContextType {
  content: Record<string, Record<string, string>>;
  items: Record<string, any[]>;
  isEditMode: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  toggleEditMode: () => void;
  updateField: (section: string, field: string, value: string) => void;
  updateItems: (section: string, items: any[]) => void;
  saveContent: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

const ContentContext = createContext<ContentContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export function ContentProvider({
  children,
  pageSlug,
}: {
  children: ReactNode;
  pageSlug: string;
}) {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [originalContent, setOriginalContent] = useState({});
  const [originalItems, setOriginalItems] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is super admin
  useEffect(() => {
    if (typeof window === "undefined") return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsSuperAdmin(user?.role === "super_admin");
  }, []);

  // Fetch content
  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`${API_URL}/api/content/${pageSlug}`);
        const data = await res.json();
        setContent(data.content || {});
        setItems(data.items || {});
        setOriginalContent(data.content || {});
        setOriginalItems(data.items || {});
      } catch (err) {
        console.error("Failed to fetch content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [pageSlug]);

  const updateField = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const updateItems = (section: string, newItems: any[]) => {
    setItems((prev) => ({ ...prev, [section]: newItems }));
  };

  const toggleEditMode = () => setIsEditMode((v) => !v);

  const hasUnsavedChanges =
    JSON.stringify(content) !== JSON.stringify(originalContent) ||
    JSON.stringify(items) !== JSON.stringify(originalItems);

  const saveContent = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated");

    // Build updates array
    const updates: any[] = [];
    Object.entries(content).forEach(([section, fields]) => {
      Object.entries(fields).forEach(([field, value]) => {
        updates.push({
          section_key: section,
          field_key: field,
          field_value: value,
          field_type: "text",
        });
      });
    });

    // Save fields
    const res = await fetch(`${API_URL}/api/admin/content/${pageSlug}`, {
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

    // Save items for each section
    for (const [section, sectionItems] of Object.entries(items)) {
      const r = await fetch(
        `${API_URL}/api/admin/content/${pageSlug}/items/${section}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: sectionItems }),
        }
      );
      if (!r.ok) throw new Error(`Failed to save items for ${section}`);
    }

    setOriginalContent(content);
    setOriginalItems(items);
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        items,
        isEditMode,
        isSuperAdmin,
        loading,
        toggleEditMode,
        updateField,
        updateItems,
        saveContent,
        hasUnsavedChanges,
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