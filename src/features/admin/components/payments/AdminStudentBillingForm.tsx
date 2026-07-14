import { useMemo } from "react";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Check,
  CircleDollarSign,
  Info,
  UserRound,
  Wallet,
} from "lucide-react";
import type { AdminUser, BillingCurrency } from "@/types/models";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  formatPaymentAmount,
  PAYMENT_CURRENCIES,
} from "@/features/admin/components/payments/adminPaymentsUtils";
import { cn } from "@/lib/utils/cn";

const CURRENCY_PREFIX: Record<BillingCurrency, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  BDT: "৳",
  CAD: "C$",
  AUD: "A$",
};

export interface IAdminStudentBillingFormProps {
  students: AdminUser[];
  studentId: string;
  monthlyFee: string;
  currency: BillingCurrency;
  dueDay: string;
  paidUntil: string;
  saving: boolean;
  onStudentIdChange: (value: string) => void;
  onMonthlyFeeChange: (value: string) => void;
  onCurrencyChange: (value: BillingCurrency) => void;
  onDueDayChange: (value: string) => void;
  onPaidUntilChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-portal-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-portal-text">{value}</p>
      </div>
    </div>
  );
}

export function AdminStudentBillingForm({
  students,
  studentId,
  monthlyFee,
  currency,
  dueDay,
  paidUntil,
  saving,
  onStudentIdChange,
  onMonthlyFeeChange,
  onCurrencyChange,
  onDueDayChange,
  onPaidUntilChange,
  onSave,
  onBack,
}: IAdminStudentBillingFormProps) {
  const selectedStudent = useMemo(
    () => students.find((student) => student.id === studentId) ?? null,
    [students, studentId]
  );

  const feeNumber = Number(monthlyFee);
  const hasValidFee = Number.isFinite(feeNumber) && feeNumber >= 0 && monthlyFee.trim() !== "";
  const canSave = Boolean(studentId) && hasValidFee && !saving;

  const totalLabel = hasValidFee
    ? formatPaymentAmount(feeNumber, currency)
    : formatPaymentAmount(0, currency);

  const paidUntilLabel = paidUntil
    ? new Date(`${paidUntil}T00:00:00`).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not set";

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Payment Management
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-2xl text-portal-muted">
            Create or update a student monthly billing plan for automatic tuition tracking.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] border border-portal bg-portal-surface px-4 text-sm font-semibold text-portal-heading shadow-sm hover:bg-portal-muted/40"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to payments
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.9fr)] xl:gap-6">
        {/* Form card */}
        <section
          className={cn(
            "flex flex-col overflow-hidden rounded-[8px] border border-portal bg-portal-surface",
            "shadow-[var(--portal-card-shadow)]"
          )}
        >
          <div className="border-b border-portal px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-primary/12 text-primary">
                <Banknote className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-portal-heading sm:text-lg">
                  Create / Edit Student Billing Plan
                </h2>
                <p className="mt-1 text-sm text-portal-muted">
                  Set the monthly fee, currency, due day, and prepaid coverage for a student.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-6">
            <div className="sm:col-span-2">
              <Select
                value={studentId}
                onChange={(event) => onStudentIdChange(event.target.value)}
                label="Student"
              >
                <option value="">Select student…</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </Select>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="form-label">Monthly fee</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-portal-muted">
                  {CURRENCY_PREFIX[currency]}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={monthlyFee}
                  onChange={(event) => onMonthlyFeeChange(event.target.value)}
                  placeholder="0.00"
                  className="form-control pl-9"
                />
              </div>
            </label>

            <Select
              value={currency}
              onChange={(event) =>
                onCurrencyChange(event.target.value as BillingCurrency)
              }
              label="Currency"
            >
              {PAYMENT_CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </Select>

            <Input
              type="number"
              min={1}
              max={28}
              label="Due day of month"
              hint="Day 1–28 each billing month"
              value={dueDay}
              onChange={(event) => onDueDayChange(event.target.value)}
              placeholder="1"
            />

            <Input
              type="date"
              label="Paid until"
              hint="Leave empty if not prepaid"
              value={paidUntil}
              onChange={(event) => onPaidUntilChange(event.target.value)}
            />
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-portal bg-portal-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-2.5 rounded-[8px] bg-primary/10 px-3 py-2.5 text-sm text-primary-dark sm:max-w-[65%]">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p>
                Students will be billed automatically based on this monthly plan.
              </p>
            </div>
            <Button
              type="button"
              disabled={!canSave}
              onClick={onSave}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-primary px-5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              <Check className="size-4" aria-hidden />
              {saving ? "Saving…" : "Save Billing Plan"}
            </Button>
          </div>
        </section>

        {/* Summary + note */}
        <aside className="flex flex-col gap-4">
          <section
            className={cn(
              "relative overflow-hidden rounded-[8px] border border-portal bg-portal-surface p-5",
              "shadow-[var(--portal-card-shadow)]"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'url("/brand/islamic-geo-pattern.svg")',
                backgroundSize: "72px 72px",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-6 -right-4 h-36 w-40 opacity-[0.12]"
              style={{
                backgroundImage: 'url("/brand/sidebar-mosque-footer.svg")',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom right",
                backgroundSize: "contain",
              }}
              aria-hidden
            />

            <div className="relative z-[1]">
              <h3 className="text-sm font-bold uppercase tracking-wide text-portal-heading">
                Plan Summary
              </h3>
              <div className="mt-4 space-y-3.5">
                <SummaryRow
                  icon={UserRound}
                  label="Student"
                  value={
                    selectedStudent
                      ? selectedStudent.name
                      : "Select a student"
                  }
                />
                <SummaryRow
                  icon={CircleDollarSign}
                  label="Monthly fee"
                  value={totalLabel}
                />
                <SummaryRow
                  icon={Wallet}
                  label="Currency"
                  value={currency}
                />
                <SummaryRow
                  icon={CalendarDays}
                  label="Due day"
                  value={dueDay ? `Day ${dueDay} of each month` : "—"}
                />
                <SummaryRow
                  icon={CalendarDays}
                  label="Paid until"
                  value={paidUntilLabel}
                />
              </div>

              <div className="mt-5 border-t border-portal pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-portal-muted">
                  Total payable / month
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-primary">
                  {totalLabel}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-primary/15 bg-[#F4FBF8] p-4 dark:border-primary/20 dark:bg-primary/10">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div>
                <h4 className="text-sm font-bold text-primary-dark">Note</h4>
                <p className="mt-1 text-sm leading-relaxed text-portal-muted">
                  Due day drives overdue status. Use <strong>Paid until</strong> when a
                  student has prepaid — billing stays current through that date.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
