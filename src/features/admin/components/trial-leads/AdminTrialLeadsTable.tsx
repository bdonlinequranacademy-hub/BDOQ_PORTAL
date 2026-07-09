import { Download, Mail, MoreHorizontal, Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { trialLeadFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import { TrialLeadStatusBadge } from "@/features/admin/components/trial-leads/TrialLeadStatusBadge";
import {
  formatCourseInterest,
  formatLeadSource,
  formatLeadSourceDetail,
  formatRequestedAt,
  nextTrialLeadActionLabel,
  nextTrialLeadStatus,
  trialLeadMailtoHref,
  trialLeadTelHref,
  type AdminTrialLeadsTab,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminTrialLeadsTableProps {
  leads: TrialBookingView[];
  busy: boolean;
  onAdvanceStatus: (lead: TrialBookingView, status: TrialBookingStatus) => void;
}

const contactActionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminTrialLeadsTable({
  leads,
  busy,
  onAdvanceStatus,
}: IAdminTrialLeadsTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Lead</th>
              <th className="px-5 py-3.5">Program interested</th>
              <th className="px-5 py-3.5">Source</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Requested at</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const requested = formatRequestedAt(lead.createdAt);
              const wa = waMeUrlFromRaw(
                lead.whatsapp,
                lead.country,
                trialLeadFollowUpMessage(lead.parentName)
              );
              const nextStatus = nextTrialLeadStatus(lead.status);
              const nextLabel = nextTrialLeadActionLabel(lead.status);
              const telHref = trialLeadTelHref(lead.whatsapp, lead.country);
              const mailHref = trialLeadMailtoHref(lead.email, lead.parentName);

              return (
                <tr
                  key={lead._id}
                  className="border-b border-portal/80 transition hover:bg-portal-muted/25"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={lead.parentName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-portal-heading">
                          {lead.parentName}
                        </p>
                        <p className="text-xs text-portal-muted">{lead.whatsapp}</p>
                        {lead.email ? (
                          <p className="truncate text-xs text-portal-muted">{lead.email}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-portal-heading">
                      {formatCourseInterest(lead.courseSlug)}
                    </p>
                    <p className="text-xs text-portal-muted">Free trial class</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-portal-heading">
                      {formatLeadSource(lead)}
                    </p>
                    <p className="text-xs text-portal-muted">{formatLeadSourceDetail(lead)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <TrialLeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold tracking-wide text-portal-muted">
                      {requested.date}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-portal-heading">
                      {requested.time}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <WhatsAppLinkButton href={wa} label="" size="sm" className="!size-8 !p-0" />
                      {telHref ? (
                        <a
                          href={telHref}
                          className={contactActionClass}
                          aria-label={`Call ${lead.parentName}`}
                          title={lead.whatsapp}
                        >
                          <Phone className="size-4" aria-hidden />
                        </a>
                      ) : (
                        <span
                          className={cn(contactActionClass, "cursor-not-allowed opacity-40")}
                          title="Invalid phone number"
                          aria-hidden
                        >
                          <Phone className="size-4" />
                        </span>
                      )}
                      {mailHref ? (
                        <a
                          href={mailHref}
                          className={contactActionClass}
                          aria-label={`Email ${lead.parentName}`}
                          title={lead.email ?? undefined}
                        >
                          <Mail className="size-4" aria-hidden />
                        </a>
                      ) : null}
                      {nextStatus && nextLabel ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onAdvanceStatus(lead, nextStatus)}
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary disabled:opacity-50"
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

interface IAdminTrialLeadsToolbarProps {
  search: string;
  courseFilter: string;
  sourceFilter: string;
  dateFrom: string;
  dateTo: string;
  tab: AdminTrialLeadsTab;
  tabCounts: Record<AdminTrialLeadsTab, number>;
  courses: string[];
  sources: string[];
  onSearchChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onTabChange: (tab: AdminTrialLeadsTab) => void;
  onExport: () => void;
}

const TABS: { id: AdminTrialLeadsTab; label: string }[] = [
  { id: "all", label: "All leads" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "scheduled", label: "Scheduled" },
  { id: "closed", label: "Closed" },
];

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminTrialLeadsToolbar({
  search,
  courseFilter,
  sourceFilter,
  dateFrom,
  dateTo,
  tab,
  tabCounts,
  courses,
  sources,
  onSearchChange,
  onCourseChange,
  onSourceChange,
  onDateFromChange,
  onDateToChange,
  onTabChange,
  onExport,
}: IAdminTrialLeadsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Search &amp; filters</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Find leads by contact details, course interest, or submission date.
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
            placeholder="Search name, phone, email…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search trial leads"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap xl:items-center xl:justify-end">
          <select
            value={courseFilter}
            onChange={(event) => onCourseChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label="Filter by course"
          >
            <option value="">All courses</option>
            {courses.map((slug) => (
              <option key={slug} value={slug}>
                {formatCourseInterest(slug)}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(event) => onSourceChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label="Filter by source"
          >
            <option value="">All sources</option>
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
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
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
