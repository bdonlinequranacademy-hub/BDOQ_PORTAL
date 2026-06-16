import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline-danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-500",
  secondary: "bg-gold text-white hover:bg-gold-dark",
  ghost: "bg-transparent text-navy hover:bg-navy-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  "outline-danger":
    "border-2 border-red-300 bg-white text-red-600 hover:border-red-400 hover:bg-red-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
