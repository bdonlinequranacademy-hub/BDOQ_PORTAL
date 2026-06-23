import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Radio, Users } from "lucide-react";
import { getRealtimeSocket } from "@/lib/realtime/socket";
import { buildClassroomRoomName } from "@/lib/utils/classroomRoom";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";

interface LiveClassSummary {
  sessionId: string;
  status: string;
  startedAt?: string;
  participantCount: number;
  teacherId?: string;
}

export function AdminLiveClassesPage() {
  const [sessions, setSessions] = useState<LiveClassSummary[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket: Awaited<ReturnType<typeof getRealtimeSocket>> = null;
    let cancelled = false;

    void (async () => {
      socket = await getRealtimeSocket();
      if (!socket || cancelled) return;

      setConnected(socket.connected);

      const onLive = (payload: { sessions: LiveClassSummary[] }) => {
        setSessions(payload.sessions ?? []);
      };

      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
      socket.on("admin:classroom:live", onLive);
    })();

    return () => {
      cancelled = true;
      socket?.off("admin:classroom:live");
    };
  }, []);

  return (
    <PageContainer>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Live Classes</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Monitor active classroom sessions in real time.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            connected ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {connected ? "Socket connected" : "Connecting…"}
        </span>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No live classes"
          description="When a teacher starts a class, it will appear here."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article
              key={session.sessionId}
              className="rounded-2xl border border-navy/10 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    session.status === "live"
                      ? "bg-gold/15 text-gold-dark"
                      : "bg-navy/5 text-navy/60"
                  }`}
                >
                  {session.status}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy">
                  <Users className="size-3.5" />
                  {session.participantCount}
                </span>
              </div>
              <h2 className="font-bold text-navy">{session.sessionId}</h2>
              {session.startedAt ? (
                <p className="mt-1 text-xs text-zinc-500">
                  Started {new Date(session.startedAt).toLocaleString()}
                </p>
              ) : null}
              <Link
                to={`/admin/live-classes/observe?room=${encodeURIComponent(session.sessionId)}`}
                className="mt-4 inline-flex rounded-xl bg-navy px-3 py-2 text-xs font-semibold text-white hover:bg-navy-500"
              >
                Observe
              </Link>
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-400">
        Demo room: {buildClassroomRoomName()}
      </p>
    </PageContainer>
  );
}
