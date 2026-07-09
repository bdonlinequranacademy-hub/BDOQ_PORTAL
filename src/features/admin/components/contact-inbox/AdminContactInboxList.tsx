import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { Pagination } from "@/components/ui/Pagination";
import type { ContactMessageView } from "@/types/models";
import { ContactMessageStatusBadge } from "@/features/admin/components/contact-inbox/ContactMessageStatusBadge";
import {
  formatInboxTime,
  messagePreview,
  type AdminContactInboxTab,
} from "@/features/admin/components/contact-inbox/adminContactInboxUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { IPaginatedListResult } from "@/lib/hooks/usePaginatedList";

interface IAdminContactInboxListProps {
  messages: ContactMessageView[];
  selectedId: string | null;
  search: string;
  tab: AdminContactInboxTab;
  tabCounts: Record<AdminContactInboxTab, number>;
  pagination: IPaginatedListResult<ContactMessageView>;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: AdminContactInboxTab) => void;
  onSelect: (message: ContactMessageView) => void;
}

const TABS: { id: AdminContactInboxTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "replied", label: "Replied" },
  { id: "closed", label: "Closed" },
];

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminContactInboxList({
  messages,
  selectedId,
  search,
  tab,
  tabCounts,
  pagination,
  onSearchChange,
  onTabChange,
  onSelect,
}: IAdminContactInboxListProps) {
  return (
    <Card className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "w-full pl-9")}
            placeholder="Search messages…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search contact messages"
          />
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                tab === item.id
                  ? "bg-primary-dark text-white shadow-sm"
                  : "border border-portal bg-portal-muted/20 text-portal-heading hover:bg-portal-muted/40"
              )}
            >
              {item.label} ({tabCounts[item.id]})
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="p-5 text-sm text-portal-muted">No messages in this view.</p>
        ) : (
          <ul className="divide-y divide-portal/80">
            {pagination.paginatedItems.map((message) => {
              const isSelected = message._id === selectedId;
              return (
                <li key={message._id}>
                  <button
                    type="button"
                    onClick={() => onSelect(message)}
                    className={cn(
                      "flex w-full gap-3 px-4 py-3.5 text-left transition",
                      isSelected
                        ? "bg-primary/10 ring-1 ring-inset ring-primary/20"
                        : "hover:bg-portal-muted/25"
                    )}
                  >
                    <UserInitialAvatar name={message.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-portal-heading">
                          {message.name}
                        </p>
                        <span className="shrink-0 text-[11px] font-medium tabular-nums text-portal-muted">
                          {formatInboxTime(message.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-portal-muted">
                        {messagePreview(message.message)}
                      </p>
                      <div className="mt-2">
                        <ContactMessageStatusBadge status={message.status} />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {messages.length > 0 ? (
        <div className="border-t border-portal p-3">
          <Pagination
            pagination={pagination}
            itemLabel="messages"
            className="rounded-xl border-0 bg-transparent px-0 py-0 shadow-none"
          />
        </div>
      ) : null}
    </Card>
  );
}
