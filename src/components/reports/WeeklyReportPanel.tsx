import { Copy, CheckCircle } from "lucide-react";
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
      toast.success("Report copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy report");
    }
  }

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-[#03214F]">
            {report.studentName}
          </p>
          <p className="text-sm text-zinc-500">
            {report.weekLabel} · Prepared by {report.teacherName}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleCopy}
          className="gap-2 rounded-xl border border-zinc-200"
        >
          {copied ? <CheckCircle className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy for WhatsApp/email"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-[#F8FAFF] px-3 py-2 text-center">
          <p className="text-lg font-bold text-[#03214F]">{report.sessionsHeld}</p>
          <p className="text-[10px] uppercase text-zinc-500">Sessions</p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center">
          <p className="text-lg font-bold text-emerald-700">{report.attendance.present}</p>
          <p className="text-[10px] uppercase text-zinc-500">Present</p>
        </div>
        <div className="rounded-xl bg-amber-50 px-3 py-2 text-center">
          <p className="text-lg font-bold text-amber-700">
            {report.homework.submitted}/{report.homework.assigned}
          </p>
          <p className="text-[10px] uppercase text-zinc-500">Homework</p>
        </div>
        <div className="rounded-xl bg-blue-50 px-3 py-2 text-center">
          <p className="text-lg font-bold text-blue-700">{report.homework.graded}</p>
          <p className="text-[10px] uppercase text-zinc-500">Graded</p>
        </div>
      </div>

      {report.topicsCovered.length > 0 ? (
        <p className="text-sm text-zinc-600">
          <span className="font-semibold text-[#03214F]">Topics: </span>
          {report.topicsCovered.join(", ")}
        </p>
      ) : null}

      <pre className="whitespace-pre-wrap rounded-xl bg-[#F8FAFF] p-4 text-sm leading-relaxed text-zinc-700">
        {report.text}
      </pre>
    </Card>
  );
}
