import { ArrowLeft, BookOpen, Pencil, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { ClassScheduleChip } from "@/components/classes/ClassScheduleChip";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AdminClass } from "@/types/models";
import { classTitle, teacherName } from "@/lib/utils/class";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import { cn } from "@/lib/utils/cn";

interface IAdminClassDetailHeroProps {
  cls: AdminClass;
  classId: string;
  onBack: () => void;
}

export function AdminClassDetailHero({ cls, classId, onBack }: IAdminClassDetailHeroProps) {
  const { t, statusLabel } = usePortalTranslation();
  const meetingLink = normalizeMeetingLink(cls.meetingLink);
  const teacher = typeof cls.teacher === "object" ? cls.teacher : undefined;
  const isActive = cls.isActive !== false;

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-dark via-primary to-teal shadow-[0_12px_32px_-16px_rgba(13,74,47,0.45)]">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("admin.classDetail.backToClasses")}
          </button>
          <Link
            to={`/admin/classes/${classId}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-white/90"
          >
            <Pencil className="size-4" aria-hidden />
            {t("admin.classDetail.editClass")}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
              <BookOpen className="size-5 text-white" aria-hidden />
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-amber-400/90 text-amber-950"
              )}
            >
              {statusLabel(isActive ? "active" : "inactive")}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">{classTitle(cls)}</h1>

          {cls.description ? (
            <p className="max-w-3xl text-sm leading-relaxed text-white/80">{cls.description}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
            {teacher ? (
              <span>
                <span className="text-white/60">{t("admin.classDetail.teacherPrefix")}</span>
                {teacherName(teacher)}
              </span>
            ) : null}
            <ClassScheduleChip schedule={cls.schedule} variant="onDark" />
          </div>

          {meetingLink ? (
            <a
              href={meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <Video className="size-4" aria-hidden />
              {t("admin.classDetail.openMeetingLink")}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
