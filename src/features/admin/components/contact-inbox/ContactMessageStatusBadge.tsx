import type { ContactMessageStatus } from "@/types/models";
import {
  contactMessageStatusLabel,
  contactMessageStatusStyles,
} from "@/features/admin/components/contact-inbox/adminContactInboxUtils";
import { cn } from "@/lib/utils/cn";

export function ContactMessageStatusBadge({ status }: { status: ContactMessageStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        contactMessageStatusStyles(status)
      )}
    >
      {contactMessageStatusLabel(status)}
    </span>
  );
}
