import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminAttendance,
  useAdminClass,
  useAdminClassLogs,
  useAdminUsers,
  useAssignStudent,
  useRemoveStudent,
  useSetClassActive,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { ClassEnrollmentPanel } from "@/components/classes/ClassEnrollmentPanel";
import { classTitle, studentList } from "@/lib/utils/class";
import { PageLoading } from "@/components/ui/PageLoading";
import { AdminClassDetailHero } from "@/features/admin/components/class-detail/AdminClassDetailHero";
import { AdminClassDetailStats } from "@/features/admin/components/class-detail/AdminClassDetailStats";
import {
  AdminClassDetailOverviewTab,
  AdminClassDetailScheduleTab,
} from "@/features/admin/components/class-detail/AdminClassDetailTabPanels";
import {
  AdminClassDetailActivityTab,
  AdminClassDetailAttendanceTab,
} from "@/features/admin/components/class-detail/AdminClassDetailAttendanceActivity";
import { AdminClassDetailSidebar } from "@/features/admin/components/class-detail/AdminClassDetailSidebar";
import type { AdminClassDetailTab } from "@/features/admin/components/class-detail/adminClassDetailUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function useDetailTabs() {
  const { t } = usePortalTranslation();
  return useMemo(
    (): { id: AdminClassDetailTab; label: string }[] => [
      { id: "overview", label: t("admin.classDetail.tabOverview") },
      { id: "schedule", label: t("admin.classDetail.tabSchedule") },
      { id: "students", label: t("admin.classDetail.tabStudents") },
      { id: "attendance", label: t("admin.classDetail.tabAttendance") },
      { id: "activity", label: t("admin.classDetail.tabActivity") },
    ],
    [t]
  );
}

export function AdminClassDetailPage() {
  const { t } = usePortalTranslation();
  const detailTabs = useDetailTabs();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminClassDetailTab>("overview");

  const { data: cls, isLoading } = useAdminClass(id);
  const { data: attendance = [] } = useAdminAttendance(id);
  const { data: allLogs = [] } = useAdminClassLogs();
  const { data: allStudents = [] } = useAdminUsers("student");
  const assignStudent = useAssignStudent(id);
  const removeStudent = useRemoveStudent(id);
  const setClassActive = useSetClassActive();

  const classLogs = useMemo(
    () => allLogs.filter((log) => log.classId === id),
    [allLogs, id]
  );

  const enrolled = cls ? studentList(cls.students) : [];
  const enrolledIds = new Set(enrolled.map((student) => String(student._id)));
  const available = allStudents.filter((student) => !enrolledIds.has(String(student.id)));

  async function handleAssign(studentId: string) {
    await assignStudent.mutateAsync(studentId);
  }

  function handleRemove(studentId: string, name: string) {
    if (!window.confirm(t("admin.classDetail.confirmRemoveStudent", { name }))) return;
    removeStudent.mutate(studentId);
  }

  function handleDeactivate() {
    if (!cls) return;
    const title = classTitle(cls);
    const inactive = cls.isActive === false;

    if (inactive) {
      if (!window.confirm(t("admin.classDetail.confirmReactivate", { title }))) return;
      setClassActive.mutate({ id: cls._id, isActive: true });
      return;
    }

    if (!window.confirm(t("admin.classDetail.confirmDeactivate", { title }))) {
      return;
    }
    setClassActive.mutate({ id: cls._id, isActive: false });
  }

  return (
    <PageContainer>
      {isLoading ? (
        <PageLoading label={t("admin.common.loadingClassDetails")} />
      ) : !cls ? (
        <p className="text-sm text-portal-muted">{t("admin.classDetail.notFound")}</p>
      ) : (
        <>
          <AdminClassDetailHero
            cls={cls}
            classId={id}
            onBack={() => navigate("/admin/classes")}
          />

          <AdminClassDetailStats cls={cls} sessionLogCount={classLogs.length} />

          <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-wrap gap-2 border-b border-portal pb-1">
                {detailTabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "rounded-t-[8px] px-4 py-2 text-sm font-semibold transition",
                      tab === item.id
                        ? "border-b-2 border-primary text-primary"
                        : "text-portal-muted hover:text-portal-heading"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {tab === "overview" ? (
                <AdminClassDetailOverviewTab cls={cls} onOpenSchedule={() => setTab("schedule")} />
              ) : null}

              {tab === "schedule" ? <AdminClassDetailScheduleTab cls={cls} /> : null}

              {tab === "students" ? (
                <ClassEnrollmentPanel
                  enrolled={enrolled}
                  available={available}
                  allStudents={allStudents}
                  onAdd={handleAssign}
                  onRemove={handleRemove}
                  adding={assignStudent.isPending}
                />
              ) : null}

              {tab === "attendance" ? (
                <AdminClassDetailAttendanceTab overview={attendance} />
              ) : null}

              {tab === "activity" ? <AdminClassDetailActivityTab logs={classLogs} /> : null}
            </div>

            <AdminClassDetailSidebar
              cls={cls}
              classId={id}
              enrolled={enrolled}
              onDeactivate={handleDeactivate}
              onViewStudents={() => setTab("students")}
              deactivating={setClassActive.isPending}
            />
          </div>
        </>
      )}
    </PageContainer>
  );
}
