import { useState } from "react";
import { Briefcase, ExternalLink, FileText, Mail, Phone } from "lucide-react";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { teacherApplicationFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type {
  TeacherApplicationStatus,
  TeacherApplicationView,
} from "@/types/models";
import {
  useAdminTeacherApplications,
  useUpdateTeacherApplicationStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";

type Filter = "new" | "all" | TeacherApplicationStatus;

function statusStyles(status: TeacherApplicationStatus) {
  switch (status) {
    case "reviewing":
      return "bg-blue-100 text-blue-800";
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "closed":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function nextActions(
  status: TeacherApplicationStatus
): { label: string; status: TeacherApplicationStatus }[] {
  switch (status) {
    case "new":
      return [{ label: "Start review", status: "reviewing" }];
    case "reviewing":
      return [
        { label: "Approve", status: "approved" },
        { label: "Reject", status: "rejected" },
      ];
    case "approved":
    case "rejected":
      return [{ label: "Close", status: "closed" }];
    default:
      return [];
  }
}

function fileLinks(files: TeacherApplicationView["files"]) {
  const items: { label: string; url: string }[] = [];
  if (files.certificateUrl) {
    items.push({ label: "Certificate", url: files.certificateUrl });
  }
  if (files.cvUrl) items.push({ label: "CV", url: files.cvUrl });
  if (files.profilePhotoUrl) {
    items.push({ label: "Profile photo", url: files.profilePhotoUrl });
  }
  if (files.screenshotUrl) {
    items.push({ label: "Social screenshot", url: files.screenshotUrl });
  }
  return items;
}

export function AdminTeacherApplicationsPage() {
  const [filter, setFilter] = useState<Filter>("new");
  const status = filter === "all" ? undefined : filter;
  const { data: applications = [], isLoading } = useAdminTeacherApplications(status);
  const updateStatus = useUpdateTeacherApplicationStatus();

  const newCount =
    filter === "new"
      ? applications.length
      : applications.filter((a) => a.status === "new").length;

  const pagination = usePaginatedList(applications, {
    resetDeps: [filter],
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Teacher Applications</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Teacher registration submissions from the public website with uploaded documents
        </p>
      </div>

      {filter === "new" && newCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            {newCount} new application{newCount === 1 ? "" : "s"} awaiting review
          </p>
        </Card>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "new" as const, label: "New" },
            { id: "reviewing" as const, label: "Reviewing" },
            { id: "approved" as const, label: "Approved" },
            { id: "rejected" as const, label: "Rejected" },
            { id: "closed" as const, label: "Closed" },
            { id: "all" as const, label: "All" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              filter === f.id
                ? "bg-primary-dark text-white"
                : "border border-zinc-200 bg-white text-primary-dark"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading label="Loading teacher applications…" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No teacher applications in this view"
          description="Applications appear here when candidates submit the teacher registration form."
        />
      ) : (
        <>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pagination.paginatedItems.map((app) => {
            const actions = nextActions(app.status);
            const links = fileLinks(app.files);
            const formData = app.formData;
            const education =
              typeof formData.educationQualification === "string"
                ? formData.educationQualification
                : null;
            const languages = Array.isArray(formData.languages)
              ? formData.languages.join(", ")
              : null;
            const country =
              typeof formData.country === "string"
                ? formData.country
                : typeof formData.nationality === "string"
                  ? formData.nationality
                  : "Bangladesh";
            const wa = waMeUrlFromRaw(
              app.phone,
              country,
              teacherApplicationFollowUpMessage(app.fullName)
            );

            return (
              <Card
                key={app._id}
                className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles(app.status)}`}
                  >
                    {app.status}
                  </span>
                  {app.locale ? (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                      {app.locale === "bn" ? "Bengali" : "English"}
                    </span>
                  ) : null}
                  <span className="text-xs text-zinc-400">
                    {new Date(app.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-primary-dark">{app.fullName}</p>
                  {education ? (
                    <p className="text-xs text-zinc-500">{education}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1 text-sm text-zinc-600">
                  <a
                    href={`mailto:${app.email}`}
                    className="inline-flex items-center gap-2 hover:text-primary-dark"
                  >
                    <Mail className="size-4 shrink-0 text-zinc-400" />
                    {app.email}
                  </a>
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-zinc-400" />
                    {app.phone}
                  </span>
                  <WhatsAppLinkButton href={wa} label="Send WhatsApp" size="sm" />
                </div>

                {languages ? (
                  <p className="text-xs text-zinc-500">Languages: {languages}</p>
                ) : null}

                {links.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-primary-dark hover:bg-white"
                      >
                        <FileText className="size-3.5" />
                        {link.label}
                        <ExternalLink className="size-3 opacity-60" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : null}

                <details className="text-xs text-zinc-500">
                  <summary className="cursor-pointer font-medium text-primary-dark">
                    Full application data
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-zinc-50 p-2 text-[11px]">
                    {JSON.stringify(app.formData, null, 2)}
                  </pre>
                </details>

                {actions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {actions.map((action) => (
                      <Button
                        key={action.status}
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({ id: app._id, status: action.status })
                        }
                        disabled={updateStatus.isPending}
                        className="h-9 rounded-xl bg-primary-dark px-4 text-sm text-white"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
        <Pagination pagination={pagination} itemLabel="applications" />
        </>
      )}
    </PageContainer>
  );
}
