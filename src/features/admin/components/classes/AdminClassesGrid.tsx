import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ClassScheduleChip } from "@/components/classes/ClassScheduleChip";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import type { AdminClass } from "@/types/models";
import { classTitle, studentCount, teacherName } from "@/lib/utils/class";
import { classStatusStyles } from "@/features/admin/components/classes/adminClassesUtils";

interface IAdminClassesGridProps {
  classes: AdminClass[];
  togglingId?: string;
  onToggleActive: (cls: AdminClass) => void;
}

export function AdminClassesGrid({
  classes,
  togglingId,
  onToggleActive,
}: IAdminClassesGridProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  function classActiveStatus(cls: AdminClass): string {
    return statusLabel(cls.isActive === false ? "inactive" : "active");
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {classes.map((cls) => {
        const title = classTitle(cls);
        const teacher =
          typeof cls.teacher === "object" ? cls.teacher : undefined;
        const teacherLabel = teacherName(teacher);
        const count = studentCount(cls);
        const inactive = cls.isActive === false;
        const toggling = togglingId === cls._id;

        return (
          <article
            key={cls._id}
            className="flex flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] transition hover:border-primary/25"
          >
            <Link
              to={`/admin/classes/${cls._id}`}
              className="flex flex-1 flex-col gap-3 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-portal-heading">{title}</h3>
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
                    <p className="mt-1 line-clamp-2 text-xs text-portal-muted">
                      {cls.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <UserInitialAvatar name={teacherLabel} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {teacherLabel}
                  </p>
                  <p className="text-xs text-portal-muted">
                    {t("admin.classes.studentCount", { count: formatNumber(count) })}
                  </p>
                </div>
              </div>

              <ClassScheduleChip schedule={cls.schedule} />
            </Link>

            <div className="flex items-center justify-end gap-1 border-t border-portal px-4 py-3">
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
            </div>
          </article>
        );
      })}
    </div>
  );
}
