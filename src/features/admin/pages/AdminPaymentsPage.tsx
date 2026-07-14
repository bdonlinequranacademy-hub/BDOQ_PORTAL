import { useMemo, useState } from "react";
import { Banknote, LayoutGrid, List } from "lucide-react";
import type { BillingCurrency, PaymentRecordView } from "@/types/models";
import {
  useAdminPayments,
  useAdminOverdueBillings,
  useAdminUsers,
  useApprovePayment,
  useRejectPayment,
  useUpsertStudentBilling,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminPaymentsStatsGrid } from "@/features/admin/components/payments/AdminPaymentsStatsGrid";
import { AdminPaymentsFilterPanel } from "@/features/admin/components/payments/AdminPaymentsFilterPanel";
import {
  AdminPaymentsTable,
  exportPaymentsFile,
} from "@/features/admin/components/payments/AdminPaymentsTable";
import {
  AdminPaymentMethodsOverview,
  AdminRecentTransactions,
} from "@/features/admin/components/payments/AdminPaymentsInsights";
import { AdminOverdueBillingsTable } from "@/features/admin/components/payments/AdminOverdueBillingsTable";
import { AdminStudentBillingForm } from "@/features/admin/components/payments/AdminStudentBillingForm";
import { cn } from "@/lib/utils/cn";

type PaymentTab = "all" | "pending" | "overdue" | "completed" | "rejected";
type SortOption = "newest" | "oldest" | "amount_high" | "amount_low";

function filterPayments(
  payments: PaymentRecordView[],
  options: {
    search: string;
    methodFilter: string;
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
    tab: PaymentTab;
    sortBy: SortOption;
  }
): PaymentRecordView[] {
  const query = options.search.trim().toLowerCase();
  const min = options.amountMin ? Number(options.amountMin) : null;
  const max = options.amountMax ? Number(options.amountMax) : null;

  const filtered = payments.filter((payment) => {
    const studentName = payment.student?.name?.toLowerCase() ?? "";
    const studentEmail = payment.student?.email?.toLowerCase() ?? "";
    const reference = payment.reference.toLowerCase();

    const matchesSearch =
      !query ||
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      reference.includes(query);

    const matchesMethod =
      options.methodFilter === "all" || payment.method === options.methodFilter;

    const paidAt = new Date(payment.paymentDate || payment.createdAt);
    const matchesFrom =
      !options.dateFrom || paidAt >= new Date(`${options.dateFrom}T00:00:00`);
    const matchesTo =
      !options.dateTo || paidAt <= new Date(`${options.dateTo}T23:59:59`);

    const matchesAmount =
      (min == null || payment.amount >= min) && (max == null || payment.amount <= max);

    const matchesTab =
      options.tab === "all" ||
      options.tab === "pending" ||
      (options.tab === "completed" && payment.status === "approved") ||
      (options.tab === "rejected" && payment.status === "rejected");

    const matchesPendingTab =
      options.tab !== "pending" || payment.status === "pending";

    return (
      matchesSearch &&
      matchesMethod &&
      matchesFrom &&
      matchesTo &&
      matchesAmount &&
      matchesTab &&
      matchesPendingTab
    );
  });

  return filtered.sort((a, b) => {
    if (options.sortBy === "amount_high") return b.amount - a.amount;
    if (options.sortBy === "amount_low") return a.amount - b.amount;

    const aTime = new Date(a.paymentDate || a.createdAt).getTime();
    const bTime = new Date(b.paymentDate || b.createdAt).getTime();
    return options.sortBy === "newest" ? bTime - aTime : aTime - bTime;
  });
}

