import type { InputHTMLAttributes } from "react";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
}

export function DateInput({ label, hint, className = "", id, ...props }: DateInputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className={formLabelClass}>{label}</span>}
      <input
        id={id}
        type="date"
        className={`${formControlClass} ${className}`}
        {...props}
      />
      {hint && <span className={formHintClass}>{hint}</span>}
    </label>
  );
}
