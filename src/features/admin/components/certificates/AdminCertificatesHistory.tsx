import { Link } from "react-router-dom";
import {
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { formatCertificateDate } from "@/lib/certificateFormat";
import type { CertificateView } from "@/types/models";
import type { IPaginatedListResult } from "@/lib/hooks/usePaginatedList";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminCertificatesHistoryProps {
  items: CertificateView[];
  totalAll: number;
  nameQuery: string;
  issueDateFilter: string;
  pagination: IPaginatedListResult<CertificateView>;
  onNameQueryChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onClearFilters: () => void;
  onShare: (certificate: CertificateView) => void;
}

export function AdminCertificatesHistory({
  items,
  totalAll,
  nameQuery,
  issueDateFilter,
  pagination,
  onNameQueryChange,
  onIssueDateChange,
  onClearFilters,
  onShare,
}: IAdminCertificatesHistoryProps) {
  const { t } = usePortalTranslation();

  const hasFilters = Boolean(nameQuery.trim() || issueDateFilter);

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary-dark">
              Certificate History
            </h2>
            <p className="mt-1 text-xs text-portal-muted">
              {hasFilters
                ? `Showing ${pagination.totalItems} of ${totalAll}`
                : `${totalAll} certificate${totalAll === 1 ? "" : "s"} issued`}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-2xl">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted" />
              <input
                className={cn(formControlClass, "h-10 py-2 pl-9")}
                placeholder="Search student, course, or ID…"
                value={nameQuery}
                onChange={(e) => onNameQueryChange(e.target.value)}
              />
            </div>
            <input
              type="date"
              className={cn(formControlClass, "h-10 py-2 sm:w-44")}
              value={issueDateFilter}
              onChange={(e) => onIssueDateChange(e.target.value)}
              aria-label="Filter by issue date"
            />
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition",
                hasFilters
                  ? "border-primary/40 bg-primary/10 text-primary-dark"
                  : "border-portal text-portal-muted"
              )}
            >
              <Filter className="size-4" aria-hidden />
              Filters
            </button>
          </div>
        </div>
      </div>

      {totalAll === 0 ? (
        <p className="p-8 text-center text-sm text-portal-muted">
          No certificates generated yet. Create your first certificate above.
        </p>
      ) : items.length === 0 ? (
        <p className="p-8 text-center text-sm text-portal-muted">
          No certificates match your search. Try another name or date.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
                  <th className="px-5 py-3.5">{t("shared.schedule.student")}</th>
                  <th className="px-5 py-3.5">Course / Achievement</th>
                  <th className="px-5 py-3.5">Certificate ID</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">{t("tables.status")}</th>
                  <th className="px-5 py-3.5">Template</th>
                  <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-portal/80">
                {items.map((certificate) => (
                  <tr
                    key={certificate.id}
                    className="transition hover:bg-portal-muted/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={certificate.studentName}
                          size="sm"
                          shape="circle"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-portal-heading">
                            {certificate.studentName}
                          </p>
                          <p className="truncate text-xs text-portal-muted">
                            {certificate.studentPortalId || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="line-clamp-2 text-sm text-portal-heading">
                        {certificate.courseName}
                      </p>
                      <p className="mt-0.5 text-xs text-portal-muted">
                        {certificate.grade}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-portal-muted/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-portal-heading">
                        {certificate.certificateId}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-portal-heading">
                      {formatCertificateDate(certificate.issueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary-dark">{t("admin.certificates.statsIssued")}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-portal-muted">
                      Official BDOQ
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/certificates/${certificate.id}`}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
                          aria-label={`View ${certificate.certificateId}`}
                          title="View & download"
                        >
                          <Eye className="size-4" aria-hidden />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onShare(certificate)}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
                          aria-label="Copy verification link"
                          title="Share verify link"
                        >
                          <Share2 className="size-4" aria-hidden />
                        </button>
                        <Link
                          to={`/admin/certificates/${certificate.id}`}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-portal-heading"
                          aria-label="More"
                        >
                          <MoreHorizontal className="size-4" aria-hidden />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-portal lg:hidden">
            {items.map((certificate) => (
              <li key={certificate.id} className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={certificate.studentName}
                    size="sm"
                    shape="circle"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-portal-heading">
                      {certificate.studentName}
                    </p>
                    <p className="text-sm text-portal-muted">
                      {certificate.courseName}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-portal-muted">
                      {certificate.certificateId}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary-dark">{t("admin.certificates.statsIssued")}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-xl border border-portal text-xs"
                    onClick={() => onShare(certificate)}
                  >
                    Share
                  </Button>
                  <Link
                    to={`/admin/certificates/${certificate.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary-dark"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-portal px-4 py-3">
            <Pagination pagination={pagination} itemLabel="certificates" />
          </div>
        </>
      )}
    </Card>
  );
}
