"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/app/context/ContentContext";

// Block-level HTML tags — the wrapper div must be block, not inline span,
// to avoid invalid HTML (inline wrapping block) and broken outline rendering.
const BLOCK_TAGS = new Set([
  "address", "article", "aside", "blockquote", "canvas", "dd", "details",
  "dialog", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer",
  "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr",
  "legend", "li", "main", "nav", "noscript", "ol", "p", "pre", "section",
  "summary", "table", "ul",
]);

interface EditableFieldProps {
  section: string;
  field: string;
  fallback: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  label?: string;
}

export default function EditableField({
  section,
  field,
  fallback,
  as: Tag = "span",
  className = "",
  multiline = false,
  label,
}: EditableFieldProps) {
  const { content, isEditMode, isSuperAdmin, updateField } = useContent();
  const isActive = isEditMode && isSuperAdmin;

  const saved = content?.[section]?.[field];
  const value = saved !== undefined && saved !== null ? saved : fallback;

  const ref = useRef<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Seed / update DOM content only when NOT focused (don't stomp the caret).
  useEffect(() => {
    if (!isActive) return;
    const el = ref.current;
    if (!el) return;
    if (!focused && el.innerText !== value) {
      el.innerText = value;
    }
  }, [value, isActive, focused]);

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  if (!isActive) {
    // Use createElement so `Tag` can be any HTML element string.
    const { createElement } = require("react");
    return createElement(Tag, { className }, value);
  }

  // ── EDIT MODE ──────────────────────────────────────────────────────────────
  const handleInput = () => {
    const el = ref.current;
    if (!el) return;
    const next = el.innerText;
    if (next !== value) updateField(section, field, next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === "Escape") (e.target as HTMLElement).blur();
  };

  // Use a block wrapper for block-level tags, inline for inline tags.
  // This keeps HTML valid and lets the dashed outline render correctly.
  const isBlock = BLOCK_TAGS.has(String(Tag).toLowerCase());
  const WrapperTag = isBlock ? "div" : "span";
  // Render arbitrary intrinsic tags without selecting an incompatible SVG ref
  // type from the JSX intrinsic-element union.
  const EditableTag = Tag as React.ElementType<any>;

  return (
    <WrapperTag
      className="relative group/editable"
      style={{ display: isBlock ? "block" : "inline" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Field-name badge — indicates what this field is */}
      <span
        className={`
          pointer-events-none absolute -top-3 left-0 z-30
          inline-flex items-center gap-1
          bg-[#D5A54D] text-white text-[9px] font-bold uppercase tracking-widest
          px-2 py-0.5 rounded-full shadow-md
          transition-all duration-150
          ${hovered || focused ? "opacity-100 scale-100" : "opacity-80 group-hover/editable:opacity-100"}
        `}
      >
        {label || field}
      </span>

      {/* The actual editable element.
          IMPORTANT: do NOT pass `children` here — we seed innerText via the
          useEffect above.  Passing children alongside contentEditable causes
          React to fight the DOM and overwrite the user's typing on every
          re-render, which makes the element appear unresponsive. */}
      <EditableTag
        ref={ref}
        className={className}
        // data-editable drives the CSS outlines in globals.css
        data-editable
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          handleInput(); // flush final value on blur
        }}
      />
    </WrapperTag>
  );
}