export function AdminPaymentsPage() {
  const [tab, setTab] = useState<PaymentTab>("pending");
  const [showBilling, setShowBilling] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const statsEnabled = !showBilling;
  const { data: allPayments = [], isLoading: allLoading } = useAdminPayments(undefined, {
    enabled: statsEnabled,
  });
  const { data: pending = [], isLoading: pendingLoading } = useAdminPayments("pending", {
    enabled: !showBilling && tab === "pending",
  });
  const { data: overdue = [], isLoading: overdueLoading } = useAdminOverdueBillings({
    enabled: !showBilling,
  });
  const { data: students = [] } = useAdminUsers("student", undefined, {
    enabled: showBilling,
  });

  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();
  const upsertBilling = useUpsertStudentBilling();

  const [billingStudentId, setBillingStudentId] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [billingCurrency, setBillingCurrency] = useState<BillingCurrency>("USD");
  const [dueDay, setDueDay] = useState("1");
  const [paidUntil, setPaidUntil] = useState("");

  const busy = approvePayment.isPending || rejectPayment.isPending;

  const sourcePayments = useMemo(() => {
    if (tab === "pending") return pending;
    return allPayments;
  }, [tab, pending, allPayments]);

  const filteredPayments = useMemo(
    () =>
      filterPayments(sourcePayments, {
        search,
        methodFilter,
        dateFrom,
        dateTo,
        amountMin,
        amountMax,
        tab,
        sortBy,
      }),
    [sourcePayments, search, methodFilter, dateFrom, dateTo, amountMin, amountMax, tab, sortBy]
  );

  const filteredOverdue = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return overdue;
    return overdue.filter(
      (row) =>
        row.student.name.toLowerCase().includes(query) ||
        row.student.email.toLowerCase().includes(query)
    );
  }, [overdue, search]);

  const paymentPagination = usePaginatedList(filteredPayments, {
    resetDeps: [search, methodFilter, dateFrom, dateTo, amountMin, amountMax, tab, sortBy],
  });
  const overduePagination = usePaginatedList(filteredOverdue, {
    resetDeps: [search, tab],
  });

  const paymentTabs: { id: PaymentTab; label: string; count?: number }[] = [
    { id: "all", label: "All Payments", count: allPayments.length },
    { id: "pending", label: "Pending", count: pending.length },
    { id: "overdue", label: "Overdue", count: overdue.length },
    {
      id: "completed",
      label: "Completed",
      count: allPayments.filter((payment) => payment.status === "approved").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: allPayments.filter((payment) => payment.status === "rejected").length,
    },
  ];

  const listLoading =
    tab === "overdue"
      ? overdueLoading
      : tab === "pending"
        ? pendingLoading
        : allLoading;

  function clearFilters() {
    setSearch("");
    setMethodFilter("all");
    setDateFrom("");
    setDateTo("");
    setAmountMin("");
    setAmountMax("");
    setSortBy("newest");
  }

  return (
    <PageContainer>
      {showBilling ? (
        <AdminStudentBillingForm
          students={students}
          studentId={billingStudentId}
          monthlyFee={monthlyFee}
          currency={billingCurrency}
          dueDay={dueDay}
          paidUntil={paidUntil}
          saving={upsertBilling.isPending}
          onStudentIdChange={setBillingStudentId}
          onMonthlyFeeChange={setMonthlyFee}
          onCurrencyChange={setBillingCurrency}
          onDueDayChange={setDueDay}
          onPaidUntilChange={setPaidUntil}
          onBack={() => setShowBilling(false)}
          onSave={() => {
            if (!billingStudentId || !monthlyFee) return;
            upsertBilling.mutate({
              studentId: billingStudentId,
              monthlyFee: Number(monthlyFee),
              currency: billingCurrency,
              dueDayOfMonth: Number(dueDay) || 1,
              ...(paidUntil ? { paidUntil } : {}),
            });
          }}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
                Payment Management
              </h1>
              <p className="portal-page-subtitle mt-1 max-w-2xl text-portal-muted">
                Review manual payment proofs, track collections, and manage student billing plans.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowBilling(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              <Banknote className="size-4" aria-hidden />
              Set Billing
            </Button>
          </div>

          <AdminPaymentsStatsGrid
            allPayments={allPayments}
            overdue={overdue}
            isLoading={allLoading}
          />

          <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <AdminPaymentsFilterPanel
              search={search}
              onSearchChange={setSearch}
              methodFilter={methodFilter}
              onMethodFilterChange={setMethodFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              amountMin={amountMin}
              amountMax={amountMax}
              onAmountMinChange={setAmountMin}
              onAmountMaxChange={setAmountMax}
              onClearFilters={clearFilters}
              onExportCsv={() => exportPaymentsFile(filteredPayments, "csv")}
              onExportExcel={() => exportPaymentsFile(filteredPayments, "excel")}
            />

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {paymentTabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={cn(
                        "rounded-[8px] px-4 py-1.5 text-sm font-semibold transition",
                        tab === item.id
                          ? "bg-primary text-white shadow-sm"
                          : "border border-portal bg-portal-surface text-portal-heading hover:border-primary/30"
                      )}
                    >
                      {item.label}
                      {item.count != null ? ` (${item.count})` : ""}
                    </button>
                  ))}
                </div>

                {tab !== "overdue" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="min-w-[170px]">
                      <Select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value as SortOption)}
                        className="py-2 text-sm"
                        aria-label="Sort payments"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="amount_high">Amount high to low</option>
                        <option value="amount_low">Amount low to high</option>
                      </Select>
                    </div>
                    <div className="hidden items-center gap-1 rounded-[8px] border border-portal bg-portal-surface p-1 sm:flex">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <List className="size-4" aria-hidden />
                      </span>
                      <span className="inline-flex size-9 items-center justify-center rounded-lg text-portal-muted">
                        <LayoutGrid className="size-4" aria-hidden />
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {listLoading ? (
                <PageLoading
                  label={tab === "overdue" ? "Loading overdue students…" : "Loading payments…"}
                />
              ) : tab === "overdue" ? (
                filteredOverdue.length === 0 ? (
                  <EmptyState
                    title="No overdue students"
                    description="All active billings are current."
                  />
                ) : (
                  <>
                    <AdminOverdueBillingsTable rows={overduePagination.paginatedItems} />
                    <Pagination pagination={overduePagination} itemLabel="students" />
                  </>
                )
              ) : filteredPayments.length === 0 ? (
                <EmptyState
                  title={tab === "pending" ? "No pending payments" : "No payments found"}
                  description={
                    tab === "pending"
                      ? "New submissions will appear here."
                      : "Try adjusting your filters."
                  }
                />
              ) : (
                <>
                  <AdminPaymentsTable
                    payments={paymentPagination.paginatedItems}
                    busy={busy}
                    onApprove={(id) => approvePayment.mutate(id)}
                    onReject={(id) => setRejectId(id)}
                  />
                  <Pagination pagination={paymentPagination} itemLabel="payments" />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-2">
            <AdminPaymentMethodsOverview payments={allPayments} />
            <AdminRecentTransactions payments={allPayments} />
          </div>
        </>
      )}

      {rejectId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="flex w-full max-w-md flex-col gap-4 rounded-[8px] border border-portal bg-portal-surface p-6 shadow-xl">
            <h3 className="text-lg font-bold text-portal-heading">Reject payment</h3>
            <p className="text-sm text-portal-muted">
              The student will see this reason in their payment history.
            </p>
            <Input
              placeholder="Reason (optional)"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant="danger"
                className="flex-1 rounded-[8px]"
                disabled={rejectPayment.isPending}
                onClick={() => {
                  rejectPayment.mutate(
                    { id: rejectId, reason: rejectReason || undefined },
                    {
                      onSuccess: () => {
                        setRejectId(null);
                        setRejectReason("");
                      },
                    }
                  );
                }}
              >
                Reject payment
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-[8px] border border-portal"
                onClick={() => {
                  setRejectId(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </PageContainer>
  );
}
