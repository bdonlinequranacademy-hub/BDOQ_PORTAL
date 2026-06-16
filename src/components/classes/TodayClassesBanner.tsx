import { Sparkles } from "lucide-react";
import { classTitle, formatScheduleLine, type ScheduleLike } from "@/lib/utils/class";

interface TodayClassItem {
  _id: string;
  title?: string;
  name?: string;
  schedule?: ScheduleLike;
}

interface TodayClassesBannerProps {
  classes: TodayClassItem[];
  onClassClick: (id: string) => void;
}

export function TodayClassesBanner({ classes, onClassClick }: TodayClassesBannerProps) {
  if (classes.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 to-amber-50/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-gold-dark" />
        <h2 className="text-sm font-bold text-navy">
          Today&apos;s class{classes.length !== 1 ? "es" : ""}
        </h2>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {classes.map((cls) => (
          <button
            key={cls._id}
            type="button"
            onClick={() => onClassClick(cls._id)}
            className="flex min-w-[200px] flex-1 flex-col rounded-xl border border-gold/20 bg-white/80 px-4 py-3 text-left transition hover:border-gold/40 hover:bg-white"
          >
            <span className="font-semibold text-navy">{classTitle(cls)}</span>
            <span className="mt-0.5 text-xs text-zinc-600">
              {formatScheduleLine(cls.schedule) ?? "Scheduled today"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
