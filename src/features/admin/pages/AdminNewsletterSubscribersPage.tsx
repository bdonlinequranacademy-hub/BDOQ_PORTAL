import { useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import type {
  NewsletterSubscriberStatus,
  NewsletterSubscriberView,
} from "@/types/models";
import {
  useAdminNewsletterSubscribers,
  useUpdateNewsletterSubscriberStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

type TabFilter = "all" | NewsletterSubscriberStatus;

function StatusBadge({ status }: { status: NewsletterSubscriberStatus }) {
  const { statusLabel } = usePortalTranslation();
  const active = status === "active";
  return (
    <span
      className={cn(
        "inline-flex rounded-[8px] px-2 py-0.5 text-xs font-semibold",
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function AdminNewsletterSubscribersPage() {
  const { t, formatDate } = usePortalTranslation();
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");

  const { data: rows = [], isLoading, isError, refetch } =
    useAdminNewsletterSubscribers();
  const updateStatus = useUpdateNewsletterSubscriberStatus();

  const counts = useMemo(
    () => ({
      all: rows.length,
      active: rows.filter((row) => row.status === "active").length,
      unsubscribed: rows.filter((row) => row.status === "unsubscribed").length,
    }),
    [rows]
  );

  const tabLabels = useMemo(
    () =>
      ({
        all: t("admin.newsletter.tabAll"),
        active: t("admin.newsletter.tabActive"),
        unsubscribed: t("admin.newsletter.tabUnsubscribed"),
      }) as const,
    [t]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (tab !== "all" && row.status !== tab) return false;
      if (!q) return true;
      return (
        row.email.toLowerCase().includes(q) ||
        (row.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, tab, search]);

  function handleToggle(row: NewsletterSubscriberView) {
    const next: NewsletterSubscriberStatus =
      row.status === "active" ? "unsubscribed" : "active";
    updateStatus.mutate({ id: row._id, status: next });
  }

  if (isLoading) return <PageLoading label={t("admin.common.loadingNewsletter")} />;

  return (
    <PageContainer>
      <div>
        <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
          {t("admin.newsletter.title")}
        </h1>
        <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
          {t("admin.newsletter.subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "active", "unsubscribed"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "rounded-[8px] px-3 py-1.5 text-sm font-semibold transition-colors",
              tab === key
                ? "bg-primary text-white"
                : "bg-white text-portal-muted ring-1 ring-portal hover:text-primary-dark"
            )}
          >
            {tabLabels[key]} ({counts[key]})
          </button>
        ))}
      </div>

      <label className="relative block max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("admin.newsletter.searchPlaceholder")}
          className="w-full rounded-[8px] border border-portal bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
        />
      </label>

      {isError ? (
        <EmptyState
          title={t("admin.newsletter.loadError")}
          description={t("admin.newsletter.loadErrorDesc")}
          actionLabel={t("admin.common.retry")}
          onAction={() => void refetch()}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={
            rows.length === 0
              ? t("admin.newsletter.noSubscribers")
              : t("admin.newsletter.noMatch")
          }
          description={
            rows.length === 0 ? t("admin.newsletter.noSubscribersDesc") : undefined
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-portal-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("admin.newsletter.colEmail")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.newsletter.colSource")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.newsletter.colLocale")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.newsletter.colStatus")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.newsletter.colJoined")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.newsletter.colAction")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row._id}
                    className="border-t border-portal/70 hover:bg-emerald-50/40"
                  >
                    <td className="px-4 py-3 font-medium text-primary-dark">
                      <a
                        href={`mailto:${row.email}`}
                        className="hover:text-primary hover:underline"
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-portal-muted">
                      {row.source || "—"}
                    </td>
                    <td className="px-4 py-3 uppercase text-portal-muted">
                      {row.locale || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-portal-muted">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={updateStatus.isPending}
                        onClick={() => handleToggle(row)}
                        className="min-h-0 rounded-[8px] px-3 py-1.5 text-xs"
                      >
                        {row.status === "active"
                          ? t("admin.newsletter.unsubscribe")
                          : t("admin.newsletter.reactivate")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
