import { useState } from "react";
import { CalendarCheck, Mail, Phone } from "lucide-react";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { trialLeadFollowUpMessage } from "@/lib/whatsappMessageTemplates";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import {
  useAdminTrialBookings,
  useUpdateTrialBookingStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
type Filter = "new" | "all" | TrialBookingStatus;

function statusStyles(status: TrialBookingStatus) {
  switch (status) {
    case "contacted":
      return "bg-blue-100 text-blue-800";
    case "scheduled":
      return "bg-emerald-100 text-emerald-800";
    case "closed":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}


function formatTimeSlot(slot?: TrialBookingView["timeSlot"]) {
  if (!slot) return null;
  const labels: Record<NonNullable<TrialBookingView["timeSlot"]>, string> = {
    anytime: "Anytime (flexible)",
    early_morning: "Early morning (5am – 8am)",
    morning: "Morning (6am – 12pm)",
    afternoon: "Afternoon (12pm – 5pm)",
    evening: "Evening (5pm – 10pm)",
    late_evening: "Late evening (8pm – 11pm)",
  };
  return labels[slot] ?? slot;
}

function formatLearner(type: TrialBookingView["learnerType"]) {
  if (type === "child") return "Child (under 12)";
  if (type === "teen") return "Teen (12–17)";
  return "Adult";
}

function nextActions(status: TrialBookingStatus): { label: string; status: TrialBookingStatus }[] {
  switch (status) {
    case "new":
      return [{ label: "Mark contacted", status: "contacted" }];
    case "contacted":
      return [{ label: "Mark scheduled", status: "scheduled" }];
    case "scheduled":
      return [{ label: "Mark closed", status: "closed" }];
    default:
      return [];
  }
}

export function AdminTrialBookingsPage() {
  const [filter, setFilter] = useState<Filter>("new");
  const status = filter === "all" ? undefined : filter;
  const { data: bookings = [], isLoading } = useAdminTrialBookings(status);
  const updateStatus = useUpdateTrialBookingStatus();

  const newCount =
    filter === "new" ? bookings.length : bookings.filter((b) => b.status === "new").length;

  const pagination = usePaginatedList(bookings, {
    resetDeps: [filter],
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Trial Bookings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Free trial requests from the public website — contact via WhatsApp within 24 hours
        </p>
      </div>

      {filter === "new" && newCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            {newCount} new lead{newCount === 1 ? "" : "s"} awaiting contact
          </p>
        </Card>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "new" as const, label: "New" },
            { id: "contacted" as const, label: "Contacted" },
            { id: "scheduled" as const, label: "Scheduled" },
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
        <PageLoading label="Loading trial bookings…" />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No trial bookings in this view"
          description="Leads appear here when visitors submit the form on your website."
        />
      ) : (
        <>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pagination.paginatedItems.map((booking) => {
            const wa = waMeUrlFromRaw(
              booking.whatsapp,
              booking.country,
              trialLeadFollowUpMessage(booking.parentName)
            );
            const actions = nextActions(booking.status);

            return (
              <Card
                key={booking._id}
                className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-primary-dark">{booking.parentName}</p>
                  <p className="text-xs text-zinc-500">{formatLearner(booking.learnerType)}</p>
                </div>

                <div className="flex flex-col gap-1 text-sm text-zinc-600">
                  {booking.email ? (
                    <a
                      href={`mailto:${booking.email}`}
                      className="inline-flex items-center gap-2 hover:text-primary-dark"
                    >
                      <Mail className="size-4 shrink-0 text-zinc-400" />
                      {booking.email}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <Mail className="size-4 shrink-0" />
                      No email provided
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-zinc-400" />
                    {booking.whatsapp}
                  </span>
                  <WhatsAppLinkButton href={wa} label="Send WhatsApp" size="sm" />
                </div>

                <ul className="space-y-1 text-xs text-zinc-500">
                  {booking.country ? <li>Country: {booking.country}</li> : null}
                  {booking.timeSlot ? <li>Preferred time: {formatTimeSlot(booking.timeSlot)}</li> : null}
                  {booking.preferredDays.length > 0 ? (
                    <li>Days: {booking.preferredDays.join(", ")}</li>
                  ) : null}
                  {booking.timezone ? <li>Timezone: {booking.timezone}</li> : null}
                  {booking.teacherPreference !== "any" ? (
                    <li>Teacher: {booking.teacherPreference}</li>
                  ) : null}
                  {booking.courseSlug ? (
                    <li>Course: {booking.courseSlug.replace(/-/g, " ")}</li>
                  ) : null}
                  {booking.source ? <li>Source: {booking.source}</li> : null}
                </ul>

                {actions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {actions.map((action) => (
                      <Button
                        key={action.status}
                        type="button"
                        onClick={() =>
                          updateStatus.mutate({ id: booking._id, status: action.status })
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
        <Pagination pagination={pagination} itemLabel="bookings" />
        </>
      )}
    </PageContainer>
  );
}
