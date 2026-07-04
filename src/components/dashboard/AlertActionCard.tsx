import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface IAlertActionCardProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
  icon?: ReactNode;
  tone?: "amber" | "blue" | "emerald" | "violet" | "indigo" | "neutral";
}

const toneStyles = {
  amber: "bg-amber-50 border-amber-100 text-amber-900",
  blue: "bg-blue-50 border-blue-100 text-blue-900",
  emerald: "bg-emerald-50 border-emerald-100 text-emerald-900",
  violet: "bg-violet-50 border-violet-100 text-violet-900",
  indigo: "bg-indigo-50 border-indigo-100 text-indigo-900",
  neutral: "bg-portal-muted border-portal text-portal-heading",
};

export function AlertActionCard({
  title,
  actionLabel,
  onAction,
  icon,
  tone = "neutral",
}: IAlertActionCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-4 shadow-sm transition hover:shadow-md",
        toneStyles[tone]
      )}
    >
      <div className="flex items-start gap-2">
        {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
        <p className="text-sm font-semibold leading-snug">{title}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex w-fit items-center gap-0.5 text-sm font-semibold text-primary hover:underline dark:text-teal-accent"
      >
        {actionLabel}
        <ChevronRight className="size-3.5" aria-hidden />
      </button>
    </Card>
  );
}
