import { useState } from "react";
import { CalendarClock, CheckCircle, XCircle } from "lucide-react";
import { useCheckAvailability } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { SCHEDULE_DAYS } from "@/lib/utils/schedule";
import type { AvailabilityCheckResult } from "@/types/models";

const DURATION_OPTIONS = [30, 45, 60, 90, 120];

export function TeacherAvailabilityPage() {
  const [day, setDay] = useState<string>("Monday");
  const [startTime, setStartTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [result, setResult] = useState<AvailabilityCheckResult | null>(null);
  const check = useCheckAvailability();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    try {
      const res = await check.mutateAsync({ day, startTime, durationMinutes });
      setResult(res.data ?? null);
    } catch {
      setResult(null);
    }
  }

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Check Availability</h1>
        <p className="mt-1 text-sm text-zinc-500">
          See if a proposed slot conflicts with your current routine (academy time, Asia/Dhaka)
        </p>
      </div>

      <Card className="rounded-3xl border-0 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Day</span>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={formControlClass}
            >
              {SCHEDULE_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Start time (24h)</span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={formControlClass}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Duration</span>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className={formControlClass}
            >
              {DURATION_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </select>
          </label>

          <Button type="submit" disabled={check.isPending} className="mt-2 w-full rounded-xl">
            {check.isPending ? "Checking…" : "Am I free?"}
          </Button>
        </form>
      </Card>

      {result ? (
        <Card
          className={`rounded-3xl border-0 p-6 shadow-sm ${
            result.available ? "bg-emerald-50" : "bg-red-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {result.available ? (
              <CheckCircle className="size-6 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="size-6 shrink-0 text-red-600" />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`font-bold ${
                  result.available ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {result.available ? "You are free at this time" : "This slot conflicts"}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {result.day} · Academy: {result.displayTime.academy} · Your time:{" "}
                {result.displayTime.teacher}
              </p>

              {result.conflicts.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {result.conflicts.map((c) => (
                    <li
                      key={c.slotId}
                      className="rounded-xl bg-white/80 px-4 py-3 text-sm text-primary-dark"
                    >
                      <span className="font-semibold">{c.studentName}</span>
                      <span className="text-zinc-500">
                        {" "}
                        · {c.startTime}–{c.endTime} ({c.durationMinutes} min)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="flex items-start gap-3 rounded-2xl border border-dashed border-zinc-200 bg-white/80 p-4">
        <CalendarClock className="size-5 shrink-0 text-gold" />
        <p className="text-sm text-zinc-500">
          Times are checked against your synced weekly routine. Update class schedules in admin if
          something looks wrong.
        </p>
      </Card>
    </PageContainer>
  );
}
