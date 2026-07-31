import {
  CalendarDays,
  ClipboardList,
  ExternalLink,
  Pencil,
  RotateCcw,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AdminClass, PopulatedUserRef } from "@/types/models";
import { teacherName } from "@/lib/utils/class";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import { teacherHandle } from "@/features/admin/components/classes/adminClassesUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminClassDetailSidebarProps {
  cls: AdminClass;
  classId: string;
  enrolled: PopulatedUserRef[];
  onDeactivate: () => void;
  onViewStudents: () => void;
  deactivating?: boolean;
}

export function AdminClassDetailSidebar({
  cls,
  classId,
  enrolled,
  onDeactivate,
  onViewStudents,
  deactivating,
}: IAdminClassDetailSidebarProps) {
  const { t, statusLabel } = usePortalTranslation();
  const teacher = typeof cls.teacher === "object" ? cls.teacher : undefined;
  const teacherLabel = teacherName(teacher);
  const handle = teacherHandle(teacher);
  const meetingLink = normalizeMeetingLink(cls.meetingLink);
  const inactive = cls.isActive === false;

  const actions = [
    meetingLink
      ? {
          id: "meeting",
          label: t("admin.classDetail.openMeetingLinkAction"),
          icon: Video,
          href: meetingLink,
          external: true,
          danger: false,
        }
      : null,
    {
      id: "edit",
      label: t("admin.classDetail.editClassDetails"),
      icon: Pencil,
      href: `/admin/classes/${classId}/edit`,
      external: false,
      danger: false,
    },
    {
      id: "schedule",
      label: t("admin.classDetail.manageSchedule"),
      icon: CalendarDays,
      href: `/admin/classes/${classId}/edit`,
      external: false,
      danger: false,
    },
    {
      id: "logs",
      label: t("admin.classes.classReports"),
      icon: ClipboardList,
      href: "/admin/class-logs",
      external: false,
      danger: false,
    },
  ].filter(Boolean) as {
    id: string;
    label: string;
    icon: typeof Video;
    href: string;
    external: boolean;
    danger: boolean;
  }[];

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.classDetail.quickActions")}</h2>
        <div className="flex flex-col gap-2">
          {actions.map((action) => {
            const className =
              "inline-flex items-center gap-2 rounded-xl border border-portal px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5";
            const content = (
              <>
                <action.icon className="size-4 text-primary" aria-hidden />
                {action.label}
                {action.external ? <ExternalLink className="ml-auto size-3.5 opacity-60" /> : null}
              </>
            );

            return action.external ? (
              <a
                key={action.id}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={action.id} to={action.href} className={className}>
                {content}
              </Link>
            );
          })}
          <button
            type="button"
            disabled={deactivating}
            onClick={onDeactivate}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50",
              inactive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            )}
          >
            {inactive ? (
              <RotateCcw className={cn("size-4", deactivating && "animate-spin")} aria-hidden />
            ) : (
              <Trash2 className="size-4" aria-hidden />
            )}
            {inactive ? t("admin.classDetail.reactivateClass") : t("admin.classDetail.deactivateClass")}
          </button>
        </div>
      </Card>

      {teacher ? (
        <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
          <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.classDetail.teacher")}</h2>
          <div className="flex items-center gap-3">
            <UserInitialAvatar name={teacherLabel} size="md" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-portal-heading">{teacherLabel}</p>
              {handle ? <p className="truncate text-xs text-portal-muted">{handle}</p> : null}
              {teacher.email ? (
                <p className="mt-1 truncate text-xs text-portal-muted">{teacher.email}</p>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.studentRoster")}</h2>
          <button
            type="button"
            onClick={onViewStudents}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t("actions.viewAll")}
          </button>
        </div>
        {enrolled.length === 0 ? (
          <p className="text-sm text-portal-muted">{t("admin.classDetail.noStudentsEnrolled")}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {enrolled.slice(0, 5).map((student) => (
              <div key={student._id} className="flex items-center gap-3">
                <UserInitialAvatar name={student.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {student.name}
                  </p>
                  <p className="truncate text-xs text-portal-muted">{student.email}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                  {statusLabel("active")}
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onViewStudents}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Users className="size-4" aria-hidden />
          {t("admin.classDetail.manageStudents")}
        </button>
      </Card>
    </div>
  );
}
