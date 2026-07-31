import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, ClipboardList, Lightbulb } from "lucide-react";
import { useStudentClass } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClassHero } from "@/components/classes/ClassHero";
import { classTitle, formatDuration, teacherName } from "@/lib/utils/class";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentClassDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const { data: cls, isLoading } = useStudentClass(id);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/student/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label={t("student.backToClasses")}
        >
          <ArrowLeft className="size-5 text-navy" />
        </button>
        <h1 className="text-xl font-bold text-navy">{t("student.classDetails")}</h1>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !cls ? (
        <p className="text-sm text-zinc-400">{t("student.classNotFound")}</p>
      ) : (
        <>
          <ClassHero
            title={classTitle(cls)}
            description={cls.description}
            teacherName={teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
            schedule={cls.schedule}
            meetingLink={cls.meetingLink}
            meta={
              cls.schedule?.duration ? (
                <p className="text-sm text-white/75">
                  {t("student.sessionLength", {
                    duration: formatDuration(cls.schedule.duration),
                  })}
                </p>
              ) : undefined
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              onClick={() => navigate("/student/homework")}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy py-2.5 text-sm text-white"
            >
              <BookOpenCheck className="size-4" />
              {t("student.viewHomework")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/student/attendance")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gold py-2.5 text-sm text-gold-dark"
            >
              <ClipboardList className="size-4" />
              {t("student.myAttendance")}
            </Button>
          </div>

          <Card className="flex gap-3 rounded-2xl border-0 p-5 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
              <Lightbulb className="size-5 text-gold-dark" />
            </div>
            <div>
              <p className="font-semibold text-navy">{t("student.beforeEachSession")}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {t("student.beforeEachSessionDesc")}
              </p>
            </div>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
