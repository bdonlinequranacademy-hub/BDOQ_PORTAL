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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminContactMessagesPage() {
  const { t } = usePortalTranslation();
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
            {t("admin.contact.title")}
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            {t("admin.contact.subtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4"
        >
          <Download className="size-4" aria-hidden />
          {t("admin.common.export")}
        </Button>
      </div>

      <AdminContactInboxStatsGrid stats={stats} isLoading={isLoading} />

      <AdminContactInboxNewAlert newCount={stats.new} onReview={() => setTab("new")} />

      {isError ? (
        <EmptyState
          icon={Inbox}
          title={t("admin.contact.loadError")}
          description={t("admin.contact.loadErrorDesc")}
          actionLabel={t("admin.common.retry")}
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label={t("admin.common.loadingContactInbox")} />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t("admin.contact.noMessages")}
          description={t("admin.contact.noMessagesDesc")}
        />
      ) : visibleMessages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t("admin.contact.noMatch")}
          description={t("admin.contact.noMatchDesc")}
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
