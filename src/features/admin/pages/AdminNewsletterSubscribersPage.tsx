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

type TabFilter = "all" | NewsletterSubscriberStatus;

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function StatusBadge({ status }: { status: NewsletterSubscriberStatus }) {
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
      {active ? "Active" : "Unsubscribed"}
    </span>
  );
}

export function AdminNewsletterSubscribersPage() {
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

  if (isLoading) return <PageLoading />;

  return (
    <PageContainer>
      <div>
        <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
          Newsletter
        </h1>
        <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
          Emails collected from the website footer newsletter form.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", `All (${counts.all})`],
            ["active", `Active (${counts.active})`],
            ["unsubscribed", `Unsubscribed (${counts.unsubscribed})`],
          ] as const
        ).map(([key, label]) => (
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
            {label}
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
          placeholder="Search email or source…"
          className="w-full rounded-[8px] border border-portal bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
        />
      </label>

      {isError ? (
        <EmptyState
          title="Could not load subscribers"
          description="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No subscribers yet"
          description="When someone submits the footer newsletter form, they will appear here."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-portal-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Locale</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
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
                        {row.status === "active" ? "Unsubscribe" : "Reactivate"}
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
