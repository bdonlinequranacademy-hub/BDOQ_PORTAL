import type { InputHTMLAttributes } from "react";
import { formControlClass, formControlLgClass, formHintClass, formLabelClass } from "@/lib/formControl";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  fieldSize?: "md" | "lg";
}

export function Input({
  label,
  hint,
  fieldSize = "md",
  className = "",
  id,
  ...props
}: InputProps) {
  const controlClass = fieldSize === "lg" ? formControlLgClass : formControlClass;

  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className={formLabelClass}>{label}</span>}
      <input id={id} className={`${controlClass} ${className}`} {...props} />
      {hint && <span className={formHintClass}>{hint}</span>}
    </label>
  );
}
