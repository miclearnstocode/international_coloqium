"use client";

import { useState } from "react";
import { apiFetch } from "@/app/lib/api";

export type Agency = {
  id: number;
  region: string;
  name: string;
  abbreviation: string;
  type: string;
};

type Props = {
  /** Existing agencies, used only to suggest regions/types in the inputs */
  existing?: Agency[];
  /** Pre-fills the name field (e.g. what the user already typed in the search box) */
  initialName?: string;
  /** Called with the saved agency so the parent can add it to its dropdown and select it */
  onAdded: (agency: Agency) => void;
  onCancel: () => void;
};

export default function AddAgencyForm({ existing = [], initialName = "", onAdded, onCancel }: Props) {
  const [region, setRegion] = useState("");
  const [name, setName] = useState(initialName);
  const [abbreviation, setAbbreviation] = useState("");
  const [type, setType] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const regions = Array.from(new Set(existing.map((a) => a.region).filter(Boolean))).sort();
  const types = Array.from(new Set(existing.map((a) => a.type).filter(Boolean))).sort();

  const handleSave = async () => {
    if (!name.trim() || !region.trim() || !abbreviation.trim() || !type.trim()) {
      setError("Region, name, abbreviation and type are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await apiFetch("/api/sucs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: region.trim(),
          name: name.trim(),
          abbreviation: abbreviation.trim(),
          type: type.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Could not add university/agency.");
        return;
      }
      onAdded(data as Agency);
    } catch {
      setError("Could not add university/agency.");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#76B947]";
  const label = "block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-1";

  return (
    <div
      className="space-y-3"
      onKeyDown={(e) => {
        // This form sits inside the abstract form: Enter must save the agency, not submit the abstract
        if (e.key === "Enter") {
          e.preventDefault();
          if (!saving) handleSave();
        }
      }}
    >
      <div>
        <label className={label}>Region *</label>
        <input list="agency-regions" className={input} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Region VI" />
        <datalist id="agency-regions">{regions.map((r) => <option key={r} value={r} />)}</datalist>
      </div>
      <div>
        <label className={label}>University / Agency Name *</label>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
      </div>
      <div>
        <label className={label}>Abbreviation *</label>
        <input className={input} value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} placeholder="e.g. CAPSU" />
      </div>
      <div>
        <label className={label}>Type *</label>
        <input list="agency-types" className={input} value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. SUC" />
        <datalist id="agency-types">{types.map((t) => <option key={t} value={t} />)}</datalist>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#0A5C0A] hover:bg-[#084a08] disabled:opacity-60">
          {saving ? "Saving..." : "Add"}
        </button>
      </div>
    </div>
  );
}