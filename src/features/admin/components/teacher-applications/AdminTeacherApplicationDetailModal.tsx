import { useEffect } from "react";
import { ExternalLink, FileText, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { teacherApplicationFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { TeacherApplicationStatus, TeacherApplicationView } from "@/types/models";
import { TeacherApplicationStatusBadge } from "@/features/admin/components/teacher-applications/TeacherApplicationStatusBadge";
import {
  buildTeacherApplicationDisplaySections,
  formatAppliedAt,
  getTeacherCountry,
  getTeacherLocation,
  getTeacherWhatsAppNumber,
  teacherApplicationFileLinks,
  teacherApplicationStatusActions,
  teacherApplicationTelHref,
  type ITeacherApplicationDisplaySection,
} from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTeacherApplicationDetailModalProps {
  application: TeacherApplicationView | null;
  busy: boolean;
  onClose: () => void;
  onUpdateStatus: (app: TeacherApplicationView, status: TeacherApplicationStatus) => void;
}

function DisplaySection({ section }: { section: ITeacherApplicationDisplaySection }) {
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

export function AdminTeacherApplicationDetailModal({
  application,
  busy,
  onClose,
  onUpdateStatus,
}: IAdminTeacherApplicationDetailModalProps) {
  const { t } = usePortalTranslation();

  useEffect(() => {
    if (!application) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [application]);

  if (!application) return null;

  const country = getTeacherCountry(application) ?? undefined;
  const location = getTeacherLocation(application);
  const applied = formatAppliedAt(application.createdAt);
  const sections = buildTeacherApplicationDisplaySections(application.formData);
  const fileLinks = teacherApplicationFileLinks(application.files);
  const actions = teacherApplicationStatusActions(application.status);
  const whatsappNumber = getTeacherWhatsAppNumber(application);
  const wa = waMeUrlFromRaw(
    whatsappNumber,
    country,
    teacherApplicationFollowUpMessage(application.fullName)
  );
  const telHref = teacherApplicationTelHref(application.phone, country);
  const lang =
    application.locale === "bn" ? "Bengali" : application.locale === "en" ? "English" : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#0A1628]/55 backdrop-blur-[2px]"
        aria-label={t("admin.admissions.modalClose")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-app-detail-title"
        className={cn(
          "relative z-10 flex h-[min(90vh,880px)] w-full max-w-3xl flex-col overflow-hidden",
          "rounded-2xl border border-portal bg-portal-surface shadow-2xl"
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-portal px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <UserInitialAvatar name={application.fullName} size="md" />
            <div className="min-w-0">
              <h2
                id="teacher-app-detail-title"
                className="truncate text-lg font-bold text-portal-heading"
              >
                {application.fullName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <TeacherApplicationStatusBadge status={application.status} />
                {lang ? (
                  <span className="rounded-full bg-portal-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                    {lang}
                  </span>
                ) : null}
                {location ? (
                  <span className="text-xs text-portal-muted">{location}</span>
                ) : null}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full border border-portal text-portal-muted transition hover:text-primary"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-portal bg-portal-muted/20 p-4 sm:flex-row sm:flex-wrap sm:items-center">
            {telHref ? (
              <a
                href={telHref}
                className="inline-flex items-center gap-2 text-sm text-portal-heading hover:text-primary"
              >
                <Phone className="size-4 text-portal-muted" aria-hidden />
                {application.phone}
              </a>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-portal-muted"
                onClick={() => window.alert(t("admin.teacherApplications.invalidPhone"))}
              >
                <Phone className="size-4" aria-hidden />
                {application.phone || t("admin.teacherApplications.invalidPhone")}
              </button>
            )}
            <WhatsAppLinkButton
              href={wa}
              label={t("admin.admissions.modalWhatsApp")}
              size="sm"
              disabledReason={t("admin.teacherApplications.invalidWhatsApp")}
            />
            <p className="text-xs text-portal-muted sm:ml-auto">
              Applied {applied.date} · {applied.time}
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

          {fileLinks.length > 0 ? (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
                {t("admin.teacherApplications.modalDocuments")}
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {fileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-portal bg-portal-muted/20 px-3 py-2 text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary"
                  >
                    <FileText className="size-3.5" aria-hidden />
                    {link.label}
                    <ExternalLink className="size-3 opacity-60" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-5">
            {sections.map((section) => (
              <DisplaySection key={section.title} section={section} />
            ))}
          </div>
        </div>

        {actions.length > 0 ? (
          <div className="flex shrink-0 flex-col gap-2 border-t border-portal p-4 sm:flex-row sm:justify-end">
            {actions.map((action) => (
              <Button
                key={action.status}
                type="button"
                disabled={busy}
                onClick={() => onUpdateStatus(application, action.status)}
                className={cn(
                  "h-10 rounded-xl px-4 text-sm text-white",
                  action.status === "rejected" ? "bg-red-600 hover:bg-red-700" : "bg-primary-dark"
                )}
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
