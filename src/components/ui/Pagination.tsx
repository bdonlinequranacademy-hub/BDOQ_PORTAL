import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import {
  PAGE_SIZE_OPTIONS,
  type IPaginatedListResult,
  type PageSizeOption,
} from "@/lib/hooks/usePaginatedList";

interface IPaginationProps<T> {
  pagination: IPaginatedListResult<T>;
  className?: string;
  /** Translation key suffix under pagination.items.* or raw label */
  itemLabel?: string;
}

function pageNumbers(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);

  return [...pages].sort((a, b) => a - b);
}

export function Pagination<T>({
  pagination,
  className,
  itemLabel = "items",
}: IPaginationProps<T>) {
  const { t } = usePortalTranslation();
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
  } = pagination;

  if (totalItems === 0) {
    return null;
  }

  const pages = pageNumbers(page, totalPages);
  const label =
    t(`pagination.${itemLabel}`) !== `pagination.${itemLabel}`
      ? t(`pagination.${itemLabel}`)
      : itemLabel;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-portal bg-portal-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:gap-3 sm:py-3",
        className
      )}
      role="navigation"
      aria-label={t("pagination.navLabel")}
    >
      <p className="text-sm text-portal-muted">
        {t("pagination.showing")}{" "}
        <span className="font-medium text-portal-heading">
          {rangeStart}–{rangeEnd}
        </span>{" "}
        {t("pagination.of")}{" "}
        <span className="font-medium text-portal-heading">{totalItems}</span> {label}
      </p>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <label className="flex items-center gap-2 text-sm text-portal-muted">
          <span className="sr-only">{t("pagination.rowsPerPage")}</span>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value) as PageSizeOption)}
            className="min-h-11 rounded-lg border border-portal bg-portal-surface px-3 text-base text-portal-heading outline-none focus-visible:ring-2 focus-visible:ring-primary/25 sm:min-h-9 sm:px-2.5 sm:text-sm"
            aria-label={t("pagination.rowsPerPage")}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {t("pagination.perPage", { size: String(size) })}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-portal text-portal-heading transition hover:bg-portal-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-9 sm:min-w-9"
            aria-label={t("pagination.prevPage")}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          {pages.map((pageNumber, index) => {
            const prev = pages[index - 1];
            const showEllipsis = prev != null && pageNumber - prev > 1;

            return (
              <span key={pageNumber} className="flex items-center gap-1">
                {showEllipsis ? (
                  <span className="px-1 text-sm text-portal-muted" aria-hidden>
                    …
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === page ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border text-base font-medium transition active:scale-95 sm:min-h-9 sm:min-w-9 sm:text-sm",
                    pageNumber === page
                      ? "border-primary bg-primary text-white"
                      : "border-portal text-portal-heading hover:bg-portal-muted"
                  )}
                >
                  {pageNumber}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-portal text-portal-heading transition hover:bg-portal-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-9 sm:min-w-9"
            aria-label={t("pagination.nextPage")}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
