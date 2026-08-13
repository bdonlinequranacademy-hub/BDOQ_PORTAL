import type { ContactMessageStatus, ContactMessageView } from "@/types/models";
import { formatAmPmDateTime, formatAmPmTime } from "@/i18n/format";

export type AdminContactInboxTab = "all" | ContactMessageStatus;

export interface IAdminContactInboxStats {
  total: number;
  new: number;
  replied: number;
  closed: number;
  newToday: number;
  repliedThisWeek: number;
}

export interface IContactInboxActivityItem {
  id: string;
  timeLabel: string;
  title: string;
  detail?: string;
}

const STATUS_LABELS: Record<ContactMessageStatus, string> = {
  new: "New",
  replied: "Replied",
  closed: "Closed",
};

export function contactMessageStatusLabel(status: ContactMessageStatus): string {
  return STATUS_LABELS[status];
}

export function contactMessageStatusStyles(status: ContactMessageStatus): string {
  switch (status) {
    case "replied":
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
    case "closed":
      return "border-zinc-500/35 bg-zinc-500/10 text-zinc-700";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

export function localeLabel(locale?: ContactMessageView["locale"]): string | null {
  if (locale === "bn") return "Bengali";
  if (locale === "en") return "English";
  return null;
}

export function messagePreview(message: string, max = 88): string {
  const trimmed = message.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function formatInboxTime(iso: string): string {
  const value = new Date(iso);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  if (value >= todayStart) {
    return formatAmPmTime(value);
  }
  if (value >= yesterdayStart) return "Yesterday";
  return value.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatInboxDateTime(iso: string): string {
  return formatAmPmDateTime(iso, "en-US");
}

export function messageSearchText(message: ContactMessageView): string {
  return [message.name, message.email, message.subject, message.message, message.locale]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function computeContactInboxStats(messages: ContactMessageView[]): IAdminContactInboxStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  let newToday = 0;
  let repliedThisWeek = 0;

  for (const message of messages) {
    const created = new Date(message.createdAt);
    const updated = new Date(message.updatedAt);
    if (created >= todayStart && message.status === "new") newToday += 1;
    if (message.status === "replied" && updated >= weekStart) repliedThisWeek += 1;
  }

  return {
    total: messages.length,
    new: messages.filter((message) => message.status === "new").length,
    replied: messages.filter((message) => message.status === "replied").length,
    closed: messages.filter((message) => message.status === "closed").length,
    newToday,
    repliedThisWeek,
  };
}

export function filterContactMessages(
  messages: ContactMessageView[],
  options: { tab: AdminContactInboxTab; search: string }
): ContactMessageView[] {
  const query = options.search.trim().toLowerCase();

  return messages
    .filter((message) => {
      if (options.tab !== "all" && message.status !== options.tab) return false;
      if (!query) return true;
      return messageSearchText(message).includes(query);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function nextContactStatus(status: ContactMessageStatus): ContactMessageStatus | null {
  switch (status) {
    case "new":
      return "replied";
    case "replied":
      return "closed";
    default:
      return null;
  }
}

export function nextContactActionLabel(status: ContactMessageStatus): string | null {
  const next = nextContactStatus(status);
  if (!next) return null;
  return `Mark ${contactMessageStatusLabel(next).toLowerCase()}`;
}

export function contactReplyMailtoHref(
  message: ContactMessageView,
  replyBody?: string
): string {
  const subject = encodeURIComponent(
    message.subject?.trim()
      ? `Re: ${message.subject.trim()}`
      : "Re: Your message to BD Online Quran Academy"
  );
  const bodyText =
    replyBody?.trim() ||
    `Assalamu alaikum ${message.name},\n\nThank you for contacting BD Online Quran Academy.\n\n---\nYour message:\n${message.message}\n---\n\n`;
  const body = encodeURIComponent(bodyText);
  return `mailto:${message.email}?subject=${subject}&body=${body}`;
}

export function buildContactActivity(message: ContactMessageView): IContactInboxActivityItem[] {
  const items: IContactInboxActivityItem[] = [
    {
      id: `${message._id}-received`,
      timeLabel: formatInboxDateTime(message.createdAt),
      title: "New enquiry received",
      detail: "Submitted from website contact form",
    },
  ];

  if (message.status === "replied" || message.status === "closed") {
    items.push({
      id: `${message._id}-replied`,
      timeLabel: formatInboxDateTime(message.updatedAt),
      title: message.status === "closed" ? "Marked as closed" : "Marked as replied",
      detail: "Status updated in admin inbox",
    });
  }

  if (message.status === "closed" && message.updatedAt !== message.createdAt) {
    const repliedAt = message.updatedAt;
    if (items.length === 1) {
      items.push({
        id: `${message._id}-status`,
        timeLabel: formatInboxDateTime(repliedAt),
        title: "Conversation resolved",
      });
    }
  }

  return items;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportContactMessagesFile(
  messages: ContactMessageView[],
  filenamePrefix: string
): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = ["Name", "Email", "Subject", "Message", "Status", "Locale", "Submitted At"];
  const lines = [
    header.join(","),
    ...messages.map((message) =>
      [
        csvEscape(message.name),
        csvEscape(message.email),
        csvEscape(message.subject ?? ""),
        csvEscape(message.message),
        csvEscape(message.status),
        csvEscape(message.locale ?? ""),
        csvEscape(message.createdAt),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
