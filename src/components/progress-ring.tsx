export function ProgressRing({
  percent,
  size = 168,
  trackColor = "rgba(237,147,177,0.28)",
  fillColor = "var(--color-rose)",
  children,
}: {
  percent: number;
  size?: number;
  trackColor?: string;
  fillColor?: string;
  children?: React.ReactNode;
}) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = `${(clamped / 100) * circumference} ${circumference}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle cx="60" cy="60" r={r} fill="none" stroke={trackColor} strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={dash}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {children}
      </div>
    </div>
  );
}
