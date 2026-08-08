/**
 * Neutral placeholder block with its intended dimensions labeled.
 * Deliberately not a stock photo — the client should see where photography
 * goes and at what ratio, without mistaking filler for final art.
 *
 * TODO: replace with next/image + Sanity image URLs at build-out.
 */
export default function ImagePlaceholder({
  width,
  height,
  label,
  className = "",
  compact = false,
}: {
  width: number;
  height: number;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`placeholder-hatch relative flex flex-col items-center justify-center gap-1 overflow-hidden border border-line-strong/60 text-placeholder-ink ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={label ? `Image placeholder: ${label}` : "Image placeholder"}
    >
      <span
        className={`font-mono tracking-tight ${compact ? "text-[10px]" : "text-xs sm:text-sm"}`}
      >
        {width} × {height}
      </span>
      {label && !compact && (
        <span className="max-w-[85%] text-center text-[11px] leading-snug text-placeholder-ink/85">
          {label}
        </span>
      )}
    </div>
  );
}
