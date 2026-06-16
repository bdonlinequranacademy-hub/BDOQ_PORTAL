import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  curriculumApi,
  type CurriculumAssignment,
  type CurriculumNode,
  type CurriculumPath,
} from "@/lib/api/curriculumApi";
import { formControlClass } from "@/lib/formControl";

function fieldLabels(programId: string) {
  switch (programId) {
    case "quran-memorisation":
    case "quran-recitation":
      return { unit: "Track", topic: "Surah" };
    case "tajweed":
      return { unit: "Category", topic: "Tajweed rule" };
    case "arabic-language":
      return { unit: "Area", topic: "Grammar / lesson" };
    default:
      return { unit: "Section", topic: "Topic" };
  }
}

export function pathReadyToSave(path: CurriculumPath, tree: CurriculumNode[]): boolean {
  if (!path.programId) return false;
  const program = tree.find((p) => p.id === path.programId);
  const units = program?.children ?? [];
  if (units.length > 0 && !path.unitId) return false;
  const unit = units.find((u) => u.id === path.unitId);
  const topics = unit?.children ?? [];
  if (topics.length > 0 && !path.topicId) return false;
  return true;
}

export function useCurriculumTree(
  params?: { studentId?: string; classId?: string },
  options?: { enabled?: boolean }
) {
  const defaultEnabled =
    params?.studentId !== undefined ||
    params?.classId !== undefined ||
    params === undefined;

  return useQuery({
    queryKey: ["curriculum", "tree", params?.studentId, params?.classId],
    queryFn: () => curriculumApi.getTree(params),
    select: (r) => r.data ?? [],
    enabled: options?.enabled ?? defaultEnabled,
    staleTime: 10 * 60_000,
  });
}

interface NestedCurriculumSelectProps {
  tree: CurriculumNode[];
  value: CurriculumPath;
  onChange: (path: CurriculumPath) => void;
  required?: boolean;
  disabled?: boolean;
}

export function NestedCurriculumSelect({
  tree,
  value,
  onChange,
  required,
  disabled,
}: NestedCurriculumSelectProps) {
  const program = tree.find((p) => p.id === value.programId);
  const units = program?.children ?? [];
  const unit = units.find((u) => u.id === value.unitId);
  const topics = unit?.children ?? [];
  const labels = value.programId ? fieldLabels(value.programId) : fieldLabels("");
  const topicRequired = required && topics.length > 0;
  const unitRequired = required && units.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#03214F]">
          Program {required ? "*" : ""}
        </span>
        <select
          value={value.programId}
          disabled={disabled}
          onChange={(e) =>
            onChange({ programId: e.target.value, unitId: "", topicId: "" })
          }
          className={formControlClass}
          required={required}
        >
          <option value="">Select program…</option>
          {tree.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      {value.programId && units.length > 0 ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#03214F]">
            {labels.unit} {unitRequired ? "*" : ""}
          </span>
          <select
            value={value.unitId ?? ""}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                programId: value.programId,
                unitId: e.target.value,
                topicId: "",
              })
            }
            className={formControlClass}
            required={unitRequired}
          >
            <option value="">Select {labels.unit.toLowerCase()}…</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {value.unitId && topics.length > 0 ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#03214F]">
            {labels.topic} {topicRequired ? "*" : ""}
          </span>
          <select
            value={value.topicId ?? ""}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                programId: value.programId,
                unitId: value.unitId,
                topicId: e.target.value,
              })
            }
            className={formControlClass}
            required={topicRequired}
          >
            <option value="">Select {labels.topic.toLowerCase()}…</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}

interface CurriculumAssignmentEditorProps {
  assignments: CurriculumAssignment[];
  onChange: (assignments: CurriculumAssignment[]) => void;
  tree: CurriculumNode[];
}

export function CurriculumAssignmentEditor({
  assignments,
  onChange,
  tree,
}: CurriculumAssignmentEditorProps) {
  const [draft, setDraft] = useState<CurriculumPath>({ programId: "" });

  function addAssignment() {
    if (!pathReadyToSave(draft, tree)) return;
    const exists = assignments.some(
      (a) =>
        a.programId === draft.programId &&
        (a.unitId ?? "") === (draft.unitId ?? "") &&
        (a.topicId ?? "") === (draft.topicId ?? "")
    );
    if (exists) return;
    onChange([
      ...assignments,
      {
        programId: draft.programId,
        unitId: draft.unitId || undefined,
        topicId: draft.topicId || undefined,
      },
    ]);
    setDraft({ programId: "" });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
      <div>
        <p className="text-sm font-semibold text-[#03214F]">Study programs</p>
        <p className="text-xs text-zinc-500">
          Add one path per item — e.g. Surah Al-Fatiha (Hifz), a Tajweed rule, or a Grammar lesson.
          Homework options follow these assignments.
        </p>
      </div>

      {assignments.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {assignments.map((a, i) => {
            const program = tree.find((p) => p.id === a.programId);
            const unit = program?.children?.find((u) => u.id === a.unitId);
            const topic = unit?.children?.find((t) => t.id === a.topicId);
            const label = [program?.label, unit?.label, topic?.label]
              .filter(Boolean)
              .join(" › ");
            return (
              <li
                key={`${a.programId}-${a.unitId ?? ""}-${a.topicId ?? ""}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm"
              >
                <span className="text-[#03214F]">{label || a.programId}</span>
                <button
                  type="button"
                  onClick={() => onChange(assignments.filter((_, idx) => idx !== i))}
                  className="text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-zinc-400">
          No programs assigned — all curriculum options will show.
        </p>
      )}

      <NestedCurriculumSelect tree={tree} value={draft} onChange={setDraft} required />
      <button
        type="button"
        onClick={addAssignment}
        disabled={!pathReadyToSave(draft, tree)}
        className="self-start rounded-lg bg-[#03214F] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        Add program path
      </button>
    </div>
  );
}
