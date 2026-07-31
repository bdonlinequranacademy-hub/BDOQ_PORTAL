import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote } from "lucide-react";
import {
  useAdminClassLogs,
  useAdminEarnings,
  useApproveClassLog,
  useRejectClassLog,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { AdminClassLogsDetailModal } from "@/features/admin/components/class-logs/AdminClassLogsDetailModal";
import { AdminEarningsOverviewHeader } from "@/features/admin/components/earnings/AdminEarningsOverviewHeader";
import { AdminEarningsStatsGrid } from "@/features/admin/components/earnings/AdminEarningsStatsGrid";
import { AdminEarningsPendingAlert } from "@/features/admin/components/earnings/AdminEarningsPendingAlert";
import { AdminEarningsByTeacherTable } from "@/features/admin/components/earnings/AdminEarningsByTeacherTable";
import { AdminEarningsProgramDonut } from "@/features/admin/components/earnings/AdminEarningsProgramDonut";
import { AdminEarningsTrendChart } from "@/features/admin/components/earnings/AdminEarningsTrendChart";
import { AdminEarningsQuickActions } from "@/features/admin/components/earnings/AdminEarningsQuickActions";
import { AdminEarningsPendingTable } from "@/features/admin/components/earnings/AdminEarningsPendingTable";
import { AdminEarningsSidebar } from "@/features/admin/components/earnings/AdminEarningsSidebar";
import {
  buildEarningsTrend,
  computeEarningsStats,
  exportEarningsTeachersFile,
  getPendingApprovalLogs,
  getRecentVerifiedLogs,
  getUpcomingPendingLogs,
  groupEarningsByProgram,
  previousMonthValue,
  type EarningsTrendRange,
} from "@/features/admin/components/earnings/adminEarningsUtils";
import { currentMonthValue } from "@/lib/utils/month";
import type { ClassLogView } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminEarningsPage() {
  const { t } = usePortalTranslation();
  const navigate = useNavigate();
  const [month, setMonth] = useState(currentMonthValue());
  const [trendRange, setTrendRange] = useState<EarningsTrendRange>("year");
  const [selectedLog, setSelectedLog] = useState<ClassLogView | null>(null);

  const { data, isLoading, isFetching, refetch } = useAdminEarnings(month);
  const { data: previousData } = useAdminEarnings(previousMonthValue(month));
  const { data: allLogs = [], isLoading: logsLoading } = useAdminClassLogs();
  const { data: pendingLogs = [] } = useAdminClassLogs("pending");
  const approve = useApproveClassLog();
  const reject = useRejectClassLog();

  const stats = useMemo(
    () => computeEarningsStats(data, previousData),
    [data, previousData]
  );
  const programSegments = useMemo(
    () => groupEarningsByProgram(allLogs, month),
    [allLogs, month]
  );
  const trendData = useMemo(
    () => buildEarningsTrend(allLogs, trendRange),
    [allLogs, trendRange]
  );
  const pendingApprovalLogs = useMemo(
    () => getPendingApprovalLogs(pendingLogs.length > 0 ? pendingLogs : allLogs),
    [pendingLogs, allLogs]
  );
  const upcomingLogs = useMemo(
    () => getUpcomingPendingLogs(pendingApprovalLogs),
    [pendingApprovalLogs]
  );
  const recentLogs = useMemo(() => getRecentVerifiedLogs(allLogs), [allLogs]);

  const busy = approve.isPending || reject.isPending;
  const loading = isLoading || logsLoading;

  function handleApprove(log: ClassLogView) {
    approve.mutate(log._id, {
      onSuccess: () => {
        if (selectedLog?._id === log._id) setSelectedLog(null);
      },
    });
  }

  function handleReject(log: ClassLogView) {
    reject.mutate(
      { id: log._id },
      {
        onSuccess: () => {
          if (selectedLog?._id === log._id) setSelectedLog(null);
        },
      }
    );
  }

  function handleExport() {
    exportEarningsTeachersFile(data, month, t);
  }

  function handleReviewPending() {
    navigate("/admin/class-logs");
  }

  return (
    <PageContainer>
      <AdminEarningsOverviewHeader
        month={month}
        onMonthChange={setMonth}
        onExport={handleExport}
      />

      <AdminEarningsStatsGrid stats={stats} isLoading={loading} />

      <AdminEarningsPendingAlert
        pendingCount={pendingApprovalLogs.length}
        onReview={handleReviewPending}
      />

      {loading ? (
        <PageLoading label={t("admin.common.loadingEarnings")} />
      ) : !data && pendingApprovalLogs.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title={t("admin.common.noEarnings")}
          description={t("admin.common.noEarningsDesc")}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AdminEarningsByTeacherTable
                data={data}
                onViewAll={() => navigate("/admin/class-logs")}
              />
              <AdminEarningsProgramDonut
                segments={programSegments}
                totalBdt={stats.verifiedBdt}
              />
            </div>

            <AdminEarningsPendingTable
              logs={pendingApprovalLogs}
              busy={busy}
              onView={setSelectedLog}
              onApprove={handleApprove}
              onViewAll={handleReviewPending}
            />
          </div>

          <div className="flex flex-col gap-4">
            <AdminEarningsTrendChart
              data={trendData}
              range={trendRange}
              onRangeChange={setTrendRange}
            />
            <AdminEarningsQuickActions
              pendingCount={pendingApprovalLogs.length}
              isFetching={isFetching || logsLoading}
              onExport={handleExport}
              onRefresh={() => void refetch()}
              onReviewPending={handleReviewPending}
            />
            <AdminEarningsSidebar upcomingLogs={upcomingLogs} recentLogs={recentLogs} />
          </div>
        </div>
      )}

      <AdminClassLogsDetailModal
        log={selectedLog}
        busy={busy}
        onClose={() => setSelectedLog(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </PageContainer>
  );
}
