import { Hand, Lock, Radio, Users, Wifi, WifiOff } from "lucide-react";
import type { ClassroomParticipant, ClassroomSessionSnapshot } from "@/types/classroom.types";

interface LiveSessionPanelProps {
  session: ClassroomSessionSnapshot | null;
  connected: boolean;
  className?: string;
}

function roleLabel(role: string) {
  if (role === "teacher") return "Teacher";
  if (role === "student") return "Student";
  if (role === "admin" || role === "super_admin") return "Admin";
  return role;
}

function roleBadgeClass(role: string) {
  if (role === "teacher") return "bg-gold/15 text-gold-dark";
  if (role === "student") return "bg-[#EEF2F8] text-navy";
  return "bg-navy/10 text-navy/70";
}

export function LiveSessionPanel({ session, connected, className = "" }: LiveSessionPanelProps) {
  const participants = session?.participants ?? [];
  const teachers = participants.filter((p) => p.role === "teacher");
  const students = participants.filter((p) => p.role === "student");
  const observers = participants.filter(
    (p) => p.role === "admin" || p.role === "super_admin"
  );
  const raised = participants.filter((p) => p.handRaised);

  return (
    <aside
      className={`flex flex-col gap-4 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-navy/10 bg-navy px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-gold" />
            <p className="text-sm font-semibold">Live session</p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              connected ? "bg-emerald-500/20 text-emerald-100" : "bg-white/15 text-white/70"
            }`}
          >
            {connected ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {connected ? "Synced" : "Connecting"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-white/70">
          {session?.status === "live" ? "Class is live" : session?.status ?? "Waiting to start"}
          {session?.whiteboardLocked ? " · Board locked" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-cream/50 px-2 py-2 text-center">
            <p className="text-lg font-bold text-navy">{teachers.length}</p>
            <p className="text-[10px] font-semibold uppercase text-zinc-500">Teachers</p>
          </div>
          <div className="rounded-xl bg-cream/50 px-2 py-2 text-center">
            <p className="text-lg font-bold text-navy">{students.length}</p>
            <p className="text-[10px] font-semibold uppercase text-zinc-500">Students</p>
          </div>
          <div className="rounded-xl bg-cream/50 px-2 py-2 text-center">
            <p className="text-lg font-bold text-navy">{participants.length}</p>
            <p className="text-[10px] font-semibold uppercase text-zinc-500">Total</p>
          </div>
        </div>

        {session?.startedAt ? (
          <p className="text-xs text-zinc-500">
            Started {new Date(session.startedAt).toLocaleString()}
          </p>
        ) : null}

        {raised.length > 0 ? (
          <div className="rounded-xl bg-gold/10 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-navy">
              <Hand className="size-3.5 text-gold" />
              Raised hands
            </p>
            <div className="flex flex-wrap gap-1.5">
              {raised.map((p) => (
                <span
                  key={p.userId}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-navy shadow-sm"
                >
                  {p.displayName}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <ParticipantGroup title="Teachers" items={teachers} />
        <ParticipantGroup title="Students" items={students} />
        {observers.length > 0 ? (
          <ParticipantGroup title="Observers" items={observers} />
        ) : null}

        {participants.length === 0 ? (
          <p className="text-sm text-zinc-400">No one has joined this room yet.</p>
        ) : null}

        {session?.whiteboardLocked ? (
          <p className="flex items-center gap-1.5 text-xs text-gold-dark">
            <Lock className="size-3.5" />
            Students cannot draw on the board.
          </p>
        ) : null}
      </div>
    </aside>
  );
}

function ParticipantGroup({
  title,
  items,
}: {
  title: string;
  items: ClassroomParticipant[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-navy">
        <Users className="size-3.5" />
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((p) => (
          <li
            key={p.userId}
            className="flex items-center justify-between gap-2 rounded-lg border border-navy/10 px-2.5 py-2"
          >
            <span className="truncate text-sm font-medium text-navy">{p.displayName}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadgeClass(p.role)}`}
            >
              {roleLabel(p.role)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
