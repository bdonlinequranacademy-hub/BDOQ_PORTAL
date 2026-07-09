import { FileSpreadsheet, FileText, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formControlClass } from "@/lib/formControl";
import { PAYMENT_METHOD_LABELS } from "@/features/admin/components/payments/adminPaymentsUtils";

interface IAdminPaymentsFilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  methodFilter: string;
  onMethodFilterChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  amountMin: string;
  amountMax: string;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
}

export function AdminPaymentsFilterPanel({
  search,
  onSearchChange,
  methodFilter,
  onMethodFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  amountMin,
  amountMax,
  onAmountMinChange,
  onAmountMaxChange,
  onClearFilters,
  onExportCsv,
  onExportExcel,
}: IAdminPaymentsFilterPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-portal-heading">Filter Payments</h2>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-portal-muted">Search</span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
                aria-hidden
              />
              <input
                className={`${formControlClass} py-2.5 pl-9 text-sm`}
                placeholder="Student, email, reference…"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </label>

          <Select
            label="Payment method"
            value={methodFilter}
            onChange={(event) => onMethodFilterChange(event.target.value)}
            className="py-2.5 text-sm"
          >
            <option value="all">All methods</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">Date from</span>
              <input
                type="date"
                className={`${formControlClass} py-2.5 text-sm`}
                value={dateFrom}
                onChange={(event) => onDateFromChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">Date to</span>
              <input
                type="date"
                className={`${formControlClass} py-2.5 text-sm`}
                value={dateTo}
                onChange={(event) => onDateToChange(event.target.value)}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">Min amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`${formControlClass} py-2.5 text-sm`}
                placeholder="0"
                value={amountMin}
                onChange={(event) => onAmountMinChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">Max amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`${formControlClass} py-2.5 text-sm`}
                placeholder="Any"
                value={amountMax}
                onChange={(event) => onAmountMaxChange(event.target.value)}
              />
            </label>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
        <h2 className="mb-3 text-sm font-bold text-portal-heading">Export Payments</h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FileText className="size-4 text-primary" aria-hidden />
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FileSpreadsheet className="size-4 text-primary" aria-hidden />
            Export Excel
          </button>
        </div>
      </Card>
    </div>
  );
}
