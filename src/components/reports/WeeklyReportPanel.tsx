import { Copy, CheckCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { WeeklyFamilyReport } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/stores/uiStore";

export function WeeklyReportPanel({ report }: { report: WeeklyFamilyReport }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(report.text);
      setCopied(true);
      toast.success("Report copied — ready to paste in WhatsApp or email");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy report");
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold text-portal-heading">{report.studentName}</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-3" />
              Verified data
            </span>
          </div>
          <p className="mt-1 text-sm text-portal-muted">
            {report.weekLabel} · {report.teacherName}
          </p>
          <p className="mt-1 text-xs text-portal-muted">
            Built from approved class logs, attendance marks, and homework records — not
            AI-generated.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleCopy}
          className="gap-2 rounded-xl border border-portal"
        >
          {copied ? (
            <CheckCircle className="size-4 text-emerald-600" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? "Copied" : "Copy message"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCell label="Verified sessions" value={report.sessionsHeld} tone="navy" />
        <StatCell label="Present" value={report.attendance.present} tone="green" />
        <StatCell
          label="Homework submitted"
          value={`${report.homework.submitted}/${report.homework.assigned}`}
          tone="amber"
        />
        <StatCell label="Graded" value={report.homework.graded} tone="blue" />
      </div>

      {report.topicsCovered.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
            Topics (from approved logs)
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {report.topicsCovered.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-portal bg-portal-muted px-2.5 py-0.5 text-xs font-medium text-portal-heading"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {report.sessionHighlights.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
            Session notes (approved logs)
          </p>
          <ul className="mt-2 space-y-2">
            {report.sessionHighlights.map((note, i) => (
              <li
                key={i}
                className="rounded-xl border border-portal bg-portal-surface-muted/50 px-3 py-2 text-sm leading-relaxed text-portal"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-portal px-3 py-2 text-sm text-portal-muted">
          No approved session logs this week — submit and get class logs approved to include
          lesson details here.
        </p>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-portal-muted">
          Message preview
        </p>
        <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-portal bg-portal-surface-muted/40 p-4 text-sm leading-relaxed text-portal">
          {report.text}
        </pre>
      </div>
    </Card>
  );
}

function StatCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "navy" | "green" | "amber" | "blue";
}) {
  const valueClass =
    tone === "green"
      ? "text-emerald-700 dark:text-emerald-400"
      : tone === "amber"
        ? "text-amber-700 dark:text-amber-400"
        : tone === "blue"
          ? "text-blue-700 dark:text-blue-300"
          : "text-portal-heading";

  return (
    <div className="rounded-xl border border-portal bg-portal-surface-muted/50 px-3 py-2.5 text-center">
      <p className={`text-lg font-bold tabular-nums ${valueClass}`}>{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wide text-portal-muted">
        {label}
      </p>
    </div>
  );
}
