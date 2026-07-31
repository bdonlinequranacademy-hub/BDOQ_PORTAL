import { useStudentAttendance } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { EmptyState } from "@/components/ui/EmptyState";
import { PercentageRing } from "@/components/ui/PercentageRing";
import { ClipboardList } from "lucide-react";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const STATUS_STYLES = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
};

export function StudentAttendancePage() {
  const { t, statusLabel, formatDate } = usePortalTranslation();
  const { data, isLoading } = useStudentAttendance();
  const summary = data?.summary;
  const records = data?.records ?? [];
  const pagination = usePaginatedList(records);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{t("student.myAttendanceTitle")}</h1>
        <p className="text-sm text-zinc-500">{t("student.attendanceHistoryDesc")}</p>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary-dark">{summary?.percentage ?? 0}%</p>
              <p className="text-xs text-zinc-400">{t("student.attendanceRate")}</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">{summary?.present ?? 0}</p>
              <p className="text-xs text-zinc-400">{t("student.present")}</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-red-500">{summary?.absent ?? 0}</p>
              <p className="text-xs text-zinc-400">{t("student.absent")}</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{summary?.late ?? 0}</p>
              <p className="text-xs text-zinc-400">{t("student.late")}</p>
            </Card>
          </div>

          <PercentageRing percentage={summary?.percentage ?? 0} label={t("student.attendance")} />

          <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
            {records.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={ClipboardList}
                  title={t("student.noAttendanceRecords")}
                  description={t("student.noAttendanceRecordsDesc")}
                />
              </div>
            ) : (
              <>
                <div className="divide-y divide-zinc-100">
                  {pagination.paginatedItems.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div>
                        <p className="font-medium text-primary-dark">
                          {r.class?.title ?? t("student.classFallback")}
                        </p>
                        <p className="text-xs text-zinc-400">{formatDate(r.date)}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          STATUS_STYLES[r.status]
                        }`}
                      >
                        {statusLabel(r.status)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-100 p-3">
                  <Pagination pagination={pagination} itemLabel="records" />
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  );
}
