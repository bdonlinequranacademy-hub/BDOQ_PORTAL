import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import type { ConcernCategory } from "@/types/models";
import { useSubmitConcernReport, useTeacherStudents } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formControlClass } from "@/lib/formControl";

const CATEGORIES: { value: ConcernCategory; label: string }[] = [
  { value: "poaching", label: "Poaching / off-platform contact" },
  { value: "safety", label: "Safety concern" },
  { value: "conduct", label: "Conduct issue" },
  { value: "other", label: "Other" },
];

export function TeacherReportConcernPage() {
  const { data: students = [] } = useTeacherStudents();
  const submit = useSubmitConcernReport();
  const [category, setCategory] = useState<ConcernCategory>("poaching");
  const [relatedStudentId, setRelatedStudentId] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 10) return;
    await submit.mutateAsync({
      category,
      message: message.trim(),
      relatedStudentId: relatedStudentId || undefined,
    });
    setMessage("");
    setRelatedStudentId("");
    setCategory("poaching");
  }

  return (
    <PageContainer className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Report a Concern</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Report poaching attempts, off-platform payment requests, or safety issues. Admin will
          review confidentially.
        </p>
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#C4922B]" />
          <p className="text-sm text-zinc-600">
            Verbal requests during Google Meet cannot be scanned automatically — use this form to
            flag them for admin follow-up.
          </p>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#03214F]">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ConcernCategory)}
            className={formControlClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#03214F]">Related student (optional)</span>
          <select
            value={relatedStudentId}
            onChange={(e) => setRelatedStudentId(e.target.value)}
            className={formControlClass}
          >
            <option value="">— Not specific —</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#03214F]">What happened?</span>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
            minLength={10}
            placeholder="Describe what was said or requested, when it happened, and any context admin should know…"
          />
          <span className="text-xs text-zinc-400">Minimum 10 characters</span>
        </label>

        <Button
          type="submit"
          disabled={submit.isPending || message.trim().length < 10}
          className="rounded-xl bg-[#03214F] text-white"
        >
          {submit.isPending ? "Submitting…" : "Submit to admin"}
        </Button>
      </form>
    </PageContainer>
  );
}
