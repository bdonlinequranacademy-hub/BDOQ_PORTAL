import { useMemo, useState } from "react";
import { Gift } from "lucide-react";
import type {
  OptionalPaymentCategory,
  OptionalPaymentView,
  PaymentStatus,
} from "@/types/models";
import {
  useAdminOptionalPayments,
  useApproveOptionalPayment,
  useRejectOptionalPayment,
} from "@/features/admin/hooks/useAdmin";
import {
  OPTIONAL_PAYMENT_CATEGORIES,
} from "@/lib/optionalPayments";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { toViewableUploadUrl } from "@/lib/toViewableUploadUrl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

type GiftTab = "all" | PaymentStatus;

function statusBadge(status: PaymentStatus): string {
  if (status === "approved") return "bg-emerald-100 text-emerald-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

export function AdminGiftsPage() {
  const { t, paymentMethod, statusLabel, formatDate, formatMoney } =
    usePortalTranslation();
  const [tab, setTab] = useState<GiftTab>("all");
  const [category, setCategory] = useState<"all" | OptionalPaymentCategory>("all");
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: payments = [], isLoading, isError, refetch } =
    useAdminOptionalPayments();
  const approve = useApproveOptionalPayment();
  const reject = useRejectOptionalPayment();

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((payment) => {
      const matchesTab = tab === "all" || payment.status === tab;
      const matchesCategory =
        category === "all" || payment.category === category;
      const haystack = [
        payment.payerName,
        payment.email ?? "",
        payment.whatsapp ?? "",
        payment.reference,
        payment.customLabel ?? "",
        payment.linkedUser?.name ?? "",
        payment.linkedUser?.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [payments, tab, category, search]);

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [tab, category, search],
  });

  const counts = useMemo(
    () => ({
      all: payments.length,
      pending: payments.filter((item) => item.status === "pending").length,
      approved: payments.filter((item) => item.status === "approved").length,
      rejected: payments.filter((item) => item.status === "rejected").length,
    }),
    [payments]
  );

  function handleReject(payment: OptionalPaymentView) {
    if (!rejectReason.trim()) return;
    reject.mutate(
      { id: payment._id, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setRejectingId(null);
          setRejectReason("");
        },
      }
    );
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
          {t("admin.optionalPayments.title")}
        </h1>
        <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
          {t("admin.optionalPayments.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {(["all", "pending", "approved", "rejected"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              tab === item
                ? "border-primary bg-primary/10 text-primary-dark"
                : "border-zinc-100 bg-white text-zinc-600"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">
              {t(`admin.optionalPayments.tab${item[0].toUpperCase()}${item.slice(1)}`)}
            </p>
            <p className="mt-1 text-xl font-bold">{counts[item]}</p>
          </button>
        ))}
      </div>

      <Card className="rounded-2xl border-0 p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.optionalPayments.searchPlaceholder")}
          />
          <Select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "all" | OptionalPaymentCategory)
            }
          >
            <option value="all">{t("admin.optionalPayments.tabAll")}</option>
            {OPTIONAL_PAYMENT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {t(`payments.categories.${item}`)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {isError ? (
        <EmptyState
          icon={Gift}
          title={t("admin.optionalPayments.loadError")}
          description={t("admin.optionalPayments.loadErrorDesc")}
          actionLabel={t("common.retry")}
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label={t("admin.optionalPayments.title")} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Gift}
          title={
            payments.length === 0
              ? t("admin.optionalPayments.empty")
              : t("admin.optionalPayments.noMatch")
          }
          description={
            payments.length === 0 ? t("admin.optionalPayments.emptyDesc") : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {pagination.paginatedItems.map((payment) => (
            <Card key={payment._id} className="rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-navy">
                    {t(`payments.categories.${payment.category}`)}
                    {payment.customLabel ? ` · ${payment.customLabel}` : ""}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {payment.payerName}
                    {payment.email ? ` · ${payment.email}` : ""}
                    {payment.whatsapp ? ` · ${payment.whatsapp}` : ""}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {formatMoney(payment.amount, payment.currency)} ·{" "}
                    {paymentMethod(payment.method)} · {payment.reference}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatDate(payment.createdAt)} ·{" "}
                    {payment.source === "portal"
                      ? t("admin.optionalPayments.sourcePortal")
                      : t("admin.optionalPayments.sourcePublic")}
                    {payment.linkedUser
                      ? ` · ${t("admin.optionalPayments.linkedUser")}: ${payment.linkedUser.name}`
                      : ""}
                  </p>
                  {payment.note ? (
                    <p className="text-sm text-zinc-600">
                      {t("admin.optionalPayments.note")}: {payment.note}
                    </p>
                  ) : null}
                  {payment.rejectionReason ? (
                    <p className="text-sm text-red-600">{payment.rejectionReason}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(payment.status)}`}
                  >
                    {statusLabel(payment.status)}
                  </span>
                  <a
                    href={toViewableUploadUrl(payment.screenshotUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {t("admin.optionalPayments.viewProof")}
                  </a>
                  {payment.status === "pending" ? (
                    <>
                      <Button
                        type="button"
                        onClick={() => approve.mutate(payment._id)}
                        disabled={approve.isPending}
                      >
                        {t("admin.optionalPayments.approve")}
                      </Button>
                      {rejectingId === payment._id ? (
                        <div className="flex w-full flex-col gap-2 sm:w-64">
                          <Input
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder={t(
                              "admin.optionalPayments.rejectReasonPlaceholder"
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => handleReject(payment)}
                              disabled={reject.isPending || !rejectReason.trim()}
                            >
                              {t("admin.optionalPayments.rejectConfirm")}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                            >
                              {t("common.cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline-danger"
                          onClick={() => setRejectingId(payment._id)}
                        >
                          {t("admin.optionalPayments.reject")}
                        </Button>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
          <Pagination pagination={pagination} itemLabel="payments" />
        </div>
      )}
    </PageContainer>
  );
}
