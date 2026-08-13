import { useEffect, useState } from "react";
import { Mail, Pencil, Phone, Trash2, X } from "lucide-react";
import { AdminCenteredModal } from "@/features/admin/components/shared/AdminCenteredModal";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { trialLeadFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import type { ITeacherAssignmentOption } from "@/lib/teacherAssignmentOptions";
import { TrialLeadStatusBadge } from "@/features/admin/components/trial-leads/TrialLeadStatusBadge";
import { TrialLeadEditForm } from "@/features/admin/components/trial-leads/TrialLeadEditForm";
import { TrialLeadSchedulingPanel } from "@/features/admin/components/trial-leads/TrialLeadSchedulingPanel";
import {
  TrialLeadConvertPanel,
  type IConvertTrialResult,
} from "@/features/admin/components/trial-leads/TrialLeadConvertPanel";
import {
  buildTrialLeadDisplaySections,
  trialLeadMailtoHref,
  trialLeadStatusActions,
  trialLeadTelHref,
  type ITrialLeadDisplaySection,
  type ITrialLeadSchedulingPayload,
  type ITrialLeadUpdatePayload,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTrialLeadDetailModalProps {
  lead: TrialBookingView | null;
  courseOptions: string[];
  teachers: ITeacherAssignmentOption[];
  busy: boolean;
  initialMode?: "view" | "edit";
  onClose: () => void;
  onUpdateStatus: (lead: TrialBookingView, status: TrialBookingStatus) => void;
  onSave: (lead: TrialBookingView, payload: ITrialLeadUpdatePayload) => void;
  onSaveScheduling: (lead: TrialBookingView, payload: ITrialLeadSchedulingPayload) => void;
  onSendInvitation: (lead: TrialBookingView, payload: ITrialLeadSchedulingPayload) => void;
  onConvert: (lead: TrialBookingView, payload: { email: string; createUser: boolean }) => void;
  convertResult: IConvertTrialResult | null;
  canDelete?: boolean;
  onDelete: (lead: TrialBookingView) => void;
}

function LeadSection({ section }: { section: ITrialLeadDisplaySection }) {
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

export function AdminTrialLeadDetailModal({
  lead,
  courseOptions,
  teachers,
  busy,
  initialMode = "view",
  onClose,
  onUpdateStatus,
  onSave,
  onSaveScheduling,
  onSendInvitation,
  onConvert,
  convertResult,
  canDelete = false,
  onDelete,
}: IAdminTrialLeadDetailModalProps) {
  const { t, formatDateTime, statusLabel } = usePortalTranslation();
  const [mode, setMode] = useState<"view" | "edit">(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [lead?._id, initialMode]);

  if (!lead) return null;

  const activeLead = lead;

  const sections = buildTrialLeadDisplaySections(activeLead, t);
  const actions = trialLeadStatusActions(activeLead.status, t, statusLabel);
  const wa = waMeUrlFromRaw(
    activeLead.whatsapp,
    activeLead.country,
    trialLeadFollowUpMessage(activeLead.parentName)
  );
  const telHref = trialLeadTelHref(activeLead.whatsapp, activeLead.country);
  const mailHref = trialLeadMailtoHref(activeLead.email, activeLead.parentName, t);

  function handleDelete(): void {
    const confirmed = window.confirm(
      t("admin.trialLeads.confirmDeleteLead", { name: activeLead.parentName })
    );
    if (!confirmed) return;
    onDelete(activeLead);
  }

  return (
    <AdminCenteredModal
      open
      titleId="trial-lead-detail-title"
      onClose={onClose}
      closeLabel={t("admin.trialLeads.modalClose")}
      header={
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <UserInitialAvatar name={activeLead.parentName} size="md" />
            <div className="min-w-0">
              <h2
                id="trial-lead-detail-title"
                className="truncate text-lg font-bold text-portal-heading"
              >
                {mode === "edit"
                  ? t("admin.trialLeads.modalEditTitle")
                  : t("admin.trialLeads.modalViewTitle")}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <TrialLeadStatusBadge status={activeLead.status} />
                <span className="truncate text-sm text-portal-muted">{activeLead.parentName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {mode === "view" ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-portal text-portal-muted transition hover:text-primary"
                  aria-label={t("admin.trialLeads.editLead")}
                  title={t("admin.trialLeads.editLead")}
                >
                  <Pencil className="size-4" aria-hidden />
                </button>
                {canDelete ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={busy}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    aria-label={t("admin.trialLeads.deleteLead")}
                    title={t("admin.trialLeads.deleteLead")}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                ) : null}
              </>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-full border border-portal text-portal-muted transition hover:text-primary"
              aria-label={t("admin.trialLeads.modalClose")}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      }
      footer={
        mode === "view" && actions.length > 0 ? (
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end">
            {actions.map((action) => (
              <Button
                key={action.status}
                type="button"
                disabled={busy}
                onClick={() => onUpdateStatus(activeLead, action.status)}
                className="h-10 rounded-xl bg-primary-dark px-4 text-sm text-white"
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : undefined
      }
    >
          {mode === "edit" ? (
            <TrialLeadEditForm
              key={activeLead._id}
              lead={activeLead}
              courseOptions={courseOptions}
              busy={busy}
              onCancel={() => setMode("view")}
              onSave={(payload) => onSave(activeLead, payload)}
            />
          ) : (
            <>
              <div className="flex flex-col gap-3 rounded-2xl border border-portal bg-portal-muted/20 p-4 sm:flex-row sm:flex-wrap sm:items-center">
                {mailHref ? (
                  <a
                    href={mailHref}
                    className="inline-flex items-center gap-2 text-sm text-portal-heading hover:text-primary"
                  >
                    <Mail className="size-4 text-portal-muted" aria-hidden />
                    {activeLead.email}
                  </a>
                ) : null}
                {telHref ? (
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 text-sm text-portal-heading hover:text-primary"
                  >
                    <Phone className="size-4 text-portal-muted" aria-hidden />
                    {activeLead.whatsapp}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm text-portal-muted">
                    <Phone className="size-4" aria-hidden />
                    {activeLead.whatsapp}
                  </span>
                )}
                <WhatsAppLinkButton
                  href={wa}
                  label={t("admin.trialLeads.modalWhatsApp")}
                  size="sm"
                  disabledReason={t("admin.trialLeads.invalidPhone")}
                />
                <p className="text-xs text-portal-muted sm:ml-auto">
                  {t("admin.trialLeads.tableRequestedAt")}{" "}
                  {formatDateTime(activeLead.createdAt)}
                </p>
              </div>

              <div className="mt-5 space-y-5">
                <TrialLeadSchedulingPanel
                  lead={activeLead}
                  teachers={teachers}
                  busy={busy}
                  onSave={(payload) => onSaveScheduling(activeLead, payload)}
                  onSendInvitation={(payload) => onSendInvitation(activeLead, payload)}
                />
                <TrialLeadConvertPanel
                  lead={activeLead}
                  busy={busy}
                  lastResult={convertResult}
                  onConvert={(payload) => onConvert(activeLead, payload)}
                />
                {sections.map((section) => (
                  <LeadSection key={section.title} section={section} />
                ))}
              </div>
            </>
          )}
    </AdminCenteredModal>
  );
}
