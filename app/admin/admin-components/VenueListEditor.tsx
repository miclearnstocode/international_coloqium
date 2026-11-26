import { venueIcons } from "@/app/hotel-mapping/venueIcons";
import { FaMapMarkerAlt, FaPlus, FaTrash } from "react-icons/fa";

interface VenueListEditorProps {
  items: Record<string, unknown>[];
  onChange: (index: number, item: Record<string, unknown>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-[#0B2A4A]";

function fieldText(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export default function VenueListEditor({ items, onChange, onAdd, onRemove }: VenueListEditorProps) {
  return (
    <section aria-label="Venue list editor" className="mt-6 space-y-4 border-t border-slate-200 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-bold text-[#0B2A4A]">
          <FaMapMarkerAlt aria-hidden="true" className="text-[#28650C]" />
          Venues <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{items.length}</span>
        </h3>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#0B2A4A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#163F59]">
          <FaPlus aria-hidden="true" /> Add venue
        </button>
      </div>
      {items.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">No venues added.</p>}
      {items.map((item, index) => {
        const update = (field: string, value: string) => onChange(index, { ...item, [field]: value });
        const name = fieldText(item.name);
        const icon = fieldText(item.icon);
        const SelectedIcon = venueIcons.get(icon)?.Icon;
        return (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h4 className="wrap-break-word text-sm font-bold text-[#0B2A4A]">{name.trim() || "New venue"}</h4>
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${name.trim() || "venue " + (index + 1)}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-50"
              >
                <FaTrash aria-hidden="true" /> Remove
              </button>
            </div>

            <div className="grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <label>
                Venue name *
                <input value={name} onChange={(event) => update("name", event.target.value)} className={inputClass} />
              </label>
              <label>
                Location or address
                <input value={fieldText(item.loc)} onChange={(event) => update("loc", event.target.value)} className={inputClass} />
              </label>
              <label className="sm:col-span-2">
                Description
                <textarea rows={2} value={fieldText(item.desc)} onChange={(event) => update("desc", event.target.value)} className={inputClass} />
              </label>
              <label>
                Map coordinates
                <input
                  value={fieldText(item.pos)}
                  onChange={(event) => update("pos", event.target.value)}
                  placeholder="Latitude, longitude"
                  className={inputClass}
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">Enter two decimal coordinates, separated by a comma. Leave blank to list the venue without a map marker.</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  Marker number
                  <input inputMode="numeric" value={fieldText(item.num)} onChange={(event) => update("num", event.target.value)} className={inputClass} />
                </label>
                <label>
                  Marker color
                  <input value={fieldText(item.color)} onChange={(event) => update("color", event.target.value)} placeholder="Hex color" className={inputClass} />
                </label>
              </div>
              <label>
                Venue icon
                <div className="flex items-center gap-2">
                  {SelectedIcon && (
                    <span aria-hidden="true" className="mt-1 grid size-9 shrink-0 place-items-center rounded-lg bg-[#EAF3EB] text-[#28650C]">
                      <SelectedIcon />
                    </span>
                  )}
                  <select value={icon} onChange={(event) => update("icon", event.target.value)} className={inputClass}>
                    <option value="">Select an icon</option>
                    {icon && !venueIcons.has(icon) && <option value={icon}>{icon}</option>}
                    {[...venueIcons].map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </label>
            </div>
          </div>
        );
      })}
    </section>
  );
}
