import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type {
  StudentAdmissionClassDay,
  StudentAdmissionView,
} from "@/types/models";
import type { ITeacherAssignmentOption } from "@/lib/teacherAssignmentOptions";
import {
  TRIAL_MEETING_PLATFORM_OPTIONS,
  type TrialMeetingPlatform,
} from "@/lib/trialMeetingPlatform";
import {
  ADMISSION_CLASS_DAYS,
  buildAdmissionEnrollmentFormState,
  type IAdmissionEnrollmentPayload,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdmissionEnrollmentSetupPanelProps {
  application: StudentAdmissionView;
  teachers: ITeacherAssignmentOption[];
  busy: boolean;
  onSave: (payload: IAdmissionEnrollmentPayload) => void;
}

const fieldClass = cn(formControlClass, "shadow-none");

export function AdmissionEnrollmentSetupPanel({
  application,
  teachers,
  busy,
  onSave,
}: IAdmissionEnrollmentSetupPanelProps) {
  const { t, formatDateTime } = usePortalTranslation();
  const initial = useMemo(
    () => buildAdmissionEnrollmentFormState(application),
    [application._id, application.updatedAt]
  );

  const [classStartDate, setClassStartDate] = useState(initial.classStartDate);
  const [classDays, setClassDays] = useState<StudentAdmissionClassDay[]>(initial.classDays);
  const [classesPerWeek, setClassesPerWeek] = useState(String(initial.classesPerWeek));
  const [classDurationMinutes, setClassDurationMinutes] = useState(
    String(initial.classDurationMinutes)
  );
  const [classTimeHour, setClassTimeHour] = useState(initial.classTimeHour);
  const [classTimeMinute, setClassTimeMinute] = useState(initial.classTimeMinute);
  const [classTimePeriod, setClassTimePeriod] = useState<"AM" | "PM">(initial.classTimePeriod);
  const [teacherSlug, setTeacherSlug] = useState(initial.teacherSlug);
  const [meetingPlatform, setMeetingPlatform] = useState<TrialMeetingPlatform | "">(
    initial.meetingPlatform ?? ""
  );
  const [meetingLink, setMeetingLink] = useState(initial.meetingLink);
  const [monthlyFeeAmount, setMonthlyFeeAmount] = useState(String(initial.monthlyFeeAmount));
  const [monthlyFeeCurrency, setMonthlyFeeCurrency] = useState<"bdt" | "usd">(
    initial.monthlyFeeCurrency
  );

  useEffect(() => {
    setClassStartDate(initial.classStartDate);
    setClassDays(initial.classDays);
    setClassesPerWeek(String(initial.classesPerWeek));
    setClassDurationMinutes(String(initial.classDurationMinutes));
    setClassTimeHour(initial.classTimeHour);
    setClassTimeMinute(initial.classTimeMinute);
    setClassTimePeriod(initial.classTimePeriod);
    setTeacherSlug(initial.teacherSlug);
    setMeetingPlatform(initial.meetingPlatform ?? "");
    setMeetingLink(initial.meetingLink);
    setMonthlyFeeAmount(String(initial.monthlyFeeAmount));
    setMonthlyFeeCurrency(initial.monthlyFeeCurrency);
  }, [initial]);

  function toggleDay(day: StudentAdmissionClassDay): void {
    setClassDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  }

  function handleSave(): void {
    onSave({
      classStartDate: classStartDate.trim(),
      classDays,
      classesPerWeek: Number(classesPerWeek),
      classDurationMinutes: Number(classDurationMinutes),
      classTimeHour,
      classTimeMinute,
      classTimePeriod,
      assignedTeacherSlug: teacherSlug.trim(),
      meetingPlatform: meetingPlatform || undefined,
      meetingLink: meetingLink.trim(),
      monthlyFeeAmount: Number(monthlyFeeAmount),
      monthlyFeeCurrency,
    });
  }

  return (
    <section className="rounded-2xl border border-portal bg-portal-muted/20 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CalendarDays className="size-4" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-portal-heading">
            {t("admin.admissions.enrollmentTitle")}
          </h3>
          <p className="mt-1 text-xs text-portal-muted">{t("admin.admissions.enrollmentHint")}</p>
          {application.enrollmentSetupAt ? (
            <p className="mt-1 text-xs text-primary-dark">
              {t("admin.admissions.enrollmentSavedAt", {
                date: formatDateTime(application.enrollmentSetupAt),
              })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldClassStartDate")}
          </span>
          <Input
            type="date"
            value={classStartDate}
            onChange={(event) => setClassStartDate(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldClassesPerWeek")}
          </span>
          <Input
            type="number"
            min={1}
            max={7}
            value={classesPerWeek}
            onChange={(event) => setClassesPerWeek(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldClassDuration")}
          </span>
          <Input
            type="number"
            min={15}
            max={180}
            value={classDurationMinutes}
            onChange={(event) => setClassDurationMinutes(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldMonthlyFee")}
          </span>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              value={monthlyFeeAmount}
              onChange={(event) => setMonthlyFeeAmount(event.target.value)}
              className={fieldClass}
            />
            <Select
              value={monthlyFeeCurrency}
              onChange={(event) =>
                setMonthlyFeeCurrency(event.target.value === "usd" ? "usd" : "bdt")
              }
              className={fieldClass}
            >
              <option value="bdt">BDT</option>
              <option value="usd">USD</option>
            </Select>
          </div>
        </label>

        <div className="sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldClassDays")}
          </span>
          <div className="flex flex-wrap gap-2">
            {ADMISSION_CLASS_DAYS.map((day) => {
              const active = classDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    active
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-portal bg-white text-portal-muted hover:border-primary/30"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldClassTime")}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={classTimeHour}
              onChange={(event) => setClassTimeHour(event.target.value)}
              className={fieldClass}
              placeholder="6"
            />
            <Input
              value={classTimeMinute}
              onChange={(event) => setClassTimeMinute(event.target.value)}
              className={fieldClass}
              placeholder="00"
            />
            <Select
              value={classTimePeriod}
              onChange={(event) =>
                setClassTimePeriod(event.target.value === "AM" ? "AM" : "PM")
              }
              className={fieldClass}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </Select>
          </div>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldAssignedTeacher")}
          </span>
          <Select
            value={teacherSlug}
            onChange={(event) => setTeacherSlug(event.target.value)}
            className={fieldClass}
          >
            <option value="">{t("admin.admissions.selectTeacher")}</option>
            {teachers.map((teacher) => (
              <option key={teacher.slug} value={teacher.slug}>
                {teacher.name}
              </option>
            ))}
          </Select>
          {teachers.length === 0 ? (
            <p className="mt-1 text-xs text-amber-700">
              {t("admin.admissions.noTeachersAvailable")}
            </p>
          ) : null}
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldMeetingPlatform")}
          </span>
          <Select
            value={meetingPlatform}
            onChange={(event) =>
              setMeetingPlatform((event.target.value || "") as TrialMeetingPlatform | "")
            }
            className={fieldClass}
          >
            <option value="">{t("admin.admissions.selectPlatform")}</option>
            {TRIAL_MEETING_PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </Select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.admissions.fieldMeetingLink")}
          </span>
          <Input
            value={meetingLink}
            onChange={(event) => setMeetingLink(event.target.value)}
            className={fieldClass}
            placeholder="https://meet.google.com/..."
          />
        </label>
      </div>

      <div className="mt-4 border-t border-portal pt-4">
        <Button
          type="button"
          disabled={busy}
          onClick={handleSave}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-dark px-4 text-white"
        >
          <Save className="size-4" aria-hidden />
          {t("admin.admissions.enrollmentSaveAction")}
        </Button>
      </div>
    </section>
  );
}
