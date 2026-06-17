import type { ReactNode } from "react";
import { ExternalLink, Video } from "lucide-react";
import { ClassScheduleChip } from "@/components/classes/ClassScheduleChip";
import type { ScheduleLike } from "@/lib/utils/class";

interface ClassHeroProps {
  title: string;
  description?: string;
  teacherName?: string;
  schedule?: ScheduleLike;
  meetingLink?: string;
  badge?: ReactNode;
  meta?: ReactNode;
}

export function ClassHero({
  title,
  description,
  teacherName,
  schedule,
  meetingLink,
  badge,
  meta,
}: ClassHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-[#0a3a7a] p-6 text-white shadow-lg">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 right-12 size-20 rounded-full bg-gold/10" />
      <div className="relative flex flex-col gap-3">
        {badge}
        <h2 className="text-2xl font-bold leading-tight">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-white/75">{description}</p>
        ) : null}
        {teacherName ? (
          <p className="text-sm text-white/85">
            <span className="text-white/60">Teacher · </span>
            {teacherName}
          </p>
        ) : null}
        {meta}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <ClassScheduleChip schedule={schedule} variant="onDark" />
        </div>
        {meetingLink ? (
          <a
            href={meetingLink}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/25"
          >
            <Video className="size-4" />
            Join class meeting
            <ExternalLink className="size-3.5 opacity-70" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
