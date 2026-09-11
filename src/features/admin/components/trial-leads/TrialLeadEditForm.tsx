import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import {
  TRIAL_LEAD_AGE_OPTIONS,
  TRIAL_LEAD_STATUSES,
  buildTrialLeadEditDefaults,
  type ITrialLeadUpdatePayload,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface ITrialLeadEditFormProps {
  lead: TrialBookingView;
  courseOptions: string[];
  busy: boolean;
  onCancel: () => void;
  onSave: (payload: ITrialLeadUpdatePayload) => void;
}

const fieldClass = cn(formControlClass, "shadow-none");

export function TrialLeadEditForm({
  lead,
  courseOptions,
  busy,
  onCancel,
  onSave,
}: ITrialLeadEditFormProps) {
  const { t, statusLabel, locale } = usePortalTranslation();
  const defaults = useMemo(() => buildTrialLeadEditDefaults(lead), [lead]);
  const [form, setForm] = useState(defaults);

  const courseChoices = useMemo(() => {
    const values = new Set(courseOptions);
    if (defaults.courseSlug) values.add(defaults.courseSlug);
    return [...values];
  }, [courseOptions, defaults.courseSlug]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]): void {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSave({
      studentName: form.studentName.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      country: form.country.trim(),
      age: form.age.trim(),
      learnerGender: form.learnerGender,
      courseSlug: form.courseSlug.trim(),
      teacherPreference: form.teacherPreference,
      preferredTrialDate: form.preferredTrialDate.trim(),
      preferredTrialTime: form.preferredTrialTime.trim(),
      additionalNote: form.additionalNote.trim(),
      preferredDays: form.preferredTimes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      timezone: form.timezone.trim(),
      status: form.status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldParentName")}
          </span>
          <Input
            value={form.studentName}
            onChange={(event) => updateField("studentName", event.target.value)}
            className={fieldClass}
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldStudentName")}
          </span>
          <Input
            value={form.studentName}
            onChange={(event) => updateField("studentName", event.target.value)}
            className={fieldClass}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.csvWhatsapp")}
          </span>
          <Input
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            className={fieldClass}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.csvEmail")}
          </span>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClass}
          />
        </label>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldAge")}
          </span>
          <Select
            value={form.age}
            onChange={(event) => updateField("age", event.target.value)}
            className={fieldClass}
            required
          >
            <option value="">{t("admin.trialLeads.selectAge")}</option>
            {TRIAL_LEAD_AGE_OPTIONS.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </Select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldGender")}
          </span>
          <Select
            value={form.learnerGender}
            onChange={(event) =>
              updateField("learnerGender", event.target.value as "male" | "female")
            }
            className={fieldClass}
            required
          >
            <option value="male">{t("admin.trialLeads.genderMale")}</option>
            <option value="female">{t("admin.trialLeads.genderFemale")}</option>
          </Select>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.csvCountry")}
          </span>
          <Input
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
            className={fieldClass}
            required
          />
        </label>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.csvCourse")}
          </span>
          <Select
            value={form.courseSlug}
            onChange={(event) => updateField("courseSlug", event.target.value)}
            className={fieldClass}
          >
            <option value="">{t("admin.trialLeads.generalTrialClass")}</option>
            {courseChoices.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </Select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldTeacherPreference")}
          </span>
          <Select
            value={form.teacherPreference}
            onChange={(event) =>
              updateField(
                "teacherPreference",
                event.target.value as TrialBookingView["teacherPreference"]
              )
            }
            className={fieldClass}
          >
            <option value="any">{t("admin.trialLeads.teacherPreferenceAny")}</option>
            <option value="male">{t("admin.trialLeads.teacherPreferenceMale")}</option>
            <option value="female">{t("admin.trialLeads.teacherPreferenceFemale")}</option>
          </Select>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldTrialDate")}
          </span>
          <Input
            type="date"
            value={form.preferredTrialDate}
            onChange={(event) => updateField("preferredTrialDate", event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldTrialTime")}
          </span>
          <Input
            type="time"
            value={form.preferredTrialTime}
            onChange={(event) => updateField("preferredTrialTime", event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldAdditionalNote")}
          </span>
          <Input
            value={form.additionalNote}
            onChange={(event) => updateField("additionalNote", event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldPreferredTimes")}
          </span>
          <Input
            value={form.preferredTimes}
            onChange={(event) => updateField("preferredTimes", event.target.value)}
            className={fieldClass}
            placeholder={t("admin.trialLeads.preferredTimesHint")}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldTimezone")}
          </span>
          <Input
            value={form.timezone}
            onChange={(event) => updateField("timezone", event.target.value)}
            className={fieldClass}
          />
        </label>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("tables.status")}
          </span>
          <Select
            value={form.status}
            onChange={(event) =>
              updateField("status", event.target.value as TrialBookingStatus)
            }
            className={fieldClass}
          >
            {TRIAL_LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
            {form.status === "approved" && !TRIAL_LEAD_STATUSES.includes("approved") && (
              <option key="approved" value="approved">
                {locale === "bn" ? "ভর্তি হয়েছে (Enrolled)" : "Enrolled"}
              </option>
            )}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-portal pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={onCancel}
          className="h-10 rounded-xl border border-portal px-4"
        >
          {t("admin.trialLeads.modalCancel")}
        </Button>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 rounded-xl bg-primary-dark px-4 text-white"
        >
          {t("admin.trialLeads.modalSave")}
        </Button>
      </div>
    </form>
  );
}
