import { useMemo, useState } from "react";
import { Search, UserMinus, UserPlus, Users } from "lucide-react";
import type { AdminUser, PopulatedUserRef } from "@/types/models";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { formControlClass } from "@/lib/formControl";

interface ClassEnrollmentPanelProps {
  enrolled: PopulatedUserRef[];
  available: AdminUser[];
  allStudents: AdminUser[];
  onAdd: (studentId: string) => void;
  onRemove: (studentId: string, name: string) => void;
  adding?: boolean;
}

export function ClassEnrollmentPanel({
  enrolled,
  available,
  allStudents,
  onAdd,
  onRemove,
  adding,
}: ClassEnrollmentPanelProps) {
  const [rosterSearch, setRosterSearch] = useState("");
  const [pickStudent, setPickStudent] = useState("");
  const [addSearch, setAddSearch] = useState("");

  const metaById = useMemo(
    () => new Map(allStudents.map((s) => [s.id, s])),
    [allStudents]
  );

  const filteredEnrolled = enrolled.filter((s) => {
    const q = rosterSearch.trim().toLowerCase();
    if (!q) return true;
    const meta = metaById.get(s._id);
    return (
      s.name.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      meta?.studentId?.toLowerCase().includes(q)
    );
  });

  const filteredAvailable = available.filter((s) => {
    const q = addSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q)
    );
  });

  function handleAdd() {
    if (!pickStudent) return;
    onAdd(pickStudent);
    setPickStudent("");
    setAddSearch("");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-zinc-100 bg-zinc-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-navy/10">
            <Users className="size-4 text-navy" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-navy">Student roster</h2>
            <p className="text-xs text-zinc-500">
              {enrolled.length} enrolled · {available.length} available to add
            </p>
          </div>
        </div>
        {enrolled.length > 2 ? (
          <div className="relative mt-2 sm:mt-0 sm:w-56">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              className={`${formControlClass} py-2 pl-9 text-sm`}
              placeholder="Search roster…"
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
            />
          </div>
        ) : null}
      </div>

      <div className="border-b border-zinc-100 bg-gold/5 p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
          <UserPlus className="size-4 text-gold-dark" />
          Add student to this class
        </p>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              className={`${formControlClass} py-2.5 pl-9 text-sm`}
              placeholder="Search students by name, email, or ID…"
              value={addSearch}
              onChange={(e) => {
                setAddSearch(e.target.value);
                setPickStudent("");
              }}
            />
          </div>
          <select
            value={pickStudent}
            onChange={(e) => setPickStudent(e.target.value)}
            className={`${formControlClass} lg:min-w-[220px] text-sm`}
          >
            <option value="">
              {filteredAvailable.length === 0 ? "No students available" : "Select student…"}
            </option>
            {filteredAvailable.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.studentId ? ` · ${s.studentId}` : ""}
              </option>
            ))}
          </select>
          <Button
            onClick={handleAdd}
            disabled={!pickStudent || adding}
            className="rounded-xl bg-navy px-5 text-white lg:shrink-0"
          >
            {adding ? "Adding…" : "Add to class"}
          </Button>
        </div>
      </div>

      <div className="p-5">
        {enrolled.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
            <Users className="mx-auto size-8 text-zinc-300" />
            <p className="mt-3 font-semibold text-navy">No students enrolled yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Search and add students using the form above.
            </p>
          </div>
        ) : filteredEnrolled.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">No students match your search.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filteredEnrolled.map((s) => {
              const meta = metaById.get(s._id);
              const studentId = s.studentId ?? meta?.studentId;
              const country = s.country ?? meta?.country;
              const timezone = s.timezone ?? meta?.timezone;
              return (
                <li
                  key={s._id}
                  className="group flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-4 transition hover:border-gold/25 hover:shadow-sm"
                >
                  <UserInitialAvatar name={s.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy">{s.name}</p>
                    <p className="truncate text-xs text-zinc-500">{s.email ?? meta?.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {studentId ? (
                        <span className="rounded-md bg-navy/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy">
                          {studentId}
                        </span>
                      ) : null}
                      <CountryLabel
                        country={country}
                        className="text-xs text-zinc-500"
                        showFallback={false}
                      />
                      {timezone ? (
                        <span className="text-[10px] text-zinc-400">{timezone}</span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(s._id, s.name)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-2 py-1.5 text-xs font-semibold text-red-600 opacity-80 transition hover:border-red-100 hover:bg-red-50 hover:opacity-100 group-hover:opacity-100"
                    aria-label={`Remove ${s.name} from class`}
                  >
                    <UserMinus className="size-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
