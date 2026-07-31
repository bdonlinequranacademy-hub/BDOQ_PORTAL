import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { ProgressStatusBadge } from "@/features/admin/components/progress/ProgressStatusBadge";
import type { IProgressRowView } from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressDetailModalProps {
  record: IProgressRowView | null;
  onClose: () => void;
}

export function AdminProgressDetailModal({ record, onClose }: IAdminProgressDetailModalProps) {
  const { t, formatDate, formatNumber } = usePortalTranslation();

  if (!record) return null;

  const programLabel = record.curriculumLabels?.program
    ? formatCurriculumPath(record.curriculumLabels)
    : t("admin.payments.notSet");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-detail-title"
      onClick={onClose}
    >
      <Card
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-portal bg-portal-surface p-0 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-portal px-5 py-4">
          <div className="flex items-center gap-3">
            <UserInitialAvatar name={record.student?.name ?? "?"} size="md" />
            <div>
              <h2 id="progress-detail-title" className="text-lg font-bold text-portal-heading">
                {record.student?.name ?? t("tables.student")}
              </h2>
              <p className="text-sm text-portal-muted">{record.class?.title ?? "—"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:text-primary"
            aria-label={t("actions.close")}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <ProgressStatusBadge status={record.status} />
            <span className="text-xs text-portal-muted">
              {record.updatedAt
                ? t("admin.progress.updated", { date: formatDate(record.updatedAt) })
                : "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-portal bg-portal-muted/15 p-3">
              <p className="text-xs text-portal-muted">{t("tables.tajweed")}</p>
              <p className="text-xl font-bold text-primary">
                {formatNumber(record.tajweedScore ?? 0)}%
              </p>
            </div>
            <div className="rounded-xl border border-portal bg-portal-muted/15 p-3">
              <p className="text-xs text-portal-muted">{t("tables.memorization")}</p>
              <p className="text-xl font-bold text-amber-600">
                {formatNumber(record.memorizationPct)}%
              </p>
            </div>
            <div className="rounded-xl border border-portal bg-portal-muted/15 p-3">
              <p className="text-xs text-portal-muted">{t("admin.progress.surahsCompleted")}</p>
              <p className="text-xl font-bold text-portal-heading">
                {formatNumber(record.surahCount)}
              </p>
            </div>
            <div className="rounded-xl border border-portal bg-portal-muted/15 p-3">
              <p className="text-xs text-portal-muted">{t("admin.progress.ayahsMemorized")}</p>
              <p className="text-xl font-bold text-portal-heading">
                {formatNumber(record.memorizedAyahs ?? 0)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
              {t("tables.program")}
            </p>
            <p className="mt-1 text-sm text-portal-heading">
              {record.curriculumLabels?.program ? (
                formatCurriculumPath(record.curriculumLabels)
              ) : (
                <MissingCurriculumBadge />
              )}
            </p>
          </div>

          {record.surahsMemorized && record.surahsMemorized.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
                {t("admin.progress.surahsMemorized")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {record.surahsMemorized.map((surah) => (
                  <span
                    key={surah}
                    className="rounded-full border border-portal bg-portal-muted/20 px-2.5 py-1 text-xs font-medium text-portal-heading"
                  >
                    {surah}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {record.notes ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
                {t("admin.progress.teacherNotes")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-portal-heading">{record.notes}</p>
            </div>
          ) : null}

          {record.updatedBy?.name ? (
            <p className="text-xs text-portal-muted">
              {t("admin.progress.lastUpdatedBy", {
                name: record.updatedBy.name,
                program: programLabel,
              })}
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
