import { X } from "lucide-react";
import type { ClassLogView } from "@/types/models";
import { ClassLogCard } from "@/components/schedule/ClassLogCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface IAdminClassLogsDetailModalProps {
  log: ClassLogView | null;
  busy: boolean;
  onClose: () => void;
  onApprove: (log: ClassLogView) => void;
  onReject: (log: ClassLogView) => void;
}

export function AdminClassLogsDetailModal({
  log,
  busy,
  onClose,
  onApprove,
  onReject,
}: IAdminClassLogsDetailModalProps) {
  const { t } = usePortalTranslation();

  if (!log) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0A1628]/55 backdrop-blur-[2px]"
        aria-label={t("admin.classLogs.closeLogDetails")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="class-log-detail-title"
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden",
          "rounded-t-3xl border border-portal bg-portal-surface shadow-2xl sm:rounded-2xl"
        )}
      >
        <div className="flex items-center justify-between border-b border-portal px-5 py-4">
          <h2 id="class-log-detail-title" className="text-lg font-bold text-portal-heading">
            {t("admin.classLogs.sessionLogDetails")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full border border-portal text-portal-muted transition hover:text-primary"
            aria-label={t("actions.close")}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <ClassLogCard
            log={log}
            showTeacher
            onApprove={
              log.status === "pending" || log.status === "rejected" ? onApprove : undefined
            }
            onReject={log.status === "pending" ? onReject : undefined}
            approveLabel={
              log.status === "rejected" ? t("admin.classLogs.approveAgain") : undefined
            }
            actionPending={busy}
          />
        </div>
      </div>
    </div>
  );
}
