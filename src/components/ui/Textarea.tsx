import type { TextareaHTMLAttributes } from "react";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className = "", id, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className={formLabelClass}>{label}</span>}
      <textarea
        id={id}
        className={`${formControlClass} min-h-[6rem] resize-y ${className}`}
        {...props}
      />
      {hint && <span className={formHintClass}>{hint}</span>}
    </label>
  );
}
