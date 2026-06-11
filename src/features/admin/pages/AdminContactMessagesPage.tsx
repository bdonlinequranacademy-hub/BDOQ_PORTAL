import { useState } from "react";
import { Inbox, Mail } from "lucide-react";
import type { ContactMessageStatus, ContactMessageView } from "@/types/models";
import {
  useAdminContactMessages,
  useUpdateContactMessageStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type Filter = "new" | "all" | ContactMessageStatus;

function statusStyles(status: ContactMessageStatus) {
  switch (status) {
    case "replied":
      return "bg-blue-100 text-blue-800";
    case "closed":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function nextActions(status: ContactMessageStatus): { label: string; status: ContactMessageStatus }[] {
  switch (status) {
    case "new":
      return [{ label: "Mark replied", status: "replied" }];
    case "replied":
      return [{ label: "Mark closed", status: "closed" }];
    default:
      return [];
  }
}

function localeLabel(locale?: ContactMessageView["locale"]) {
  if (locale === "bn") return "বাংলা";
  if (locale === "en") return "English";
  return null;
}

function replyViaEmailHref(message: ContactMessageView): string {
  const subject = encodeURIComponent("Re: Your message to Al Bayaan Academy");
  const body = encodeURIComponent(
    `Assalamu alaikum ${message.name},\n\nThank you for contacting Al Bayaan Academy.\n\n---\nYour message:\n${message.message}\n---\n\n`
  );
  return `mailto:${message.email}?subject=${subject}&body=${body}`;
}

export function AdminContactMessagesPage() {
  const [filter, setFilter] = useState<Filter>("new");
  const status = filter === "all" ? undefined : filter;
  const { data: messages = [], isLoading } = useAdminContactMessages(status);
  const updateStatus = useUpdateContactMessageStatus();

  const newCount =
    filter === "new" ? messages.length : messages.filter((m) => m.status === "new").length;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Contact Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Enquiries from the website contact form — reply within 24 hours
        </p>
      </div>

      {filter === "new" && newCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            {newCount} new message{newCount === 1 ? "" : "s"} awaiting reply
          </p>
        </Card>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "new" as const, label: "New" },
            { id: "replied" as const, label: "Replied" },
            { id: "closed" as const, label: "Closed" },
            { id: "all" as const, label: "All" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              filter === f.id
                ? "bg-[#03214F] text-white"
                : "border border-zinc-200 bg-white text-[#03214F]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading contact messages…</p>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No contact messages in this view"
          description="Messages appear here when visitors submit the contact form on your website."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {messages.map((message) => {
            const actions = nextActions(message.status);
            const lang = localeLabel(message.locale);

            return (
              <Card
                key={message._id}
                className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles(message.status)}`}
                  >
                    {message.status}
                  </span>
                  {lang ? (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {lang}
                    </span>
                  ) : null}
                  <span className="text-xs text-zinc-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-[#03214F]">{message.name}</p>
                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-[#03214F]"
                  >
                    <Mail className="size-4 shrink-0 text-zinc-400" />
                    {message.email}
                  </a>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                  {message.message}
                </p>

                {message.status !== "closed" ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={replyViaEmailHref(message)}
                      className="inline-flex h-9 items-center rounded-xl border border-[#03214F]/20 bg-white px-4 text-sm font-semibold text-[#03214F] transition hover:border-[#03214F]/40 hover:bg-[#03214F]/5"
                    >
                      Reply via email
                    </a>
                    {actions.map((action) => (
                      <Button
                        key={action.status}
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({ id: message._id, status: action.status })
                        }
                        disabled={updateStatus.isPending}
                        className="h-9 rounded-xl bg-[#03214F] px-4 text-sm text-white"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
