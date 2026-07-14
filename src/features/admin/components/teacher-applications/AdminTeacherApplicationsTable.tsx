import { Download, Eye, Mail, MoreHorizontal, Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { teacherApplicationFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { TeacherApplicationStatus, TeacherApplicationView } from "@/types/models";
import { TeacherApplicationStatusBadge } from "@/features/admin/components/teacher-applications/TeacherApplicationStatusBadge";
import {
  formatAppliedAt,
  formatTeacherSubjectsSummary,
  getTeacherCountry,
  getTeacherExperience,
  getTeacherLocation,
  getTeacherQualification,
  getTeacherQualificationDetail,
  nextTeacherApplicationActionLabel,
  nextTeacherApplicationStatus,
  teacherApplicationMailtoHref,
  teacherApplicationTelHref,
  type AdminTeacherApplicationsTab,
} from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

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
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Applicant</th>
              <th className="px-5 py-3.5">Subjects</th>
              <th className="px-5 py-3.5">Experience</th>
              <th className="px-5 py-3.5">Qualification</th>
              <th className="px-5 py-3.5">Applied on</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const applied = formatAppliedAt(app.createdAt);
              const country = getTeacherCountry(app) ?? undefined;
              const location = getTeacherLocation(app);
              const subjects = formatTeacherSubjectsSummary(app);
              const wa = waMeUrlFromRaw(
                app.phone,
                country,
                teacherApplicationFollowUpMessage(app.fullName)
              );
              const telHref = teacherApplicationTelHref(app.phone, country);
              const mailHref = teacherApplicationMailtoHref(app);
              const nextStatus = nextTeacherApplicationStatus(app.status);
              const nextLabel = nextTeacherApplicationActionLabel(app.status);

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
                      <p className="text-xs text-portal-muted">+{subjects.extra} more</p>
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
                      <WhatsAppLinkButton href={wa} label="" size="sm" className="!size-8 !p-0" />
                      {telHref ? (
                        <a
                          href={telHref}
                          className={contactActionClass}
                          aria-label={`Call ${app.fullName}`}
                          title={app.phone}
                        >
                          <Phone className="size-4" aria-hidden />
                        </a>
                      ) : null}
                      <a
                        href={mailHref}
                        className={contactActionClass}
                        aria-label={`Email ${app.fullName}`}
                        title={app.email}
                      >
                        <Mail className="size-4" aria-hidden />
                      </a>
                      <button
                        type="button"
                        onClick={() => onView(app)}
                        className={contactActionClass}
                        aria-label={`View ${app.fullName}`}
                        title="View application"
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

const TABS: { id: AdminTeacherApplicationsTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "reviewing", label: "Under review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "closed", label: "Closed" },
];

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
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Search &amp; filters</h2>
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
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search teacher applications"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap xl:items-center xl:justify-end">
          <select
            value={subjectFilter}
            onChange={(event) => onSubjectChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label="Filter by subject"
          >
            <option value="">All subjects</option>
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
            aria-label="Filter by country"
          >
            <option value="">All countries</option>
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
            aria-label="Date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label="Date to"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-portal pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((item) => (
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
          <Download className="size-4" aria-hidden />
          Export
        </Button>
      </div>
    </div>
  );
}
