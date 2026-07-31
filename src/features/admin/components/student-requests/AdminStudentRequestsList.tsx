import { useState } from "react";
import { ArrowRight, ChevronUp, Mail, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { StudentRequestView } from "@/types/models";
import { StudentRequestStatusBadge } from "@/features/admin/components/student-requests/StudentRequestStatusBadge";
import {
  formatRequestTime,
  getRequestCourseLabel,
  messagePreview,
} from "@/features/admin/components/student-requests/adminStudentRequestsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminStudentRequestsListProps {
  requests: StudentRequestView[];
  totalCount: number;
  busy: boolean;
  onApprove: (request: StudentRequestView, adminNote?: string) => void;
  onReject: (request: StudentRequestView, adminNote?: string) => void;
}

export function AdminStudentRequestsList({
  requests,
  totalCount,
  busy,
  onApprove,
  onReject,
}: IAdminStudentRequestsListProps) {
  const { t } = usePortalTranslation();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function toggleExpanded(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">
          Requests ({totalCount})
        </h2>
      </div>

      {requests.length === 0 ? (
        <p className="p-5 text-sm text-portal-muted">No requests in this view.</p>
      ) : (
        <ul className="divide-y divide-portal/80">
          {requests.map((request) => {
            const isExpanded = expandedId === request._id;
            const isPending = request.status === "pending";
            const requested = formatRequestTime(request.createdAt);
            const note = notes[request._id] ?? "";

            return (
              <li
                key={request._id}
                className={cn(
                  "transition",
                  isPending && isExpanded ? "bg-amber-500/[0.06]" : "hover:bg-portal-muted/20"
                )}
              >
                <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <UserInitialAvatar name={request.teacher.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-portal-heading">
                          {request.teacher.name}
                        </p>
                        <StudentRequestStatusBadge status={request.status} />
                      </div>
                      {request.teacher.email ? (
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-portal-muted">
                          <Mail className="size-3.5 shrink-0" aria-hidden />
                          {request.teacher.email}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm font-semibold text-portal-heading">
                        {getRequestCourseLabel(request)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-portal-muted">
                        {isExpanded ? request.message : messagePreview(request.message)}
                      </p>
                      <p className="mt-2 text-xs text-portal-muted">
                        Requested {requested.date} · {requested.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                    {isPending ? (
                      <>
                        <Button
                          type="button"
                          disabled={busy}
                          onClick={() => onApprove(request, note.trim() || undefined)}
                          className="h-9 rounded-xl bg-primary-dark px-4 text-sm text-white"
                        >{t("admin.studentRequests.listApprove")}</Button>
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={busy}
                          onClick={() => onReject(request, note.trim() || undefined)}
                          className="h-9 rounded-xl border border-red-200 px-4 text-sm text-red-600"
                        >{t("admin.studentRequests.listReject")}</Button>
                      </>
                    ) : request.status === "approved" ? (
                      <Link
                        to="/admin/classes"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Assign in Classes
                        <ArrowRight className="size-3" aria-hidden />
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(request._id)}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:text-primary"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse request" : "Expand request"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4" aria-hidden />
                      ) : (
                        <MoreHorizontal className="size-4" aria-hidden />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="border-t border-portal/80 bg-portal-muted/10 px-5 py-4">
                    {request.adminNote ? (
                      <div className="mb-3 rounded-xl border border-portal bg-portal-surface px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">{t("admin.admissions.modalAdminNote")}</p>
                        <p className="mt-1 text-sm text-portal-heading">{request.adminNote}</p>
                      </div>
                    ) : null}

                    {isPending ? (
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
                          Review notes (optional)
                        </span>
                        <textarea
                          value={note}
                          onChange={(event) =>
                            setNotes((current) => ({
                              ...current,
                              [request._id]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder={t("admin.studentRequests.notePlaceholder")}
                          className={cn(
                            "mt-2 w-full resize-none rounded-xl border border-portal bg-portal-surface px-4 py-3 text-sm text-portal-heading",
                            "outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                          )}
                        />
                      </label>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
