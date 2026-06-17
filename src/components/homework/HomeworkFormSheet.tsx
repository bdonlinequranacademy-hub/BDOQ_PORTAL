import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CurriculumPath } from "@/lib/api/curriculumApi";
import {
  NestedCurriculumSelect,
  pathReadyToSave,
  useCurriculumTree,
} from "@/components/curriculum/NestedCurriculumSelect";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { defaultHomeworkDueDate } from "@/lib/homeworkDue";
import { PageLoading } from "@/components/ui/PageLoading";

export interface HomeworkFormValues {
  title: string;
  description: string;
  classId: string;
  dueDate: string;
  curriculum: CurriculumPath;
}

interface ClassOption {
  _id: string;
  name: string;
}

interface HomeworkFormSheetProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Partial<HomeworkFormValues> & { homeworkId?: string };
  classes: ClassOption[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: HomeworkFormValues) => Promise<void>;
}

const emptyForm: HomeworkFormValues = {
  title: "",
  description: "",
  classId: "",
  dueDate: "",
  curriculum: { programId: "" },
};

export function HomeworkFormSheet({
  open,
  mode,
  initial,
  classes,
  isSubmitting,
  onClose,
  onSubmit,
}: HomeworkFormSheetProps) {
  const [form, setForm] = useState<HomeworkFormValues>(emptyForm);

  const { data: curriculumTree = [], isLoading: treeLoading } = useCurriculumTree(
    form.classId ? { classId: form.classId } : undefined,
    { enabled: open && Boolean(form.classId) }
  );

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      classId: initial?.classId ?? "",
      dueDate: initial?.dueDate ?? defaultHomeworkDueDate(),
      curriculum: initial?.curriculum ?? { programId: "" },
    });
  }, [open, initial?.title, initial?.description, initial?.classId, initial?.dueDate, initial?.curriculum]);

  useEffect(() => {
    if (!open || mode !== "create") return;
    if (!form.classId && classes.length === 1) {
      setForm((prev) => ({ ...prev, classId: classes[0]._id }));
    }
  }, [open, mode, classes, form.classId]);

  if (!open) return null;

  const curriculumReady = pathReadyToSave(form.curriculum, curriculumTree);
  const canSubmit =
    Boolean(form.title.trim()) &&
    Boolean(form.classId) &&
    Boolean(form.dueDate) &&
    curriculumReady;

  async function handleSubmit() {
    if (!canSubmit) return;
    await onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative z-10 flex max-h-[92vh] w-full flex-col gap-5 overflow-y-auto rounded-t-3xl border-t border-portal-border bg-portal-surface p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#03214F]">
            {mode === "create" ? "New Homework" : "Edit Homework"}
          </span>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5 text-zinc-400" />
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          Pick the exact lesson from your students&apos; study plan — program, section, and topic.
        </p>

        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        <Textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />

        <Select
          label="Class"
          value={form.classId}
          disabled={mode === "edit"}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              classId: e.target.value,
              curriculum: { programId: "" },
            }))
          }
        >
          <option value="">Select class…</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </Select>

        {form.classId ? (
          treeLoading ? (
            <PageLoading compact label="Loading study plan topics…" />
          ) : (
            <NestedCurriculumSelect
              tree={curriculumTree}
              value={form.curriculum}
              onChange={(curriculum) => setForm((prev) => ({ ...prev, curriculum }))}
              required
            />
          )
        ) : (
          <p className="text-xs text-zinc-500">Select a class to load lesson topics.</p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-500">Due date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            className={formControlClass}
          />
        </label>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          className="h-12 w-full rounded-xl bg-[#03214F] font-semibold text-white"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create Homework"
              : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
