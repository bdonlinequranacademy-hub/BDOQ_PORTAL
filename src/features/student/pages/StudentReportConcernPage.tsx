import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import type { ConcernCategory } from "@/types/models";
import { useStudentClasses, useSubmitConcernReport } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formControlClass } from "@/lib/formControl";

const CATEGORIES: { value: ConcernCategory; label: string }[] = [
  { value: "poaching", label: "Teacher asked for off-platform payment or contact" },
  { value: "safety", label: "Safety concern" },
  { value: "conduct", label: "Conduct issue" },
  { value: "other", label: "Other" },
];

export function StudentReportConcernPage() {
  const { data: classes = [] } = useStudentClasses();
  const submit = useSubmitConcernReport();
  const [category, setCategory] = useState<ConcernCategory>("poaching");
  const [relatedTeacherId, setRelatedTeacherId] = useState("");
  const [message, setMessage] = useState("");

  const teachers = useMemo(() => {
    const map = new Map<string, string>();
    for (const cls of classes) {
      const teacher = cls.teacher;
      if (teacher && typeof teacher === "object" && teacher._id) {
        map.set(teacher._id, teacher.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [classes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 10) return;
    await submit.mutateAsync({
      category,
      message: message.trim(),
      relatedTeacherId: relatedTeacherId || undefined,
    });
    setMessage("");
    setRelatedTeacherId("");
    setCategory("poaching");
  }

  return (
    <PageContainer className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Report a Concern</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tell admin if a teacher asked you to pay outside the academy or contact them privately.
        </p>
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#C4922B]" />
          <p className="text-sm text-zinc-600">
            All payments and scheduling should stay through Al Bayaan Academy. Your report is sent
            only to admin.
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

        {teachers.length > 0 ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#03214F]">Related teacher (optional)</span>
            <select
              value={relatedTeacherId}
              onChange={(e) => setRelatedTeacherId(e.target.value)}
              className={formControlClass}
            >
              <option value="">— Not specific —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#03214F]">What happened?</span>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
            minLength={10}
            placeholder="Describe what was said during class or in chat, including dates if you remember…"
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
