import { Download, Eye, Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { teacherApplicationFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { TeacherApplicationStatus, TeacherApplicationView } from "@/types/models";
import { TeacherApplicationStatusBadge } from "@/features/admin/components/teacher-applications/TeacherApplicationStatusBadge";
import { AdminStatusMenu } from "@/features/admin/components/shared/AdminStatusMenu";
import {
  formatAppliedAt,
  formatTeacherSubjectsSummary,
  getTeacherCountry,
  getTeacherExperience,
  getTeacherLocation,
  getTeacherQualification,
  getTeacherQualificationDetail,
  getTeacherWhatsAppNumber,
  TEACHER_APPLICATION_STATUSES,
  teacherApplicationTelHref,
  type AdminTeacherApplicationsTab,
} from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTeacherApplicationsTableProps {
  applications: TeacherApplicationView[];
  busy: boolean;
  onView: (app: TeacherApplicationView) => void;
  onAdvanceStatus: (app: TeacherApplicationView, status: TeacherApplicationStatus) => void;
}

const contactActionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminTeacherApplicationsTable({
  applications,
  busy,
  onView,
  onAdvanceStatus,
}: IAdminTeacherApplicationsTableProps) {
  const { t } = usePortalTranslation();

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("admin.teacherApplications.tableApplicant")}</th>
              <th className="px-5 py-3.5">{t("admin.teacherApplications.tableSubject")}</th>
              <th className="px-5 py-3.5">{t("admin.experience")}</th>
              <th className="px-5 py-3.5">{t("admin.qualifications")}</th>
              <th className="px-5 py-3.5">{t("admin.teacherApplications.tableSubmitted")}</th>
              <th className="px-5 py-3.5">{t("tables.status")}</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const applied = formatAppliedAt(app.createdAt);
              const country = getTeacherCountry(app) ?? undefined;
              const location = getTeacherLocation(app);
              const subjects = formatTeacherSubjectsSummary(app);
              const whatsappNumber = getTeacherWhatsAppNumber(app);
              const wa = waMeUrlFromRaw(
                whatsappNumber,
                country,
                teacherApplicationFollowUpMessage(app.fullName)
              );
              const telHref = teacherApplicationTelHref(app.phone, country);

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
                        <p className="truncate text-xs text-portal-muted">{app.email}</p>
                        <p className="text-xs text-portal-muted">{app.phone}</p>
                        {location ? (
                          <p className="text-xs text-portal-muted">{location}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-portal-heading">{subjects.visible}</p>
                    {subjects.extra > 0 ? (
                      <p className="text-xs text-portal-muted">+{subjects.extra} {t("labels.more")}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-portal-heading">
                      {getTeacherExperience(app)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-portal-heading">
                      {getTeacherQualification(app)}
                    </p>
                    <p className="text-xs text-portal-muted">
                      {getTeacherQualificationDetail(app)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold tracking-wide text-portal-muted">
                      {applied.date}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-portal-heading">
                      {applied.time}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <TeacherApplicationStatusBadge status={app.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <WhatsAppLinkButton
                        href={wa}
                        label=""
                        size="sm"
                        className="!size-8 !p-0"
                        disabledReason={t("admin.teacherApplications.invalidWhatsApp")}
                      />
                      {telHref ? (
                        <a
                          href={telHref}
                          className={contactActionClass}
                          aria-label={`Call ${app.fullName}`}
                          title={app.phone}
                        >
                          <Phone className="size-4" aria-hidden />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={cn(contactActionClass, "cursor-not-allowed opacity-60")}
                          aria-label={t("admin.teacherApplications.invalidPhone")}
                          title={t("admin.teacherApplications.invalidPhone")}
                          onClick={() =>
                            window.alert(t("admin.teacherApplications.invalidPhone"))
                          }
                        >
                          <Phone className="size-4" aria-hidden />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onView(app)}
                        className={contactActionClass}
                        aria-label={t("admin.teacherApplications.viewApplication")}
                        title={t("admin.teacherApplications.viewApplication")}
                      >
                        <Eye className="size-4" aria-hidden />
                      </button>
                      <AdminStatusMenu
                        item={app}
                        currentStatus={app.status}
                        statuses={TEACHER_APPLICATION_STATUSES}
                        busy={busy}
                        title={t("admin.teacherApplications.statusMenuTitle")}
                        currentLabel={t("admin.teacherApplications.statusMenuCurrent")}
                        ariaLabel={t("admin.teacherApplications.statusMenuAria", {
                          name: app.fullName,
                        })}
                        onStatusChange={onAdvanceStatus}
                        renderBadge={(status) => (
                          <TeacherApplicationStatusBadge status={status} />
                        )}
                      />
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

interface IAdminTeacherApplicationsToolbarProps {
  search: string;
  subjectFilter: string;
  countryFilter: string;
  dateFrom: string;
  dateTo: string;
  tab: AdminTeacherApplicationsTab;
  tabCounts: Record<AdminTeacherApplicationsTab, number>;
  subjects: string[];
  countries: string[];
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onTabChange: (tab: AdminTeacherApplicationsTab) => void;
  onExport: () => void;
}

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminTeacherApplicationsToolbar({
  search,
  subjectFilter,
  countryFilter,
  dateFrom,
  dateTo,
  tab,
  tabCounts,
  subjects,
  countries,
  onSearchChange,
  onSubjectChange,
  onCountryChange,
  onDateFromChange,
  onDateToChange,
  onTabChange,
  onExport,
}: IAdminTeacherApplicationsToolbarProps) {
  const { t, statusLabel } = usePortalTranslation();

  const tabs: { id: AdminTeacherApplicationsTab; label: string }[] = [
    { id: "all", label: t("admin.teacherApplications.tabAll") },
    { id: "new", label: t("admin.admissions.tabNew") },
    { id: "reviewing", label: t("admin.admissions.tabReviewing") },
    { id: "approved", label: t("admin.admissions.tabApproved") },
    { id: "rejected", label: statusLabel("rejected") },
    { id: "closed", label: t("admin.admissions.tabClosed") },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.teacherApplications.toolbarTitle")}</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Find applications by name, contact details, subject, or submission date.
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
            aria-label={t("admin.teacherApplications.searchPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap xl:items-center xl:justify-end">
          <select
            value={subjectFilter}
            onChange={(event) => onSubjectChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label={t("admin.teacherApplications.tableSubject")}
          >
            <option value="">{t("admin.teacherApplications.allSubjects")}</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            value={countryFilter}
            onChange={(event) => onCountryChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label={t("admin.teacherApplications.tableCountry")}
          >
            <option value="">{t("admin.teacherApplications.allCountries")}</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
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
              {item.label} ({tabCounts[item.id]})
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl border border-portal px-4"
        >
          <Download className="size-4" aria-hidden />{t("admin.common.export")}</Button>
      </div>
    </div>
  );
}
