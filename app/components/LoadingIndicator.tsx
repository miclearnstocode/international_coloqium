interface LoadingIndicatorProps {
  label: string;
  className?: string;
}

export default function LoadingIndicator({ label, className = "" }: LoadingIndicatorProps) {
  return (
    <span role="status" className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="size-3.5 shrink-0 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin" />
      {label}
    </span>
  );
}
