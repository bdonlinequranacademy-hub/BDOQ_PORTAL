import { useEffect, useState } from "react";
import {
  Hand,
  Lock,
  LockOpen,
  MessageSquare,
  Play,
  Square,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ClassroomParticipant, ClassroomSessionSnapshot } from "@/types/classroom.types";

function ClassTimer({ startedAt }: { startedAt?: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt) {
      setElapsed(0);
      return;
    }
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return (
    <span className="tabular-nums text-sm font-bold text-navy">
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}

interface ClassroomControlsProps {
  connected: boolean;
  session: ClassroomSessionSnapshot | null;
  isTeacher: boolean;
  isStudent: boolean;
  observeOnly?: boolean;
  handRaised: boolean;
  raisedHands: ClassroomParticipant[];
  readOnly: boolean;
  onStartClass: () => void;
  onEndClass: () => void;
  onToggleLock: () => void;
  onClearBoard: () => void;
  onToggleHand: () => void;
  onNotify: (message: string, targetUserId?: string) => void;
}

export function ClassroomControls({
  connected,
  session,
  isTeacher,
  isStudent,
  observeOnly = false,
  handRaised,
  raisedHands,
  readOnly,
  onStartClass,
  onEndClass,
  onToggleLock,
  onClearBoard,
  onToggleHand,
  onNotify,
}: ClassroomControlsProps) {
  const [message, setMessage] = useState("");
  const isLive = session?.status === "live";

  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              connected ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {connected ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {connected ? "Synced" : "Connecting…"}
          </span>
          {isLive ? (
            <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold-dark">
              LIVE
            </span>
          ) : (
            <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-semibold text-navy/60">
              {session?.status ?? "waiting"}
            </span>
          )}
          <ClassTimer startedAt={isLive ? session?.startedAt : undefined} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isTeacher ? (
            <>
              {!isLive ? (
                <Button type="button" className="h-9 gap-1.5 px-3 text-xs" onClick={onStartClass}>
                  <Play className="size-3.5" />
                  Start class
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="danger"
                  className="h-9 gap-1.5 px-3 text-xs"
                  onClick={onEndClass}
                >
                  <Square className="size-3.5" />
                  End class
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                className="h-9 gap-1.5 px-3 text-xs"
                onClick={onToggleLock}
              >
                {session?.whiteboardLocked ? (
                  <Lock className="size-3.5" />
                ) : (
                  <LockOpen className="size-3.5" />
                )}
                {session?.whiteboardLocked ? "Unlock board" : "Lock students"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-9 gap-1.5 border border-navy/15 px-3 text-xs text-navy"
                onClick={onClearBoard}
              >
                <Trash2 className="size-3.5" />
                Clear all
              </Button>
            </>
          ) : null}

          {isStudent ? (
            <Button
              type="button"
              variant={handRaised ? "secondary" : "ghost"}
              className={`h-9 gap-1.5 px-3 text-xs ${handRaised ? "" : "border border-navy/15 text-navy"}`}
              onClick={onToggleHand}
            >
              <Hand className="size-3.5" />
              {handRaised ? "Hand raised" : "Raise hand"}
            </Button>
          ) : null}
        </div>
      </div>

      {readOnly && (isStudent || observeOnly) ? (
        <p className="mt-2 text-xs text-gold-dark">
          {observeOnly
            ? "Observer mode — you can watch but not change the board."
            : "Teacher locked the whiteboard — you can watch but not draw."}
        </p>
      ) : null}

      {isTeacher && raisedHands.length > 0 ? (
        <div className="mt-3 rounded-xl bg-cream/60 p-2.5">
          <p className="mb-1.5 text-xs font-bold text-navy">Raised hands</p>
          <div className="flex flex-wrap gap-2">
            {raisedHands.map((p) => (
              <button
                key={p.userId}
                type="button"
                onClick={() => onNotify(`Yes ${p.displayName}?`, p.userId)}
                className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-navy shadow-sm"
              >
                <Hand className="size-3.5 text-gold" />
                {p.displayName}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isTeacher ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onNotify(message);
            setMessage("");
          }}
        >
          <div className="relative min-w-0 flex-1">
            <MessageSquare className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message to the class…"
              className="h-10 w-full rounded-xl border border-navy/15 bg-white pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" className="h-10 shrink-0 px-4 text-xs">
            Send
          </Button>
        </form>
      ) : null}
    </div>
  );
}
