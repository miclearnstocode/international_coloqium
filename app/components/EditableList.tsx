"use client";

import { useContent } from "@/app/context/ContentContext";
import { ReactNode } from "react";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

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
  const { items, isEditMode, updateItems } = useContent();

  const adminItems = items?.[section];
  const listItems = adminItems && adminItems.length > 0 ? adminItems : fallback;

  const handleUpdate = (index: number, newItem: any) => {
    const newList = [...listItems];
    newList[index] = newItem;
    updateItems(section, newList);
  };

  const handleAdd = () => {
    updateItems(section, [...listItems, { ...emptyItem }]);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Delete this item?")) return;
    updateItems(section, listItems.filter((_: any, i: number) => i !== index));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= listItems.length) return;
    const newList = [...listItems];
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    updateItems(section, newList);
  };

  return (
    <div className="space-y-2">
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
          {renderItem(item, index, isEditMode, (newItem) =>
            handleUpdate(index, newItem)
          )}
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