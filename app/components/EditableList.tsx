"use client";

import { useContent } from "@/app/context/ContentContext";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface EditableListProps<T = any> {
  section: string;
  fallback: T[];
  emptyItem: T;
  title?: string;
  subtitle?: string;
  itemLabel?: string;
  renderItem: (
    item: T,
    index: number,
    editing: boolean,
    onUpdate: (next: T) => void
  ) => React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function EditableList<T = any>({
  section,
  fallback,
  emptyItem,
  title,
  subtitle,
  itemLabel = "Item",
  renderItem,
  className = "",
  wrapperClassName = "",
}: EditableListProps<T>) {
  const { items, isEditMode, isSuperAdmin, updateItems } = useContent();
  const isActive = isEditMode && isSuperAdmin;

  const list: T[] = items?.[section] ?? fallback;

  const setList = (next: T[]) => updateItems(section, next);

  const handleUpdate = (i: number, next: T) => {
    const copy = [...list];
    copy[i] = next;
    setList(copy);
  };
  const handleAdd = () => setList([...list, { ...emptyItem }]);
  const handleDelete = (i: number) => setList(list.filter((_, k) => k !== i));
  const handleMove = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setList(copy);
  };

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  if (!isActive) {
    return (
      <div className={wrapperClassName}>
        {list.map((item, idx) => (
          <div key={idx} className={className}>
            {renderItem(item, idx, false, () => {})}
          </div>
        ))}
      </div>
    );
  }

  // ── EDIT MODE ──────────────────────────────────────────────────────────────
  return (
    <div className={`${wrapperClassName} relative space-y-3`}>
      {/* List Header Bar with Details */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0B2A4A] text-white rounded-lg px-3.5 py-2.5 shadow-sm border border-[#D5A54D]/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D5A54D] text-[#0B2A4A] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded shadow-xs">
              {title || `List · ${section}`}
            </span>
            <span className="text-xs font-semibold text-[#F0C674]">
              {list.length} {list.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-gray-300 mt-0.5">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A4A] bg-[#D5A54D] hover:bg-[#c2953f] hover:text-white px-3 py-1.5 rounded shadow-sm transition-colors cursor-pointer"
          title={`Add new ${itemLabel.toLowerCase()}`}
        >
          <FaPlus className="text-[10px]" /> Add Item
        </button>
      </div>

      {/* List items */}
      {list.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-xs">
          No items yet. Click &quot;Add Item&quot; above to create one.
        </div>
      ) : (
        list.map((item, idx) => (
          <div
            key={idx}
            className="group/listitem relative border-2 border-dashed border-[#D5A54D]/50 rounded-lg overflow-hidden bg-white shadow-xs hover:border-[#D5A54D] transition-colors"
          >
            {/* Clear Item Header with Controls */}
            <div className="flex items-center justify-between bg-linear-to-r from-gray-100 to-gray-50 border-b border-[#D5A54D]/30 px-3 py-2">
              <span className="text-xs font-bold text-[#0B2A4A] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1D3D6D] text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span>{itemLabel} #{idx + 1}</span>
              </span>

              {/* Per-item controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-[10px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  title="Move item up"
                >
                  <FaArrowUp className="text-[9px]" />
                  <span className="hidden sm:inline">Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === list.length - 1}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-[10px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  title="Move item down"
                >
                  <FaArrowDown className="text-[9px]" />
                  <span className="hidden sm:inline">Down</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="bg-white border border-red-200 rounded px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors"
                  title="Delete item"
                >
                  <FaTrash className="text-[9px]" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            <div className={className}>
              {renderItem(item, idx, true, (next) => handleUpdate(idx, next))}
            </div>
          </div>
        ))
      )}

      {/* Bottom Add button */}
      {list.length > 0 && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2.5 inline-flex items-center justify-center gap-2 text-xs font-bold text-[#D5A54D] hover:text-[#0B2A4A] hover:bg-[#D5A54D]/10 border-2 border-dashed border-[#D5A54D] rounded-lg transition-colors cursor-pointer"
        >
          <FaPlus className="text-[10px]" /> + Add Item
        </button>
      )}
    </div>
  );
}