"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaHome,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaSave,
  FaUndo,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaEyeSlash,
  FaCopy,
} from "react-icons/fa";

import { Sidebar } from "@/app/admin/admin-components/Sidebar";
import { AdminHeader } from "@/app/admin/admin-components/AdminHeader";
import { useConfirm } from "@/app/admin/admin-components/useConfirm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// ── Event type ──
type EventItem = {
  id: string; // string in the UI; real DB IDs are numeric strings
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  category: string;
  status: "Draft" | "Published";
  featured: boolean;
};

const cryptoId = () =>
  `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const isRealId = (id: string) => /^\d+$/.test(id);

const normalizeEvent = (item: Record<string, any>): EventItem => ({
  id:
    item.id !== undefined && item.id !== null
      ? String(item.id)
      : cryptoId(),
  title: typeof item.title === "string" ? item.title : "",
  description: typeof item.description === "string" ? item.description : "",
  date: typeof item.date === "string" ? item.date : "",
  endDate: typeof item.endDate === "string" ? item.endDate : "",
  location: typeof item.location === "string" ? item.location : "",
  category: typeof item.category === "string" ? item.category : "Announcement",
  status: item.status === "Published" ? "Published" : "Draft",
  featured: !!item.featured,
});

const createBlankEvent = (): EventItem => ({
  id: cryptoId(),
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  endDate: "",
  location: "",
  category: "Announcement",
  status: "Draft",
  featured: false,
});

export default function AdminNewsEvents() {
  const { confirm, ConfirmDialogHost } = useConfirm();

  // ── State ──
  const [events, setEvents] = useState<EventItem[]>([]);
  const [pristineEvents, setPristineEvents] = useState<EventItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Draft" | "Published"
  >("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Load from DB ──
  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      setIsLoadingContent(true);
      setHasUnsavedChanges(false);
      setSaveError(null);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        const res = await fetch(`${API_BASE}/api/admin/events`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(
            errBody.detail || `Failed to load events (${res.status})`
          );
        }

        const dbEvents: any[] = await res.json();
        const normalized = dbEvents.map(normalizeEvent);

        if (!cancelled) {
          setEvents(normalized);
          setPristineEvents(JSON.parse(JSON.stringify(normalized)));
        }
      } catch (err: any) {
        console.error("[AdminNewsEvents] Failed to load events:", err);
        if (!cancelled) {
          setSaveError(err.message || "Failed to load events.");
          // Leave list empty — do not fall back to stale static seeds,
          // since those don't represent what's actually in the DB.
          setEvents([]);
          setPristineEvents([]);
        }
      } finally {
        if (!cancelled) setIsLoadingContent(false);
      }
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Dirty check ──
  useEffect(() => {
    const original = JSON.stringify(pristineEvents);
    const draft = JSON.stringify(events);
    setHasUnsavedChanges(original !== draft);
  }, [events, pristineEvents]);

  // ── Event CRUD (all local — persisted only on Save) ──
  const handleAddEvent = () => {
    const newEvent = createBlankEvent();
    setEvents((prev) => [newEvent, ...prev]);
    setExpandedId(newEvent.id);
  };

  const handleEventChange = (eventId: string, patch: Partial<EventItem>) => {
    setEvents((prev) =>
      prev.map((it) => (it.id === eventId ? { ...it, ...patch } : it))
    );
  };

  const handleDeleteEvent = async (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    const ok = await confirm({
      title: "Delete this event?",
      message: `"${evt?.title || "This event"}" will be removed. You'll still need to click Save to persist the change.`,
      confirmLabel: "Yes, Delete",
      cancelLabel: "Cancel",
      variant: "warning",
    });
    if (!ok) return;
    setEvents((prev) => prev.filter((it) => it.id !== eventId));
    if (expandedId === eventId) setExpandedId(null);
  };

  const handleDuplicateEvent = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;
    const clone: EventItem = {
      ...evt,
      id: cryptoId(),
      title: `${evt.title} (Copy)`,
      status: "Draft",
      featured: false,
    };
    setEvents((prev) => {
      const idx = prev.findIndex((it) => it.id === eventId);
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    setExpandedId(clone.id);
  };

  const handleMoveEvent = (eventId: string, direction: -1 | 1) => {
    setEvents((prev) => {
      const idx = prev.findIndex((it) => it.id === eventId);
      const newIdx = idx + direction;
      if (idx < 0 || newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  // ── Actual DB save ──
  const performSave = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const payload = {
        events: events.map((e) => ({
          // Send numeric IDs only for existing rows
          ...(isRealId(e.id) ? { id: Number(e.id) } : {}),
          title: e.title,
          description: e.description,
          date: e.date,
          endDate: e.endDate || "",
          location: e.location,
          category: e.category,
          status: e.status,
          featured: e.featured,
        })),
      };

      const res = await fetch(`${API_BASE}/api/admin/events/bulk-save`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to save events");
      }

      const data: { events: any[] } = await res.json();
      const saved = (data.events || []).map(normalizeEvent);

      setEvents(saved);
      setPristineEvents(JSON.parse(JSON.stringify(saved)));
      setHasUnsavedChanges(false);
    } catch (err: any) {
      console.error("[AdminNewsEvents] Save failed:", err);
      setSaveError(err.message || "Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [events]);

  const handleSave = useCallback(async () => {
    const total = events.length;
    const drafts = events.filter((e) => e.status === "Draft").length;
    const published = total - drafts;

    const ok = await confirm({
      title: "Save News & Events changes?",
      message: (
        <>
          You're about to save <strong>{total}</strong> event
          {total === 1 ? "" : "s"} (<strong>{published}</strong> published,{" "}
          <strong>{drafts}</strong> draft) to the live site. Visitors will see
          published events immediately.
        </>
      ),
      confirmLabel: "Yes, Save",
      cancelLabel: "Keep editing",
      variant: "primary",
    });

    if (!ok) return;
    await performSave();
  }, [confirm, events, performSave]);

  const handleDiscard = async () => {
    const ok = await confirm({
      title: "Discard unsaved changes?",
      message:
        "All changes made since the last save will be lost. This action cannot be undone.",
      confirmLabel: "Yes, Discard",
      cancelLabel: "Keep editing",
      variant: "warning",
    });
    if (!ok) return;
    setEvents(JSON.parse(JSON.stringify(pristineEvents)));
    setHasUnsavedChanges(false);
    setSaveError(null);
    setExpandedId(null);
  };

  // ── Filtered events ──
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "All" || e.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, searchQuery, categoryFilter, statusFilter]);

  const categories = useMemo(
    () =>
      Array.from(new Set(events.map((e) => e.category).filter(Boolean))).sort(),
    [events]
  );

  const counts = useMemo(
    () => ({
      total: events.length,
      published: events.filter((e) => e.status === "Published").length,
      draft: events.filter((e) => e.status === "Draft").length,
    }),
    [events]
  );

  // ── Render ──
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col">
        <AdminHeader />

        <div className="p-8 h-[calc(100vh-64px)] overflow-y-auto">
          {/* ── Breadcrumb + Header ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <FaHome /> <FaChevronRight className="text-xs" />
              <span>News &amp; Events</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  News &amp; Events
                </h1>
                <p className="text-sm text-gray-500">
                  Create, edit, and publish events shown on the symposium
                  website.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <button
                    onClick={handleDiscard}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200 disabled:opacity-50"
                  >
                    <FaUndo /> Discard
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm ${
                    hasUnsavedChanges && !isSaving
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaSave /> {isSaving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                >
                  <FaPlus /> Add Event
                </button>
              </div>
            </div>
          </div>

          {/* ── Error banner ── */}
          {saveError && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p>{saveError}</p>
              </div>
            </div>
          )}

          {/* ── Unsaved banner ── */}
          {hasUnsavedChanges && (
            <div className="mb-6 flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              You have unsaved changes. Don't forget to click{" "}
              <strong>Save Changes</strong>.
            </div>
          )}

          {isLoadingContent ? (
            <div className="flex items-center justify-center py-24 text-sm text-gray-400">
              Loading events…
            </div>
          ) : (
            <>
              {/* ── Stats ── */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Events" value={counts.total} />
                <StatCard
                  label="Published"
                  value={counts.published}
                  accent="green"
                />
                <StatCard
                  label="Drafts"
                  value={counts.draft}
                  accent="yellow"
                />
              </div>

              {/* ── Toolbar ── */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-55">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events by title, description, or location…"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {(["All", "Published", "Draft"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        statusFilter === s
                          ? "bg-white text-gray-800 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Events list ── */}
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-20 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                    {events.length === 0 ? (
                      <>
                        <p className="mb-3">No events yet.</p>
                        <button
                          onClick={handleAddEvent}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          <FaPlus /> Create your first event
                        </button>
                      </>
                    ) : (
                      "No events match your filters."
                    )}
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    // Real position in the full (unfiltered) list, for move up/down
                    const realIndex = events.findIndex((x) => x.id === evt.id);
                    return (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        index={realIndex}
                        total={events.length}
                        expanded={expandedId === evt.id}
                        onToggleExpand={() =>
                          setExpandedId((cur) =>
                            cur === evt.id ? null : evt.id
                          )
                        }
                        onChange={(patch) => handleEventChange(evt.id, patch)}
                        onDelete={() => handleDeleteEvent(evt.id)}
                        onDuplicate={() => handleDuplicateEvent(evt.id)}
                        onMoveUp={() => handleMoveEvent(evt.id, -1)}
                        onMoveDown={() => handleMoveEvent(evt.id, 1)}
                      />
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {ConfirmDialogHost}
    </div>
  );
}

// ── Stat card ──
function StatCard({
  label,
  value,
  accent = "blue",
}: {
  label: string;
  value: number;
  accent?: "blue" | "green" | "yellow";
}) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
  }[accent];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold inline-block px-2 py-0.5 rounded ${colors}`}
      >
        {value}
      </p>
    </div>
  );
}

// ── Event card ──
function EventCard({
  event,
  index,
  total,
  expanded,
  onToggleExpand,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  event: EventItem;
  index: number;
  total: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (patch: Partial<EventItem>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const update = <K extends keyof EventItem>(key: K, value: EventItem[K]) =>
    onChange({ [key]: value } as Partial<EventItem>);

  const isPublished = event.status === "Published";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* ── Header row ── */}
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <button
            onClick={onMoveUp}
            disabled={index <= 0}
            className="text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <FaChevronUp className="text-[10px]" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index < 0 || index >= total - 1}
            className="text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <FaChevronDown className="text-[10px]" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPublished ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              {event.status}
            </span>

            {event.featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                ★ Featured
              </span>
            )}

            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
              {event.category || "Uncategorized"}
            </span>

            {event.date && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <FaCalendarAlt className="text-[9px]" />
                {event.date}
                {event.endDate && ` – ${event.endDate}`}
              </span>
            )}

            {event.location && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1 truncate max-w-45">
                <FaMapMarkerAlt className="text-[9px]" />
                {event.location}
              </span>
            )}
          </div>

          <p className="text-base font-semibold text-gray-800 truncate">
            {event.title || "(Untitled event)"}
          </p>
          {event.description && (
            <p
              className={`text-xs text-gray-500 mt-1 ${
                expanded ? "" : "truncate"
              }`}
            >
              {event.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() =>
              update("status", isPublished ? "Draft" : "Published")
            }
            className={`p-2 rounded-lg transition-colors ${
              isPublished
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            title={isPublished ? "Unpublish (set to Draft)" : "Publish"}
          >
            {isPublished ? (
              <FaEye className="text-sm" />
            ) : (
              <FaEyeSlash className="text-sm" />
            )}
          </button>

          <button
            onClick={onDuplicate}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Duplicate event"
          >
            <FaCopy className="text-sm" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete event"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      {/* ── Expanded editor ── */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. 3rd International Agri-Life & Bioresource Science Symposium"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                value={event.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Announcement"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Event Description
            </label>
            <textarea
              rows={4}
              value={event.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the event, its purpose, and what attendees can expect…"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End Date <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="date"
                value={event.endDate || ""}
                onChange={(e) => update("endDate", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Location
              </label>
              <input
                type="text"
                value={event.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Manila, Philippines"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={event.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">
                Feature this event on the homepage
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Status:</span>
              <select
                value={event.status}
                onChange={(e) =>
                  update("status", e.target.value as EventItem["status"])
                }
                className="px-2 py-1 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}