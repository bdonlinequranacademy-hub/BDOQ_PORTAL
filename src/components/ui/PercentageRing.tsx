interface PercentageRingProps {
  percentage: number;
  size?: number;
  strokeColor?: string;
  label?: string;
}

export function PercentageRing({
  percentage,
  size = 144,
  strokeColor = "#14b8a6",
  label,
}: PercentageRingProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={`${clamped} 100`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary-dark">{clamped}%</span>
        {label && <span className="text-xs text-zinc-400">{label}</span>}
      </div>
    </div>
  );
}
