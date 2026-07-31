import type { ContactMessageStatus } from "@/types/models";
import { contactMessageStatusStyles } from "@/features/admin/components/contact-inbox/adminContactInboxUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function ContactMessageStatusBadge({ status }: { status: ContactMessageStatus }) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        contactMessageStatusStyles(status)
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
