import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, RefreshCw } from "lucide-react";
import { useAdminWhatsAppQueue } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import type { WhatsAppQueueCategory, WhatsAppQueueItem } from "@/types/models";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

type Filter = "all" | WhatsAppQueueCategory;

const FILTER_KEYS: Record<Filter, string> = {
  all: "admin.whatsapp.filterAll",
  class_reminder: "admin.whatsapp.filterClassReminder",
  payment_overdue: "admin.whatsapp.filterOverdue",
  payment_due_soon: "admin.whatsapp.filterDueSoon",
  new_trial: "admin.whatsapp.filterTrial",
  new_admission: "admin.whatsapp.filterAdmissions",
  missing_whatsapp: "admin.whatsapp.filterMissingNumber",
};

function categoryBadge(category: WhatsAppQueueCategory) {
  switch (category) {
    case "class_reminder":
      return "bg-emerald-100 text-emerald-800";
    case "payment_overdue":
      return "bg-red-100 text-red-800";
    case "payment_due_soon":
      return "bg-amber-100 text-amber-900";
    case "new_trial":
      return "bg-blue-100 text-blue-800";
    case "new_admission":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-zinc-200 text-zinc-700";
  }
}

function QueueRow({ item }: { item: WhatsAppQueueItem }) {
  const { t, role } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-zinc-100 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                categoryBadge(item.category)
              )}
            >
              {t(FILTER_KEYS[item.category])}
            </span>
            <span className="text-xs text-zinc-400 capitalize">{role(item.recipientRole)}</span>
          </div>
          <p className="mt-2 font-semibold text-primary-dark">{item.recipientName}</p>
          <p className="text-sm text-zinc-500">{item.title}</p>
          <p className="text-xs text-zinc-400">{item.subtitle}</p>
          <p className="mt-2 text-xs text-zinc-600">
            {t("admin.whatsapp.whatsappLabel")}{" "}
            <span className={item.phoneValid ? "font-medium text-emerald-700" : "text-amber-700"}>
              {item.phoneDisplay}
            </span>
          </p>
          {item.phoneError ? (
            <p className="mt-1 text-xs text-amber-800">{item.phoneError}</p>
          ) : null}
          {item.message ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-primary-dark">
                {t("admin.whatsapp.previewMessage")}
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600">
                {item.message}
              </pre>
            </details>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <WhatsAppLinkButton
            href={item.waUrl}
            label={
              item.category === "missing_whatsapp"
                ? t("admin.whatsapp.noNumber")
                : t("admin.whatsapp.sendWhatsapp")
            }
            disabledReason={item.phoneError}
          />
          {item.userId && item.category === "missing_whatsapp" ? (
            <Link
              to="/admin/users"
              className="text-center text-xs font-semibold text-gold hover:underline"
            >
              {t("admin.whatsapp.fixInUsers")}
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function AdminWhatsAppQueuePage() {
  const { t } = usePortalTranslation();
  const { data: items = [], isLoading, refetch, isFetching } = useAdminWhatsAppQueue();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const map: Record<Filter, number> = {
      all: items.length,
      class_reminder: 0,
      payment_overdue: 0,
      payment_due_soon: 0,
      new_trial: 0,
      new_admission: 0,
      missing_whatsapp: 0,
    };
    for (const item of items) {
      map[item.category] += 1;
    }
    return map;
  }, [items]);

  const filtered =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  const pagination = usePaginatedList(filtered, {
    resetDeps: [filter],
  });

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#128C7E]">
            <MessageCircle className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {t("admin.whatsapp.badge")}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-primary-dark">
            {t("admin.whatsapp.title")}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            {t("admin.whatsapp.subtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="gap-2 border border-zinc-200"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          {t("admin.whatsapp.refresh")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_KEYS) as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-[8px] px-3 py-1.5 text-xs font-semibold transition",
              filter === key
                ? "bg-primary-dark text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            {t(FILTER_KEYS[key])} ({counts[key]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading label={t("admin.common.loadingWhatsappQueue")} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title={t("admin.whatsapp.emptyTitle")}
          description={t("admin.whatsapp.emptyDesc")}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pagination.paginatedItems.map((item) => (
              <QueueRow key={item.id} item={item} />
            ))}
          </div>
          <Pagination pagination={pagination} itemLabel={t("admin.common.messagesItemLabel")} />
        </>
      )}
    </PageContainer>
  );
}
