import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, RefreshCw } from "lucide-react";
import {
  useAdminAcademyRoutine,
  useAdminTeachers,
  useResyncAdminSchedule,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScheduleViewToggle, type ScheduleViewMode } from "@/components/schedule/ScheduleViewToggle";
import { SessionTimelineRow } from "@/components/schedule/SessionTimelineRow";
import { SessionScheduleTable } from "@/components/schedule/SessionScheduleTable";
import { formControlClass } from "@/lib/formControl";
import { groupSessionsByDay, sortSessionsForTable } from "@/lib/utils/schedule";
import { uniqueCountries, formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import type { SessionSlotView } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
export function AdminRoutinePage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ScheduleViewMode>("timeline");
  const [teacherId, setTeacherId] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const { data: teachers = [] } = useAdminTeachers();
  const { data: sessions = [], isLoading } = useAdminAcademyRoutine(
    teacherId || undefined
  );
  const resync = useResyncAdminSchedule();

  const countryOptions = useMemo(
    () =>
      uniqueCountries([
        ...sessions.map((s) => s.student.country),
        ...sessions.map((s) => s.teacher.country),
      ]),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    if (!countryFilter) return sessions;
    return sessions.filter(
      (s) =>
        s.student.country?.trim() === countryFilter ||
        s.teacher.country?.trim() === countryFilter
    );
  }, [sessions, countryFilter]);

  const grouped = groupSessionsByDay(filteredSessions);
  const tableSessions = useMemo(
    () => sortSessionsForTable(filteredSessions),
    [filteredSessions]
  );

  const teacherOptions = useMemo(
    () =>
      [...teachers]
        .filter((t) => t.role === "teacher")
        .sort((a, b) => a.name.localeCompare(b.name)),
    [teachers]
  );

  function handleViewClass(session: SessionSlotView) {
    navigate(`/admin/classes/${session.classId}`);
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Academy Routine</h1>
          <p className="mt-1 text-sm text-zinc-500">
            All active session slots — Saturday → Friday
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {filteredSessions.length > 0 ? (
            <ScheduleViewToggle value={view} onChange={setView} />
          ) : null}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className={`${formControlClass} w-full sm:w-44`}
          >
            <option value="">All countries</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {formatCountryWithFlag(country)}
              </option>
            ))}
          </select>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className={`${formControlClass} w-full sm:w-52`}
          >
            <option value="">All teachers</option>
            {teacherOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            disabled={resync.isPending}
            onClick={() => resync.mutate()}
            className="rounded-xl"
          >
            <RefreshCw className={`mr-2 size-4 ${resync.isPending ? "animate-spin" : ""}`} />
            {resync.isPending ? "Syncing…" : "Resync slots"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-[#C4922B]/12 px-4 py-3">
        <CalendarDays className="size-5 text-[#C4922B]" />
        <span className="text-sm font-semibold text-[#03214F]">
          {filteredSessions.length} active session{filteredSessions.length === 1 ? "" : "s"}
          {teacherId ? " for selected teacher" : " academy-wide"}
          {countryFilter ? ` · ${formatCountryWithFlag(countryFilter)}` : ""}
          · live timer only on today&apos;s sessions
        </span>
      </div>

      {isLoading ? (
        <PageLoading label="Loading routine…" />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No session slots"
          description={
            countryFilter
              ? "No sessions match this country filter. Try another country or clear filters."
              : "Assign students to classes with a schedule, then use Resync slots if needed."
          }
        />
      ) : view === "table" ? (
        <SessionScheduleTable
          sessions={tableSessions}
          routineView
          adminMode
          onViewClass={handleViewClass}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {grouped.map(({ day, sessions: daySessions }) =>
            daySessions.length === 0 ? null : (
              <section key={day} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#03214F]">
                    {day}
                  </h2>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                    {daySessions.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {daySessions.map((session) => (
                    <SessionTimelineRow
                      key={session._id}
                      session={session}
                      routineView
                      adminMode
                      onViewClass={handleViewClass}
                    />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      )}
    </PageContainer>
  );
}
