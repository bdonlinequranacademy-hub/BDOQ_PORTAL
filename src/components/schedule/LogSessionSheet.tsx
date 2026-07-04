import { useEffect, useRef, useState } from "react";
import { X, ClipboardList, AlertTriangle } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import { useComplianceScan } from "@/features/teacher/hooks/useTeacher";
import {
  NestedCurriculumSelect,
  useCurriculumTree,
} from "@/components/curriculum/NestedCurriculumSelect";
import type { CurriculumPath } from "@/lib/api/curriculumApi";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";

import { PageLoading } from "@/components/ui/PageLoading";
interface LogSessionSheetProps {
  session: SessionSlotView | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    sessionSlotId: string;
    sessionDate: string;
    lessonReport: string;
    curriculumProgram: string;
    curriculumUnit?: string;
    curriculumTopic?: string;
    topicsCovered: string[];
  }) => Promise<unknown>;
  isSubmitting?: boolean;
}

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function LogSessionSheet({
  session,
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: LogSessionSheetProps) {
  const [lessonReport, setLessonReport] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [sessionDate, setSessionDate] = useState(todayIsoDate());
  const [curriculum, setCurriculum] = useState<CurriculumPath>({ programId: "" });
  const [scanBlock, setScanBlock] = useState<string | null>(null);
  const [scanWarnings, setScanWarnings] = useState<string[]>([]);
  const scan = useComplianceScan();
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const studentId = session?.student._id;
  const { data: curriculumTree = [], isLoading: treeLoading } = useCurriculumTree(
    studentId ? { studentId } : undefined
  );

  useEffect(() => {
    if (open) {
      setLessonReport("");
      setTopicsInput("");
      setSessionDate(todayIsoDate());
      setCurriculum({ programId: "" });
      setScanBlock(null);
      setScanWarnings([]);
    }
  }, [open, session?._id]);

  useEffect(() => {
    if (!open) return;
    const text = lessonReport.trim();
    if (scanTimer.current) clearTimeout(scanTimer.current);
    if (text.length < 8) {
      setScanBlock(null);
      setScanWarnings([]);
      return;
    }
    scanTimer.current = setTimeout(async () => {
      try {
        const res = await scan.mutateAsync({ text, context: "class_log" });
        const data = res.data;
        const blocked =
          data?.compliance?.severity === "block" || data?.quality?.severity === "block";
        setScanBlock(
          blocked
            ? data?.compliance?.severity === "block"
              ? data.compliance.message
              : data?.quality?.message ?? "Please improve your lesson report before submitting."
            : null
        );
        setScanWarnings(data?.warnings ?? []);
      } catch {
        setScanBlock(null);
        setScanWarnings([]);
      }
    }, 500);
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, [lessonReport, open]);

  if (!open || !session) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lessonReport.trim() || scanBlock || !curriculum.programId) return;
    const topicsCovered = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      await onSubmit({
        sessionSlotId: session!._id,
        sessionDate,
        lessonReport: lessonReport.trim(),
        curriculumProgram: curriculum.programId,
        curriculumUnit: curriculum.unitId || undefined,
        curriculumTopic: curriculum.topicId || undefined,
        topicsCovered,
      });
      onClose();
    } catch {
      /* mutation shows toast */
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-3xl bg-portal-surface p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5 text-gold" />
              <h2 className="text-lg font-bold text-primary-dark">Log Session</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {session.student.name} · {session.classTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-primary-dark">Session date</span>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className={formControlClass}
            required
          />
        </label>

        {treeLoading ? (
          <PageLoading compact label="Loading curriculum…" />
        ) : (
          <NestedCurriculumSelect
            tree={curriculumTree}
            value={curriculum}
            onChange={setCurriculum}
            required
          />
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-primary-dark">Lesson report</span>
          <Textarea
            placeholder="What was covered in today's class? Tajweed corrections, surahs revised, homework assigned…"
            value={lessonReport}
            onChange={(e) => setLessonReport(e.target.value)}
            rows={6}
            required
          />
        </div>
        {scanBlock ? (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{scanBlock}</span>
          </div>
        ) : scanWarnings.length > 0 ? (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{scanWarnings[0]}</span>
          </div>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-primary-dark">Topics covered (optional)</span>
          <input
            type="text"
            placeholder="e.g. Surah Al-Mulk, Madd rules, homework review"
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            className={formControlClass}
          />
          <span className="text-xs text-zinc-400">Comma-separated</span>
        </label>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F8FAFF] p-3 text-center text-xs">
          <div>
            <p className="text-[10px] uppercase text-zinc-400">Stu</p>
            <p className="font-semibold text-primary-dark">{session.times.student.time}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-400">Tea</p>
            <p className="font-semibold text-primary-dark">{session.times.teacher.time}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-400">BD</p>
            <p className="font-semibold text-primary-dark">{session.times.academy.time}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1 rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !lessonReport.trim() ||
              !curriculum.programId ||
              Boolean(scanBlock)
            }
            className="flex-1 rounded-xl bg-primary-dark text-white"
          >
            {isSubmitting ? "Submitting…" : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </div>
  );
}
