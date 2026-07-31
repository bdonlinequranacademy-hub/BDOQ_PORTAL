import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Download,
  GraduationCap,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ContactMessageStatus, ContactMessageView } from "@/types/models";
import { ContactMessageStatusBadge } from "@/features/admin/components/contact-inbox/ContactMessageStatusBadge";
import {
  buildContactActivity,
  contactReplyMailtoHref,
  exportContactMessagesFile,
  formatInboxDateTime,
  localeLabel,
  nextContactActionLabel,
  nextContactStatus,
} from "@/features/admin/components/contact-inbox/adminContactInboxUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminContactInboxDetailsProps {
  message: ContactMessageView | null;
  allMessages: ContactMessageView[];
  busy: boolean;
  isFetching: boolean;
  onRefresh: () => void;
  onUpdateStatus: (message: ContactMessageView, status: ContactMessageStatus) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-portal/80 py-2.5 last:border-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-portal-muted">
        {label}
      </dt>
      <dd className="text-sm font-medium text-portal-heading">{value}</dd>
    </div>
  );
}

export function AdminContactInboxDetails({
  message,
  allMessages,
  busy,
  isFetching,
  onRefresh,
  onUpdateStatus,
}: IAdminContactInboxDetailsProps) {
  const { t } = usePortalTranslation();

  const activity = message ? buildContactActivity(message) : [];
  const nextStatus = message ? nextContactStatus(message.status) : null;
  const nextLabel = message ? nextContactActionLabel(message.status) : null;

  const actions = [
    {
      label: "Reply email",
      icon: Mail,
      href: message ? contactReplyMailtoHref(message) : undefined,
    },
    {
      label: nextLabel ?? "Update status",
      icon: RefreshCw,
      onClick:
        message && nextStatus
          ? () => onUpdateStatus(message, nextStatus)
          : undefined,
      disabled: !message || !nextStatus || busy,
    },
    {
      label: "Trial leads",
      icon: CalendarCheck,
      to: "/admin/trial-bookings",
    },
    {
      label: t("admin.admissions.title"),
      icon: GraduationCap,
      to: "/admin/student-admissions",
    },
  ];

  return (
    <aside className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">Contact details</h2>
        {message ? (
          <dl className="mt-3">
            <DetailRow label="Name" value={message.name} />
            <DetailRow label="Email" value={message.email} />
            {message.subject ? <DetailRow label="Subject" value={message.subject} /> : null}
            {localeLabel(message.locale) ? (
              <DetailRow label="Language" value={localeLabel(message.locale)!} />
            ) : null}
            <DetailRow label="Source" value="Website contact form" />
            <DetailRow label="Submitted" value={formatInboxDateTime(message.createdAt)} />
            <DetailRow label="Last updated" value={formatInboxDateTime(message.updatedAt)} />
            <div className="pt-2">
              <ContactMessageStatusBadge status={message.status} />
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-portal-muted">Select a message to view details.</p>
        )}
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">Activity</h2>
        {activity.length === 0 ? (
          <p className="mt-3 text-sm text-portal-muted">No activity yet.</p>
        ) : (
          <div className="mt-4 flex max-h-[220px] flex-col gap-3 overflow-y-auto pr-1">
            {activity.map((item) => (
              <div key={item.id} className="relative border-l-2 border-primary/25 pl-3">
                <p className="text-xs font-semibold tabular-nums text-primary">{item.timeLabel}</p>
                <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
                {item.detail ? <p className="text-xs text-portal-muted">{item.detail}</p> : null}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.cms.shared.quickActions")}</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map(({ label, icon: Icon, href, to, onClick, disabled }) => {
            const className =
              "inline-flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 px-3 py-3 text-left text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

            if (href) {
              return (
                <a key={label} href={href} className={className}>
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </a>
              );
            }

            if (to) {
              return (
                <Link key={label} to={to} className={className}>
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </Link>
              );
            }

            return (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={className}
              >
                <Icon
                  className={cn("size-4 text-primary", disabled && busy && "animate-spin")}
                  aria-hidden
                />
                {label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => exportContactMessagesFile(allMessages, "contact-inbox")}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-portal px-3 py-2.5 text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary"
        >
          <Download className="size-4 text-primary" aria-hidden />
          Export all
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-portal px-3 py-2.5 text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw
            className={cn("size-4 text-primary", isFetching && "animate-spin")}
            aria-hidden
          />
          {isFetching ? "Refreshing…" : "Refresh inbox"}
        </button>
      </Card>
    </aside>
  );
}
