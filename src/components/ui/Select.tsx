import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export function Select({ label, hint, className = "", id, children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className={formLabelClass}>{label}</span>}
      <div className="relative">
        <select
          id={id}
          className={`${formControlClass} appearance-none pr-10 ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
      </div>
      {hint && <span className={formHintClass}>{hint}</span>}
    </label>
  );
}
