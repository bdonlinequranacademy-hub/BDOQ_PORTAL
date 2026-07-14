import { useEffect, useMemo, useState } from "react";
import { Download, Inbox } from "lucide-react";
import type { ContactMessageStatus, ContactMessageView } from "@/types/models";
import {
  useAdminContactMessages,
  useUpdateContactMessageStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminContactInboxStatsGrid } from "@/features/admin/components/contact-inbox/AdminContactInboxStatsGrid";
import { AdminContactInboxNewAlert } from "@/features/admin/components/contact-inbox/AdminContactInboxNewAlert";
import { AdminContactInboxList } from "@/features/admin/components/contact-inbox/AdminContactInboxList";
import { AdminContactInboxConversation } from "@/features/admin/components/contact-inbox/AdminContactInboxConversation";
import { AdminContactInboxDetails } from "@/features/admin/components/contact-inbox/AdminContactInboxDetails";
import {
  computeContactInboxStats,
  exportContactMessagesFile,
  filterContactMessages,
  type AdminContactInboxTab,
} from "@/features/admin/components/contact-inbox/adminContactInboxUtils";

export function AdminContactMessagesPage() {
  const [tab, setTab] = useState<AdminContactInboxTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: messages = [], isLoading, isError, isFetching, refetch } =
    useAdminContactMessages();
  const updateStatus = useUpdateContactMessageStatus();

  const stats = useMemo(() => computeContactInboxStats(messages), [messages]);

  const tabCounts = useMemo(
    () => ({
      all: messages.length,
      new: stats.new,
      replied: stats.replied,
      closed: stats.closed,
    }),
    [messages.length, stats]
  );

  const visibleMessages = useMemo(
    () => filterContactMessages(messages, { tab, search }),
    [messages, tab, search]
  );

  const pagination = usePaginatedList(visibleMessages, {
    pageSize: 10,
    resetDeps: [tab, search],
  });

  const selectedMessage = useMemo(
    () => visibleMessages.find((message) => message._id === selectedId) ?? null,
    [visibleMessages, selectedId]
  );

  useEffect(() => {
    if (visibleMessages.length === 0) {
      setSelectedId(null);
      return;
    }

    const stillVisible = visibleMessages.some((message) => message._id === selectedId);
    if (!stillVisible) {
      setSelectedId(visibleMessages[0]._id);
    }
  }, [visibleMessages, selectedId]);

  const busy = updateStatus.isPending;

  function handleUpdateStatus(message: ContactMessageView, status: ContactMessageStatus) {
    updateStatus.mutate({ id: message._id, status });
  }

  function handleExport() {
    exportContactMessagesFile(visibleMessages, "contact-inbox-filtered");
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Contact Inbox
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            Enquiries from the website contact form — reply within 24 hours.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4"
        >
          <Download className="size-4" aria-hidden />
          Export
        </Button>
      </div>

      <AdminContactInboxStatsGrid stats={stats} isLoading={isLoading} />

      <AdminContactInboxNewAlert newCount={stats.new} onReview={() => setTab("new")} />

      {isError ? (
        <EmptyState
          icon={Inbox}
          title="Could not load contact inbox"
          description="The server failed to return contact messages. Try again in a moment."
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading contact inbox…" />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No contact messages yet"
          description="Messages appear here when visitors submit the contact form on your website."
        />
      ) : visibleMessages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages match your filters"
          description="Try clearing search or switching to another status tab."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)_minmax(240px,280px)] xl:gap-5">
          <AdminContactInboxList
            messages={visibleMessages}
            selectedId={selectedId}
            search={search}
            tab={tab}
            tabCounts={tabCounts}
            pagination={pagination}
            onSearchChange={setSearch}
            onTabChange={setTab}
            onSelect={(message) => setSelectedId(message._id)}
          />
          <AdminContactInboxConversation
            message={selectedMessage}
            busy={busy}
            onUpdateStatus={handleUpdateStatus}
          />
          <AdminContactInboxDetails
            message={selectedMessage}
            allMessages={messages}
            busy={busy}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}
    </PageContainer>
  );
}
