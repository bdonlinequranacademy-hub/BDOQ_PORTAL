import type { SessionTimeLabel } from "@/types/models";
import { CountryLabel } from "@/components/ui/CountryLabel";

interface SessionTimeRowProps {
  label: string;
  time: SessionTimeLabel;
  country?: string;
  compact?: boolean;
}

export function SessionTimeRow({
  label,
  time,
  country,
  compact = false,
}: SessionTimeRowProps) {
  return (
    <div className={compact ? "text-right" : "rounded-lg bg-[#F8FAFF] px-2.5 py-2"}>
      <p className="text-[10px] font-semibold uppercase text-zinc-400">{label}</p>
      <p className={`font-semibold text-[#03214F] ${compact ? "text-xs" : "text-sm"}`}>
        {time.time}
      </p>
      {country ? (
        <CountryLabel country={country} className="mt-0.5 block text-[10px] text-zinc-500" />
      ) : null}
    </div>
  );
}
