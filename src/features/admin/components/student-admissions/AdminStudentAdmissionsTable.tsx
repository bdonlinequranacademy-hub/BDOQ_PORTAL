import { Download, Eye, Mail, MoreHorizontal, Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { admissionFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { StudentAdmissionStatus, StudentAdmissionView } from "@/types/models";
import { AdmissionStatusBadge } from "@/features/admin/components/student-admissions/AdmissionStatusBadge";
import { AdmissionPaymentStatusBadge } from "@/features/admin/components/student-admissions/AdmissionPaymentStatusBadge";
import {
  admissionMailtoHref,
  admissionTelHref,
  getAdmissionCountry,
  getAdmissionFeeSummary,
  getAdmissionProgram,
  getAdmissionProgramDetail,
  getAdmissionSource,
  getAdmissionSourceDetail,
  nextAdmissionActionLabel,
  nextAdmissionStatus,
  type AdminStudentAdmissionsTab,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminStudentAdmissionsTableProps {
  applications: StudentAdmissionView[];
  busy: boolean;
  onView: (app: StudentAdmissionView) => void;
  onAdvanceStatus: (app: StudentAdmissionView, status: StudentAdmissionStatus) => void;
}

const contactActionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminStudentAdmissionsTable({
  applications,
  busy,
  onView,
  onAdvanceStatus,
}: IAdminStudentAdmissionsTableProps) {
  const { t, statusLabel, dynamicLabel, formatDateTime } = usePortalTranslation();

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("admin.admissions.tableApplicant")}</th>
              <th className="px-5 py-3.5">{t("admin.admissions.tableProgram")}</th>
              <th className="px-5 py-3.5">{t("admin.admissions.tableSource")}</th>
              <th className="px-5 py-3.5">{t("admin.trialLeads.tableStatus")}</th>
              <th className="px-5 py-3.5">{t("admin.admissions.tablePayment")}</th>
              <th className="px-5 py-3.5">{t("admin.admissions.tableSubmitted")}</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const country = getAdmissionCountry(app) ?? undefined;
              const wa = waMeUrlFromRaw(
                app.whatsapp,
                country,
                admissionFollowUpMessage(app.fullName)
              );
              const telHref = admissionTelHref(app.whatsapp, country);
              const mailHref = admissionMailtoHref(app, t);
              const nextStatus = nextAdmissionStatus(app.status);
              const nextLabel = nextAdmissionActionLabel(app.status, t, statusLabel);
              const appliedParts = formatDateTime(app.createdAt).split(", ");

              return (
                <tr
                  key={app._id}
                  className="border-b border-portal/80 transition hover:bg-portal-muted/25"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={app.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-portal-heading">{app.fullName}</p>
                        <p className="text-xs text-portal-muted">{app.whatsapp}</p>
                        <p className="truncate text-xs text-portal-muted">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-portal-heading">
                      {getAdmissionProgram(app, t, dynamicLabel)}
                    </p>
                    <p className="text-xs text-portal-muted">
                      {getAdmissionProgramDetail(app, t, dynamicLabel)}
                    </p>
                    {getAdmissionFeeSummary(app, dynamicLabel) ? (
                      <p className="mt-1 text-xs font-medium text-emerald-800">
                        {getAdmissionFeeSummary(app, dynamicLabel)}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-portal-heading">
                      {getAdmissionSource(app, t, dynamicLabel)}
                    </p>
                    <p className="text-xs text-portal-muted">{getAdmissionSourceDetail(t)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <AdmissionStatusBadge status={app.status} />
                  </td>
                  <td className="px-5 py-4">
                    <AdmissionPaymentStatusBadge status={app.paymentStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold tracking-wide text-portal-muted">
                      {appliedParts[0]?.toUpperCase() ?? formatDateTime(app.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-portal-heading">
                      {appliedParts[1]?.trim() ?? ""}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <WhatsAppLinkButton href={wa} label="" size="sm" className="!size-8 !p-0" />
                      {telHref ? (
                        <a
                          href={telHref}
                          className={contactActionClass}
                          aria-label={t("admin.trialLeads.callPerson", { name: app.fullName })}
                          title={app.whatsapp}
                        >
                          <Phone className="size-4" aria-hidden />
                        </a>
                      ) : null}
                      <a
                        href={mailHref}
                        className={contactActionClass}
                        aria-label={t("admin.trialLeads.emailPerson", { name: app.fullName })}
                        title={app.email}
                      >
                        <Mail className="size-4" aria-hidden />
                      </a>
                      <button
                        type="button"
                        onClick={() => onView(app)}
                        className={contactActionClass}
                        aria-label={t("admin.admissions.viewApplication")}
                        title={t("admin.admissions.viewApplication")}
                      >
                        <Eye className="size-4" aria-hidden />
                      </button>
                      {nextStatus && nextLabel ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onAdvanceStatus(app, nextStatus)}
                          className={cn(contactActionClass, "disabled:opacity-50")}
                          title={nextLabel}
                          aria-label={nextLabel}
                        >
                          <MoreHorizontal className="size-4" aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface IAdminStudentAdmissionsToolbarProps {
  search: string;
  programFilter: string;
  countryFilter: string;
  sourceFilter: string;
  dateFrom: string;
  dateTo: string;
  tab: AdminStudentAdmissionsTab;
  tabCounts: Record<AdminStudentAdmissionsTab, number>;
  programs: string[];
  countries: string[];
  sources: string[];
  onSearchChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onTabChange: (tab: AdminStudentAdmissionsTab) => void;
  onExport: () => void;
}

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminStudentAdmissionsToolbar({
  search,
  programFilter,
  countryFilter,
  sourceFilter,
  dateFrom,
  dateTo,
  tab,
  tabCounts,
  programs,
  countries,
  sources,
  onSearchChange,
  onProgramChange,
  onCountryChange,
  onSourceChange,
  onDateFromChange,
  onDateToChange,
  onTabChange,
  onExport,
}: IAdminStudentAdmissionsToolbarProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  const tabs: { id: AdminStudentAdmissionsTab; label: string }[] = [
    { id: "all", label: t("admin.admissions.tabAll") },
    { id: "new", label: statusLabel("new") },
    { id: "reviewing", label: t("admin.admissions.tabReviewing") },
    { id: "approved", label: statusLabel("approved") },
    { id: "closed", label: statusLabel("closed") },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.admissions.toolbarTitle")}
        </h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          {t("admin.admissions.toolbarSubtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "pl-9")}
            placeholder={t("admin.admissions.searchPlaceholder")}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={t("admin.admissions.searchPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap xl:items-center xl:justify-end">
          <select
            value={programFilter}
            onChange={(event) => onProgramChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label={t("admin.admissions.tableProgram")}
          >
            <option value="">{t("admin.admissions.allPrograms")}</option>
            {programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
          <select
            value={countryFilter}
            onChange={(event) => onCountryChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label={t("admin.admissions.tableCountry")}
          >
            <option value="">{t("admin.admissions.allCountries")}</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(event) => onSourceChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label={t("admin.admissions.tableSource")}
          >
            <option value="">{t("admin.admissions.allSources")}</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label={t("filters.dateFrom")}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label={t("filters.dateTo")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-portal pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "shrink-0 rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition",
                tab === item.id
                  ? "bg-primary-dark text-white shadow-sm"
                  : "border border-portal bg-portal-muted/20 text-portal-heading hover:bg-portal-muted/40"
              )}
            >
              {item.label} ({formatNumber(tabCounts[item.id])})
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl border border-portal px-4"
        >
          <Download className="size-4" aria-hidden />
          {t("admin.common.export")}
        </Button>
      </div>
    </div>
  );
}
