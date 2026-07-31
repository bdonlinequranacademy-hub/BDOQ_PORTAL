import { useNavigate } from "react-router-dom";
import { BookOpen, ClipboardList } from "lucide-react";
import { useStudentClasses } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClassCard } from "@/components/classes/ClassCard";
import { TodayClassesBanner } from "@/components/classes/TodayClassesBanner";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { classTitle, classesScheduledToday, teacherName } from "@/lib/utils/class";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentClassesPage() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const { data: classes = [], isLoading } = useStudentClasses();
  const todayClasses = classesScheduledToday(classes);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t("student.myClasses")}</h1>
        <p className="text-sm text-zinc-500">
          {t("student.classesSubtitle", { count: String(classes.length) })}
        </p>
      </div>

      {!isLoading && todayClasses.length > 0 ? (
        <TodayClassesBanner
          classes={todayClasses}
          onClassClick={(id) => navigate(`/student/classes/${id}`)}
        />
      ) : null}

      <section>
        <h2 className="mb-3 font-semibold text-navy">{t("student.weeklySchedule")}</h2>
        {isLoading ? (
          <PageLoading label={t("student.loadingSchedule")} />
        ) : (
          <WeeklySchedule
            classes={classes}
            onClassClick={(id) => navigate(`/student/classes/${id}`)}
          />
        )}
      </section>

      {isLoading ? (
        <PageLoading label={t("student.loadingClasses")} />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={t("student.noClassesYet")}
          description={t("student.noClassesYetDesc")}
        />
      ) : (
        <section>
          <h2 className="mb-3 font-semibold text-navy">{t("student.yourClasses")}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((cls) => (
              <ClassCard
                key={cls._id}
                title={classTitle(cls)}
                subtitle={cls.description}
                teacherName={teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
                schedule={cls.schedule}
                meetingLink={cls.meetingLink}
                inactive={cls.isActive === false}
                onClick={() => navigate(`/student/classes/${cls._id}`)}
                actions={
                  <button
                    type="button"
                    onClick={() => navigate("/student/homework")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gold/30 px-3 py-2 text-xs font-semibold text-gold-dark transition hover:bg-gold/10"
                  >
                    <ClipboardList className="size-3.5" />
                    {t("student.homework")}
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
