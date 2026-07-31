import { Mail, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { admissionFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import {
  buildAdmissionDisplaySections,
  type IAdmissionDisplaySection,
} from "@/lib/admissionFormDisplay";
import type { StudentAdmissionStatus, StudentAdmissionView } from "@/types/models";
import { AdmissionStatusBadge } from "@/features/admin/components/student-admissions/AdmissionStatusBadge";
import {
  admissionMailtoHref,
  admissionStatusActions,
  admissionTelHref,
  getAdmissionCountry,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface IAdminStudentAdmissionDetailModalProps {
  application: StudentAdmissionView | null;
  busy: boolean;
  onClose: () => void;
  onUpdateStatus: (app: StudentAdmissionView, status: StudentAdmissionStatus) => void;
}

function AdmissionSection({ section }: { section: IAdmissionDisplaySection }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
        {section.title}
      </h4>
      <dl className="mt-2 grid gap-3 sm:grid-cols-2">
        {section.rows.map((row) => (
          <div key={row.key} className={row.fullWidth ? "sm:col-span-2" : undefined}>
            <dt className="text-xs text-portal-muted">{row.label}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-sm font-medium text-portal-heading">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function AdminStudentAdmissionDetailModal({
  application,
  busy,
  onClose,
  onUpdateStatus,
}: IAdminStudentAdmissionDetailModalProps) {
  const { t, formatDateTime, pickField } = usePortalTranslation();

  if (!application) return null;

  const country = getAdmissionCountry(application) ?? undefined;
  const sections = buildAdmissionDisplaySections(application.formData);
  const actions = admissionStatusActions(application.status, t);
  const wa = waMeUrlFromRaw(
    application.whatsapp,
    country,
    admissionFollowUpMessage(application.fullName)
  );
  const telHref = admissionTelHref(application.whatsapp, country);
  const mailHref = admissionMailtoHref(application, t);
  const lang =
    application.locale === "bn"
      ? pickField("English", "Bengali", "English")
      : application.locale === "en"
        ? pickField("English", "Bengali", "English")
        : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0A1628]/55 backdrop-blur-[2px]"
        aria-label={t("admin.admissions.modalClose")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admission-detail-title"
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden",
          "rounded-t-3xl border border-portal bg-portal-surface shadow-2xl sm:rounded-2xl"
        )}
      >
        <div className="flex items-center justify-between border-b border-portal px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <UserInitialAvatar name={application.fullName} size="md" />
            <div className="min-w-0">
              <h2
                id="admission-detail-title"
                className="truncate text-lg font-bold text-portal-heading"
              >
                {application.fullName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <AdmissionStatusBadge status={application.status} />
                {lang ? (
                  <span className="rounded-full bg-portal-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                    {lang}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full border border-portal text-portal-muted transition hover:text-primary"
            aria-label={t("admin.admissions.modalClose")}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-portal bg-portal-muted/20 p-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={mailHref}
              className="inline-flex items-center gap-2 text-sm text-portal-heading hover:text-primary"
            >
              <Mail className="size-4 text-portal-muted" aria-hidden />
              {application.email}
            </a>
            {telHref ? (
              <a
                href={telHref}
                className="inline-flex items-center gap-2 text-sm text-portal-heading hover:text-primary"
              >
                <Phone className="size-4 text-portal-muted" aria-hidden />
                {application.whatsapp}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-portal-muted">
                <Phone className="size-4" aria-hidden />
                {application.whatsapp}
              </span>
            )}
            <WhatsAppLinkButton href={wa} label={t("admin.admissions.modalWhatsApp")} size="sm" />
            <p className="text-xs text-portal-muted sm:ml-auto">
              {t("admin.admissions.tableSubmitted")} {formatDateTime(application.createdAt)}
            </p>
          </div>

          {application.adminNote ? (
            <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                {t("admin.admissions.modalAdminNote")}
              </p>
              <p className="mt-1 text-sm text-portal-heading">{application.adminNote}</p>
            </div>
          ) : null}

          <div className="mt-5 space-y-5">
            {sections.map((section) => (
              <AdmissionSection key={section.title} section={section} />
            ))}
          </div>
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-col gap-2 border-t border-portal p-4 sm:flex-row sm:justify-end">
            <a
              href={mailHref}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:text-primary"
            >
              {t("admin.admissions.modalReplyEmail")}
            </a>
            {actions.map((action) => (
              <Button
                key={action.status}
                type="button"
                disabled={busy}
                onClick={() => onUpdateStatus(application, action.status)}
                className="h-10 rounded-xl bg-primary-dark px-4 text-sm text-white"
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
