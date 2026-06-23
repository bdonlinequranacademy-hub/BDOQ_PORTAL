import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Classroom } from "@/components/classroom/Classroom";
import { PageContainer } from "@/components/layout/PageContainer";

export function AdminObserveClassroomPage() {
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");

  return (
    <PageContainer>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/live-classes"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-dark"
          >
            <ArrowLeft className="size-3.5" />
            Back to Live Classes
          </Link>
          <h1 className="text-2xl font-bold text-navy">Observe classroom</h1>
          <p className="mt-1 text-sm text-zinc-500">
            View-only — watch the whiteboard and optional video without changing the session.
          </p>
          {room ? (
            <p className="mt-1 font-mono text-xs text-zinc-400">Room: {room}</p>
          ) : null}
        </div>
      </div>
      <Classroom observeOnly />
    </PageContainer>
  );
}
