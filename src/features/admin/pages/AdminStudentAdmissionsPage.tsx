import { useState } from "react";
import { GraduationCap, Mail, Phone } from "lucide-react";
import type {
  StudentAdmissionStatus,
  StudentAdmissionView,
} from "@/types/models";
import {
  useAdminStudentAdmissions,
  useUpdateStudentAdmissionStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { admissionFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import {
  buildAdmissionDisplaySections,
  type IAdmissionDisplaySection,
} from "@/lib/admissionFormDisplay";

type Filter = "new" | "all" | StudentAdmissionStatus;

function statusStyles(status: StudentAdmissionStatus) {
  switch (status) {
    case "reviewing":
      return "bg-blue-100 text-blue-800";
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "closed":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function nextActions(
  status: StudentAdmissionStatus
): { label: string; status: StudentAdmissionStatus }[] {
  switch (status) {
    case "new":
      return [{ label: "Start review", status: "reviewing" }];
    case "reviewing":
      return [
        { label: "Approve", status: "approved" },
        { label: "Close", status: "closed" },
      ];
    case "approved":
      return [{ label: "Close", status: "closed" }];
    default:
      return [];
  }
}

function AdmissionDetails({
  formData,
}: {
  formData: Record<string, unknown>;
}) {
  const sections = buildAdmissionDisplaySections(formData);
  if (sections.length === 0) return null;

  return (
    <div className="space-y-4 border-t border-zinc-100 pt-4">
      {sections.map((section) => (
        <AdmissionSection key={section.title} section={section} />
      ))}
    </div>
  );
}

function AdmissionSection({ section }: { section: IAdmissionDisplaySection }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {section.title}
      </h4>
      <dl className="mt-2 grid gap-3 sm:grid-cols-2">
        {section.rows.map((row) => (
          <div
            key={row.key}
            className={row.fullWidth ? "sm:col-span-2" : undefined}
          >
            <dt className="text-xs text-zinc-500">{row.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-primary-dark whitespace-pre-wrap">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function AdminStudentAdmissionsPage() {
  const [filter, setFilter] = useState<Filter>("new");
  const status = filter === "all" ? undefined : filter;
  const { data: applications = [], isLoading } = useAdminStudentAdmissions(status);
  const updateStatus = useUpdateStudentAdmissionStatus();

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
        <h1 className="text-2xl font-bold text-primary-dark">Student Admissions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Applications from the public website — review and create portal accounts when approved
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
        <PageLoading label="Loading admission applications…" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No admission applications in this view"
          description="Applications appear here when visitors submit the student admission form."
        />
      ) : (
        <>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pagination.paginatedItems.map((app) => (
            <AdmissionCard
              key={app._id}
              app={app}
              onUpdate={(nextStatus) =>
                updateStatus.mutate({ id: app._id, status: nextStatus })
              }
              updating={updateStatus.isPending}
            />
          ))}
        </div>
        <Pagination pagination={pagination} itemLabel="applications" />
        </>
      )}
    </PageContainer>
  );
}

function AdmissionCard({
  app,
  onUpdate,
  updating,
}: {
  app: StudentAdmissionView;
  onUpdate: (status: StudentAdmissionStatus) => void;
  updating: boolean;
}) {
  const country =
    typeof app.formData?.country === "string" ? app.formData.country : undefined;
  const wa = waMeUrlFromRaw(
    app.whatsapp,
    country,
    admissionFollowUpMessage(app.fullName)
  );
  const actions = nextActions(app.status);

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
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
          {app.whatsapp}
        </span>
        <WhatsAppLinkButton href={wa} label="Send WhatsApp" size="sm" />
      </div>

      <AdmissionDetails formData={app.formData} />

      {actions.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {actions.map((action) => (
            <Button
              key={action.status}
              type="button"
              onClick={() => onUpdate(action.status)}
              disabled={updating}
              className="h-9 rounded-xl bg-primary-dark px-4 text-sm text-white"
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
