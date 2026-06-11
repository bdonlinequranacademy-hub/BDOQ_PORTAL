import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { formControlClass } from "@/lib/formControl";

interface CurriculumProgramFilterProps {
  tree: CurriculumNode[];
  value: string;
  onChange: (programId: string) => void;
  className?: string;
}

export function CurriculumProgramFilter({
  tree,
  value,
  onChange,
  className,
}: CurriculumProgramFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className ?? `${formControlClass} sm:w-52`}
    >
      <option value="">All programs</option>
      {tree.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </select>
  );
}

export function MissingCurriculumBadge() {
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
      No program
    </span>
  );
}
