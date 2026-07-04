import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WhatsAppLinkButtonProps {
  href: string | null;
  label?: string;
  size?: "sm" | "md";
  className?: string;
  disabledReason?: string;
}

export function WhatsAppLinkButton({
  href,
  label = "WhatsApp",
  size = "md",
  className,
  disabledReason,
}: WhatsAppLinkButtonProps) {
  const sizeClass =
    size === "sm"
      ? "h-9 gap-1.5 px-3 text-xs"
      : "h-10 gap-2 px-4 text-sm";

  if (!href) {
    return (
      <span
        title={disabledReason ?? "Invalid or missing WhatsApp number"}
        className={cn(
          "inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 font-medium text-zinc-400",
          sizeClass,
          className
        )}
      >
        <MessageCircle className="size-4" aria-hidden />
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20",
        sizeClass,
        className
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </a>
  );
}
