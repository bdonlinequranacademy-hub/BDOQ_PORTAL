import { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import {
  useCreateStudentRequest,
  useTeacherStudentRequests,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formControlClass } from "@/lib/formControl";
import type { StudentRequestStatus } from "@/types/models";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const COURSE_TYPES = ["Quran", "Tajweed", "Hifz", "Arabic", "Other"] as const;

const COURSE_TYPE_KEYS: Record<(typeof COURSE_TYPES)[number], string> = {
  Quran: "teacher.courseQuran",
  Tajweed: "teacher.courseTajweed",
  Hifz: "teacher.courseHifz",
  Arabic: "teacher.courseArabic",
  Other: "teacher.courseOther",
};

function statusStyles(status: StudentRequestStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export function TeacherRequestStudentPage() {
  const { t, statusLabel, formatDate } = usePortalTranslation();
  const [message, setMessage] = useState("");
  const [preferredCourseType, setPreferredCourseType] = useState<(typeof COURSE_TYPES)[number]>("Quran");
  const { data: requests = [], isLoading } = useTeacherStudentRequests();
  const create = useCreateStudentRequest();
  const pagination = usePaginatedList(requests);

  const courseOptions = useMemo(
    () =>
      COURSE_TYPES.map((course) => ({
        value: course,
        label: t(COURSE_TYPE_KEYS[course]),
      })),
    [t]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    create.mutate(
      {
        message: message.trim(),
        preferredCourseType: preferredCourseType || undefined,
      },
      {
        onSuccess: () => {
          setMessage("");
        },
      }
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={t("teacher.requestStudent")}
        subtitle={t("teacher.requestStudentSubtitle")}
        showBismillah
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="bg-portal-surface-muted">
          <p className="text-sm font-semibold text-primary-dark">{t("teacher.whatHappensNext")}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-portal-muted">
            <li>{t("teacher.requestStep1")}</li>
            <li>{t("teacher.requestStep2")}</li>
            <li>{t("teacher.requestStep3")}</li>
          </ol>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="form-label">{t("teacher.preferredCourse")}</span>
              <select
                value={preferredCourseType}
                onChange={(e) => setPreferredCourseType(e.target.value as (typeof COURSE_TYPES)[number])}
                className={formControlClass}
              >
                {courseOptions.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="form-label">{t("teacher.messageToAdmin")}</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={t("teacher.requestMessagePlaceholder")}
                className={`${formControlClass} resize-y`}
                required
              />
            </label>

            <Button
              type="submit"
              disabled={create.isPending || !message.trim()}
              className="w-full rounded-xl sm:w-auto"
            >
              {create.isPending ? t("teacher.sending") : t("teacher.submitRequest")}
            </Button>
          </form>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-primary-dark sm:text-xl">
          {t("teacher.yourRequests")}
        </h2>
        {isLoading ? (
          <PageLoading label={t("teacher.loadingRequests")} />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title={t("teacher.noRequestsYet")}
            description={t("teacher.noRequestsYetDesc")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pagination.paginatedItems.map((req) => (
                <Card key={req._id} className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles(req.status)}`}
                    >
                      {statusLabel(req.status)}
                    </span>
                    {req.preferredCourseType ? (
                      <span className="text-xs text-portal-muted">
                        {COURSE_TYPE_KEYS[req.preferredCourseType as (typeof COURSE_TYPES)[number]]
                          ? t(COURSE_TYPE_KEYS[req.preferredCourseType as (typeof COURSE_TYPES)[number]])
                          : req.preferredCourseType}
                      </span>
                    ) : null}
                    <span className="text-xs text-portal-muted">{formatDate(req.createdAt)}</span>
                  </div>
                  <p className="text-sm text-primary-dark">{req.message}</p>
                  {req.adminNote ? (
                    <p className="rounded-xl border border-portal bg-portal-surface-muted px-3 py-2 text-xs text-portal-muted">
                      {t("teacher.adminNote", { note: req.adminNote })}
                    </p>
                  ) : null}
                </Card>
              ))}
            </div>
            <Pagination pagination={pagination} itemLabel="requests" />
          </>
        )}
      </div>
    </PageContainer>
  );
}
