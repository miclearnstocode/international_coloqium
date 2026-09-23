"use client";

import { useContent } from "@/app/context/ContentContext";
import { ReactNode, useRef, useState, useCallback } from "react";
import {
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

interface EditableListProps {
  section: string;
  fallback?: any[];
  emptyItem?: any;
  renderItem: (
    item: any,
    index: number,
    editing: boolean,
    onUpdate: (newItem: any) => void
  ) => ReactNode;
}

export default function EditableList({
  section,
  fallback = [],
  emptyItem = {},
  renderItem,
}: EditableListProps) {
  const { items, isEditMode, updateItems, saveContent } = useContent();
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Debounce timer ref — lives across renders
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const adminItems = items?.[section];
  const listItems = adminItems && adminItems.length > 0 ? adminItems : fallback;

  // Debounced persist — waits 600ms of inactivity before firing
  const schedulePersist = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveState("saving");
      try {
        await saveContent();
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1400);
      } catch (err) {
        console.error(`[EditableList] Save failed for "${section}":`, err);
        setSaveState("error");
        setTimeout(() => setSaveState("idle"), 3000);
      }
    }, 600);
  }, [saveContent, section]);

  // Immediate persist — used for add/delete/move where the intent is clear
  const persistNow = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    try {
      await saveContent();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1400);
    } catch (err) {
      console.error(`[EditableList] Save failed for "${section}":`, err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const handleUpdate = (index: number, newItem: any) => {
    const newList = [...listItems];
    newList[index] = newItem;
    updateItems(section, newList);
    schedulePersist(); // debounced — good for typing
  };

  const handleAdd = async () => {
    const newList = [...listItems, { ...emptyItem }];
    updateItems(section, newList);
    await persistNow();
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Delete this item?")) return;
    const newList = listItems.filter((_: any, i: number) => i !== index);
    updateItems(section, newList);
    await persistNow();
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= listItems.length) return;
    const newList = [...listItems];
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    updateItems(section, newList);
    await persistNow();
  };

  return (
    <div className="space-y-2">
      {/* Save status badge */}
      {isEditMode && saveState !== "idle" && (
        <div className="flex justify-end">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
              saveState === "saving"
                ? "bg-blue-100 text-blue-700"
                : saveState === "saved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {saveState === "saving" && <FaSpinner className="animate-spin" />}
            {saveState === "saved" && <FaCheck />}
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved"
                : "Error"}
          </span>
        </div>
      )}

      {listItems.map((item: any, index: number) => (
        <div key={index} className="relative">
          {isEditMode && (
            <div className="absolute -left-12 top-0 flex flex-col gap-1 z-20">
              <button
                onClick={() => handleMove(index, -1)}
                className="bg-gray-600 text-white p-1 rounded text-xs hover:bg-gray-700"
                title="Move up"
              >
                <FaArrowUp size={10} />
              </button>
              <button
                onClick={() => handleMove(index, 1)}
                className="bg-gray-600 text-white p-1 rounded text-xs hover:bg-gray-700"
                title="Move down"
              >
                <FaArrowDown size={10} />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
                title="Delete"
              >
                <FaTrash size={10} />
              </button>
            </div>
          )}
          {renderItem(item, index, isEditMode, (newItem) => {
            handleUpdate(index, newItem);
          })}
        </div>
      ))}

      {isEditMode && (
        <button
          onClick={handleAdd}
          className="w-full border-2 border-dashed border-blue-500 text-blue-600 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-50 transition"
        >
          <FaPlus /> Add Item
        </button>
      )}
    </div>
  );
}