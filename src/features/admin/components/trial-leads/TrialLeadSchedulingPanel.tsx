import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AdminTeacherProfile, TrialBookingView } from "@/types/models";
import {
  TRIAL_MEETING_PLATFORM_OPTIONS,
  type TrialMeetingPlatform,
} from "@/lib/trialMeetingPlatform";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { ITrialLeadSchedulingPayload } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

interface ITrialLeadSchedulingPanelProps {
  lead: TrialBookingView;
  teachers: AdminTeacherProfile[];
  busy: boolean;
  onSave: (payload: ITrialLeadSchedulingPayload) => void;
  onSendInvitation: (payload: ITrialLeadSchedulingPayload) => void;
}

const fieldClass = cn(formControlClass, "shadow-none");

function filterTeachersForLead(
  teachers: AdminTeacherProfile[],
  lead: TrialBookingView
): AdminTeacherProfile[] {
  if (lead.teacherPreference === "any") return teachers;
  return teachers.filter((teacher) => teacher.gender === lead.teacherPreference);
}

export function TrialLeadSchedulingPanel({
  lead,
  teachers,
  busy,
  onSave,
  onSendInvitation,
}: ITrialLeadSchedulingPanelProps) {
  const { t, formatDateTime } = usePortalTranslation();
  const teacherChoices = useMemo(() => filterTeachersForLead(teachers, lead), [teachers, lead]);

  const [teacherSlug, setTeacherSlug] = useState(lead.teacherSlug ?? "");
  const [meetingPlatform, setMeetingPlatform] = useState<TrialMeetingPlatform | "">(
    lead.meetingPlatform ?? ""
  );
  const [meetingLink, setMeetingLink] = useState(lead.meetingLink ?? "");

  useEffect(() => {
    setTeacherSlug(lead.teacherSlug ?? "");
    setMeetingPlatform(lead.meetingPlatform ?? "");
    setMeetingLink(lead.meetingLink ?? "");
  }, [lead._id, lead.teacherSlug, lead.meetingPlatform, lead.meetingLink]);

  const assignedTeacher = teacherChoices.find((teacher) => teacher.slug === teacherSlug);
  const normalizedLink = normalizeMeetingLink(meetingLink);
  const canSend =
    Boolean(teacherSlug.trim()) &&
    Boolean(meetingPlatform) &&
    Boolean(meetingLink.trim()) &&
    Boolean(lead.preferredTrialDate?.trim()) &&
    Boolean(lead.preferredTrialTime?.trim());

  function buildPayload(): ITrialLeadSchedulingPayload {
    return {
      teacherSlug: teacherSlug.trim(),
      meetingPlatform: meetingPlatform || undefined,
      meetingLink: meetingLink.trim(),
    };
  }

  function handleSave(): void {
    onSave(buildPayload());
  }

  function handleSendInvitation(): void {
    onSendInvitation(buildPayload());
  }

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-portal-heading">
          {t("admin.trialLeads.schedulingTitle")}
        </h3>
        <p className="mt-1 text-xs text-portal-muted">{t("admin.trialLeads.schedulingHint")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldAssignedTeacher")}
          </span>
          <Select
            value={teacherSlug}
            onChange={(event) => setTeacherSlug(event.target.value)}
            className={fieldClass}
          >
            <option value="">{t("admin.trialLeads.selectTeacher")}</option>
            {teacherChoices.map((teacher) => (
              <option key={teacher.id} value={teacher.slug}>
                {teacher.name}
                {teacher.gender === "female" ? ` (${t("admin.trialLeads.genderFemale")})` : ""}
              </option>
            ))}
          </Select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldMeetingPlatform")}
          </span>
          <Select
            value={meetingPlatform}
            onChange={(event) =>
              setMeetingPlatform(event.target.value as TrialMeetingPlatform | "")
            }
            className={fieldClass}
          >
            <option value="">{t("admin.trialLeads.selectPlatform")}</option>
            {TRIAL_MEETING_PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </Select>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.fieldMeetingLink")}
          </span>
          <Input
            value={meetingLink}
            onChange={(event) => setMeetingLink(event.target.value)}
            className={fieldClass}
            placeholder={t("admin.trialLeads.meetingLinkPlaceholder")}
          />
        </label>
      </div>

      {assignedTeacher ? (
        <p className="mt-3 text-xs text-portal-muted">
          {t("admin.trialLeads.assignedTeacherPreview", { name: assignedTeacher.name })}
        </p>
      ) : null}

      {normalizedLink ? (
        <p className="mt-2 break-all text-xs">
          <a
            href={normalizedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {normalizedLink}
          </a>
        </p>
      ) : null}

      {lead.invitationSentAt ? (
        <p className="mt-3 text-xs font-medium text-primary-dark">
          {t("admin.trialLeads.invitationSentAt", {
            date: formatDateTime(lead.invitationSentAt),
          })}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 border-t border-primary/15 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={handleSave}
          className="h-10 rounded-xl border border-portal px-4"
        >
          {t("admin.trialLeads.saveScheduling")}
        </Button>
        <Button
          type="button"
          disabled={busy || !canSend}
          onClick={handleSendInvitation}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-dark px-4 text-white"
        >
          <Send className="size-4" aria-hidden />
          {t("admin.trialLeads.sendInvitation")}
        </Button>
        {!canSend ? (
          <p className="text-xs text-portal-muted sm:ml-1">{t("admin.trialLeads.sendInvitationHint")}</p>
        ) : null}
      </div>
    </section>
  );
}
