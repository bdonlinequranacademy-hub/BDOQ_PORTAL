import { useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { ContactMessageStatus, ContactMessageView } from "@/types/models";
import { ContactMessageStatusBadge } from "@/features/admin/components/contact-inbox/ContactMessageStatusBadge";
import {
  contactReplyMailtoHref,
  formatInboxDateTime,
  localeLabel,
  nextContactActionLabel,
  nextContactStatus,
} from "@/features/admin/components/contact-inbox/adminContactInboxUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminContactInboxConversationProps {
  message: ContactMessageView | null;
  busy: boolean;
  onUpdateStatus: (message: ContactMessageView, status: ContactMessageStatus) => void;
}

export function AdminContactInboxConversation({
  message,
  busy,
  onUpdateStatus,
}: IAdminContactInboxConversationProps) {
  const [replyDraft, setReplyDraft] = useState("");

  useEffect(() => {
    if (!message) {
      setReplyDraft("");
      return;
    }

    setReplyDraft(
      `Assalamu alaikum ${message.name},\n\nThank you for contacting BD Online Quran Academy.\n\n`
    );
  }, [message?._id, message?.name]);

  if (!message) {
    return (
      <Card className="flex min-h-[520px] items-center justify-center rounded-2xl border border-portal bg-portal-surface p-8 text-center shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <div>
          <p className="text-sm font-semibold text-portal-heading">Select a message</p>
          <p className="mt-1 text-sm text-portal-muted">
            Choose an enquiry from the list to read and reply.
          </p>
        </div>
      </Card>
    );
  }

  const nextStatus = nextContactStatus(message.status);
  const nextLabel = nextContactActionLabel(message.status);
  const lang = localeLabel(message.locale);
  const mailHref = contactReplyMailtoHref(message, replyDraft);

  return (
    <Card className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <UserInitialAvatar name={message.name} size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-portal-heading">{message.name}</h2>
                <ContactMessageStatusBadge status={message.status} />
                {lang ? (
                  <span className="rounded-full bg-portal-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                    {lang}
                  </span>
                ) : null}
              </div>
              <a
                href={`mailto:${message.email}`}
                className="mt-1 inline-flex items-center gap-1.5 text-sm text-portal-muted transition hover:text-primary"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                {message.email}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {nextStatus && nextLabel ? (
              <Button
                type="button"
                disabled={busy}
                onClick={() => onUpdateStatus(message, nextStatus)}
                className="h-9 rounded-xl bg-primary-dark px-4 text-sm text-white"
              >
                {nextLabel}
              </Button>
            ) : null}
            <a
              href={mailHref}
              className="inline-flex h-9 items-center rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:text-primary"
            >
              Reply via email
            </a>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <div className="max-w-[85%]">
          <div className="rounded-2xl rounded-tl-md border border-portal bg-portal-muted/30 px-4 py-3">
            {message.subject ? (
              <p className="mb-2 text-sm font-semibold text-portal-heading">{message.subject}</p>
            ) : null}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-portal-heading">
              {message.message}
            </p>
          </div>
          <p className="mt-2 text-xs text-portal-muted">{formatInboxDateTime(message.createdAt)}</p>
        </div>

        {message.status !== "new" ? (
          <div className="ml-auto max-w-[85%]">
            <div className="rounded-2xl rounded-tr-md border border-primary/20 bg-primary/10 px-4 py-3">
              <p className="text-sm font-semibold text-primary-dark">
                {message.status === "closed" ? "Marked as closed" : "Marked as replied"}
              </p>
              <p className="mt-1 text-xs text-portal-muted">
                Status updated in admin inbox · {formatInboxDateTime(message.updatedAt)}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {message.status !== "closed" ? (
        <div className="border-t border-portal p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
            Reply
          </label>
          <textarea
            value={replyDraft}
            onChange={(event) => setReplyDraft(event.target.value)}
            rows={4}
            placeholder="Type your reply…"
            className={cn(
              "mt-2 w-full resize-none rounded-xl border border-portal bg-portal-surface px-4 py-3 text-sm text-portal-heading",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            )}
          />
          <div className="mt-3 flex justify-end">
            <a
              href={mailHref}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <Send className="size-4" aria-hidden />
              Send via email
            </a>
          </div>
          <p className="mt-2 text-xs text-portal-muted">
            Opens your email app with this reply drafted — then mark the message as replied.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
