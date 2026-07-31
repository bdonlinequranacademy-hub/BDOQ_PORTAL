import { CalendarDays, Eye, MoreVertical, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import type { AdminClass } from "@/types/models";
import { classTitle, formatScheduleLine, studentCount, teacherName } from "@/lib/utils/class";
import {
  classStatusStyles,
  studentCapacityPercent,
  teacherHandle,
} from "@/features/admin/components/classes/adminClassesUtils";

interface IAdminClassesTableProps {
  classes: AdminClass[];
  togglingId?: string;
  onToggleActive: (cls: AdminClass) => void;
}

function ClassRowActions({
  cls,
  toggling,
  onToggleActive,
}: {
  cls: AdminClass;
  toggling: boolean;
  onToggleActive: (cls: AdminClass) => void;
}) {
  const { t } = usePortalTranslation();
  const inactive = cls.isActive === false;

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={`/admin/classes/${cls._id}`}
        className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
        aria-label={t("actions.viewClass")}
        title={t("actions.view")}
      >
        <Eye className="size-4" />
      </Link>
      <Link
        to={`/admin/classes/${cls._id}/edit`}
        className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
        aria-label={t("actions.editClass")}
        title={t("actions.edit")}
      >
        <Pencil className="size-4" />
      </Link>
      <button
        type="button"
        disabled={toggling}
        onClick={() => onToggleActive(cls)}
        className={cn(
          "rounded-lg p-2 transition disabled:opacity-50",
          inactive
            ? "text-emerald-600 hover:bg-emerald-50"
            : "text-red-600 hover:bg-red-50"
        )}
        aria-label={inactive ? t("actions.reactivateClass") : t("actions.deactivateClass")}
        title={inactive ? t("admin.classes.reactivate") : t("admin.classes.deactivate")}
      >
        {inactive ? (
          <RotateCcw className={cn("size-4", toggling && "animate-spin")} />
        ) : (
          <Trash2 className="size-4" />
        )}
      </button>
      <button
        type="button"
        className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50"
        aria-label={t("actions.moreActions")}
        title={t("actions.more")}
      >
        <MoreVertical className="size-4" />
      </button>
    </div>
  );
}

export function AdminClassesTable({
  classes,
  togglingId,
  onToggleActive,
}: IAdminClassesTableProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  function classActiveStatus(cls: AdminClass): string {
    return statusLabel(cls.isActive === false ? "inactive" : "active");
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("tables.class")}</th>
              <th className="px-5 py-3.5">{t("tables.teacher")}</th>
              <th className="px-5 py-3.5">{t("tables.schedule")}</th>
              <th className="px-5 py-3.5">{t("tables.students")}</th>
              <th className="px-5 py-3.5">{t("tables.status")}</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal/80">
            {classes.map((cls) => {
              const title = classTitle(cls);
              const teacher =
                typeof cls.teacher === "object" ? cls.teacher : undefined;
              const teacherLabel = teacherName(teacher);
              const handle = teacherHandle(teacher);
              const count = studentCount(cls);
              const scheduleLine = formatScheduleLine(cls.schedule);

              return (
                <tr key={cls._id} className="transition hover:bg-portal-muted/25">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarDays className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-portal-heading">{title}</p>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                              classStatusStyles(cls)
                            )}
                          >
                            {classActiveStatus(cls)}
                          </span>
                        </div>
                        {cls.description ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-portal-muted">
                            {cls.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={teacherLabel} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-portal-heading">
                          {teacherLabel}
                        </p>
                        {handle ? (
                          <p className="truncate text-xs text-portal-muted">{handle}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {scheduleLine ? (
                      <p className="text-sm text-portal-heading">{scheduleLine}</p>
                    ) : (
                      <p className="text-sm text-portal-muted">{t("admin.classes.noSchedule")}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-[120px]">
                      <p className="mb-1 text-sm font-semibold tabular-nums text-portal-heading">
                        {t("admin.classes.studentCount", { count: formatNumber(count) })}
                      </p>
                      <div className="h-1.5 overflow-hidden rounded-full bg-portal-muted/60">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${studentCapacityPercent(count)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-portal-heading">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          cls.isActive === false ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      />
                      {classActiveStatus(cls)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ClassRowActions
                      cls={cls}
                      toggling={togglingId === cls._id}
                      onToggleActive={onToggleActive}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 p-4 lg:hidden">
        {classes.map((cls) => {
          const title = classTitle(cls);
          const teacher = typeof cls.teacher === "object" ? cls.teacher : undefined;
          const count = studentCount(cls);

          return (
            <div
              key={cls._id}
              className="rounded-xl border border-portal bg-portal-muted/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-portal-heading">{title}</p>
                  <p className="text-xs text-portal-muted">
                    {teacherName(teacher)} · {t("admin.classes.studentCount", { count: formatNumber(count) })}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    classStatusStyles(cls)
                  )}
                >
                  {classActiveStatus(cls)}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <ClassRowActions
                  cls={cls}
                  toggling={togglingId === cls._id}
                  onToggleActive={onToggleActive}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
