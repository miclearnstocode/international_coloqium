import { FaChevronRight, FaDownload, FaMapMarkerAlt } from "react-icons/fa";

interface HotelActionCardProps {
  variant: "download" | "contact";
  title: string;
  description: string;
  buttonText: string;
  link: string;
  preview?: boolean;
  onUnavailable?: () => void;
}

export function hotelActionUrl(value: string) {
  const destination = value.trim();
  if (destination.startsWith("/") && !destination.startsWith("//") && !destination.includes("\\")) return destination;
  try {
    const url = new URL(destination);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    return undefined;
  }
}

export default function HotelActionCard({
  variant, title, description, buttonText, link, preview = false, onUnavailable,
}: HotelActionCardProps) {
  const download = variant === "download";
  const href = hotelActionUrl(link);
  const label = buttonText.trim() || (download ? "Download PDF" : "Contact Secretariat");
  const buttonClass = `inline-flex w-fit max-w-full items-center justify-center gap-2 bg-[#0A5C0A] text-sm font-bold text-white hover:bg-[#084A08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2A4A] ${download ? "rounded-md px-6 py-2.5" : "shrink-0 rounded-lg px-8 py-4"}`;
  const buttonContent = <>{label} {download ? <FaDownload aria-hidden="true" /> : <FaChevronRight aria-hidden="true" />}</>;
  const action = preview
    ? <span className={buttonClass}>{buttonContent}</span>
    : href
      ? <a href={href} className={buttonClass}>{buttonContent}</a>
      : onUnavailable && <button type="button" aria-haspopup="dialog" onClick={onUnavailable} className={buttonClass}>{buttonContent}</button>;

  return (
    <div className={`premium-card flex gap-4 rounded-xl border text-[#0B2A4A] shadow-sm ${download ? "items-start border-[#4FC3F7]/30 bg-[#F2F9FF] p-6" : "flex-col items-start justify-between border-zinc-200 bg-white p-6 md:flex-row md:items-center md:p-8"}`}>
      <div className={`flex min-w-0 gap-4 ${download ? "items-start" : "items-center"}`}>
        {download ? <FaDownload aria-hidden="true" className="mt-1 shrink-0 text-xl text-[#1D3D6D]" /> : (
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#BDE8FF] bg-[#F2F9FF] text-3xl text-[#1D3D6D]">
            <FaMapMarkerAlt aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 wrap-break-word">
          {title && <h3 className={`font-bold ${download ? "text-sm" : "text-xl"}`}>{title}</h3>}
          {description && <p className={`mt-1 leading-relaxed text-zinc-500 ${download ? "text-sm" : "text-base"}`}>{description}</p>}
          {download && action && <div className="mt-4">{action}</div>}
        </div>
      </div>
      {!download && action}
    </div>
  );
}
