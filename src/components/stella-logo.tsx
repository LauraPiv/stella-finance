const SPARKLE_PATH =
  "M 48 10 L 50.3 42.46 L 63.56 32.44 L 53.54 45.7 L 86 48 L 53.54 50.3 L 63.56 63.56 L 50.3 53.54 L 48 86 L 45.7 53.54 L 32.44 63.56 L 42.46 50.3 L 10 48 L 42.46 45.7 L 32.44 32.44 L 45.7 42.46 Z";

export function StellaSparkle({
  size = 26,
  color = "var(--color-berry)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true">
      <path d={SPARKLE_PATH} fill={color} />
    </svg>
  );
}

export function StellaMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true">
      <circle
        className="stl-ring-a"
        cx="48"
        cy="48"
        r="12"
        fill="none"
        stroke="var(--color-berry)"
        strokeWidth="2.4"
      />
      <circle
        className="stl-ring-b"
        cx="48"
        cy="48"
        r="12"
        fill="none"
        stroke="var(--color-berry)"
        strokeWidth="2.4"
      />
      <circle className="stl-dot" cx="48" cy="48" r="6" fill="var(--color-wine)" />
    </svg>
  );
}

export function StellaWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <StellaSparkle />
      <span className="font-heading text-[26px] font-semibold tracking-tight text-wine">
        Stella
      </span>
    </div>
  );
}
