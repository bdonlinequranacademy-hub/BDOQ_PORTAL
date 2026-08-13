import { Phone, UserCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { admissionFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import {
  buildAdmissionDisplaySections,
  type IAdmissionDisplaySection,
} from "@/lib/admissionFormDisplay";
import type {
  AdminTeacherProfile,
  StudentAdmissionPaymentStatus,
  StudentAdmissionStatus,
  StudentAdmissionView,
} from "@/types/models";
import { AdmissionStatusBadge } from "@/features/admin/components/student-admissions/AdmissionStatusBadge";
import { AdmissionPaymentStatusBadge } from "@/features/admin/components/student-admissions/AdmissionPaymentStatusBadge";
import { AdmissionPaymentReviewPanel } from "@/features/admin/components/student-admissions/AdmissionPaymentReviewPanel";
import { AdmissionEnrollmentSetupPanel } from "@/features/admin/components/student-admissions/AdmissionEnrollmentSetupPanel";
import { AdminCenteredModal } from "@/features/admin/components/shared/AdminCenteredModal";
import { AdminImageDocumentCard } from "@/features/admin/components/shared/AdminImageDocumentCard";
import {
  admissionStatusActions,
  admissionTelHref,
  getAdmissionCountry,
  type IAdmissionEnrollmentPayload,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminStudentAdmissionDetailModalProps {
  application: StudentAdmissionView | null;
  teachers: AdminTeacherProfile[];
  busy: boolean;
  onClose: () => void;
  onUpdateStatus: (app: StudentAdmissionView, status: StudentAdmissionStatus) => void;
  onUpdatePaymentStatus: (
    app: StudentAdmissionView,
    status: StudentAdmissionPaymentStatus,
    rejectReason?: string
  ) => void;
  onSaveEnrollment: (app: StudentAdmissionView, payload: IAdmissionEnrollmentPayload) => void;
}

function AdmissionSection({
  section,
  openLabel,
  printLabel,
}: {
  section: IAdmissionDisplaySection;
  openLabel: string;
  printLabel: string;
}) {
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
              {row.imageUrl ? (
                <AdminImageDocumentCard
                  label={row.label}
                  url={row.href ?? row.imageUrl}
                  imageUrl={row.imageUrl}
                  openLabel={openLabel}
                  printLabel={printLabel}
                />
              ) : row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function AdminStudentAdmissionDetailModal({
  application,
  teachers,
  busy,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onSaveEnrollment,
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
  const lang =
    application.locale === "bn"
      ? pickField("English", "Bengali", "English")
      : application.locale === "en"
        ? pickField("English", "Bengali", "English")
        : null;

  return (
    <AdminCenteredModal
      open
      titleId="admission-detail-title"
      onClose={onClose}
      closeLabel={t("admin.admissions.modalClose")}
      header={
        <div className="flex items-center justify-between px-5 py-4">
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
                <AdmissionPaymentStatusBadge status={application.paymentStatus} />
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
      }
      footer={
        actions.length > 0 ? (
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end">
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
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-portal bg-portal-muted/20 p-4 sm:flex-row sm:flex-wrap sm:items-center">
        {telHref ? (
          <a
            href={telHref}
            className="inline-flex items-center gap-2 text-sm text-portal-heading hover:text-primary"
          >
            <Phone className="size-4 text-portal-muted" aria-hidden />
            {application.whatsapp}
          </a>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-portal-muted"
            onClick={() => window.alert(t("admin.admissions.invalidPhone"))}
          >
            <Phone className="size-4" aria-hidden />
            {application.whatsapp || t("admin.admissions.invalidPhone")}
          </button>
        )}
        <WhatsAppLinkButton
          href={wa}
          label={t("admin.admissions.modalWhatsApp")}
          size="sm"
          disabledReason={t("admin.admissions.invalidWhatsApp")}
        />
        {application.linkedUserId ? (
          <Link
            to={`/admin/users/${application.linkedUserId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary/15"
          >
            <UserCircle className="size-4" aria-hidden />
            {t("admin.admissions.openStudentProfile")}
          </Link>
        ) : null}
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

      <div className="mt-5 space-y-4">
        <AdmissionPaymentReviewPanel
          application={application}
          busy={busy}
          onUpdatePaymentStatus={(status, rejectReason) =>
            onUpdatePaymentStatus(application, status, rejectReason)
          }
        />
        <AdmissionEnrollmentSetupPanel
          application={application}
          teachers={teachers}
          busy={busy}
          onSave={(payload) => onSaveEnrollment(application, payload)}
        />
      </div>

      <div className="mt-5 space-y-5">
        {sections.map((section) => (
          <AdmissionSection
            key={section.title}
            section={section}
            openLabel={t("admin.admissions.openDocument")}
            printLabel={t("admin.admissions.printDocument")}
          />
        ))}
      </div>
    </AdminCenteredModal>
  );
}
