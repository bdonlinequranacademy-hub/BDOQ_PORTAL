import { Award, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import type { StudentProgressRecord } from "@/types/models";
import { classTitle } from "@/lib/utils/class";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

type TimelineKind = "progress" | "milestone";

interface TimelineEvent {
  id: string;
  date: Date;
  kind: TimelineKind;
  title: string;
  detail: string;
  badge?: string;
}

function buildTimelineEvents(
  records: StudentProgressRecord[],
  t: (key: string, params?: Record<string, string>) => string
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const record of records) {
    if (!record.updatedAt) continue;
    const surahCount = record.surahsCompleted?.length ?? 0;
    const curriculumText = record.curriculumLabels?.program
      ? formatCurriculumPath(record.curriculumLabels)
      : "";
    const baseDetail =
      surahCount > 0
        ? t(
            surahCount === 1 ? "student.timelineTajweedDetailSingle" : "student.timelineTajweedDetail",
            { score: String(record.tajweedScore), count: String(surahCount) }
          )
        : t("student.timelineTajweedUpdated", { score: String(record.tajweedScore) });
    events.push({
      id: `progress-${record._id}`,
      date: new Date(record.updatedAt),
      kind: "progress",
      title: record.class ? classTitle(record.class) : t("student.progressUpdate"),
      detail: curriculumText ? `${curriculumText} · ${baseDetail}` : baseDetail,
      badge: `${record.tajweedScore}%`,
    });

    if (surahCount >= 5) {
      events.push({
        id: `milestone-surahs-${record._id}`,
        date: new Date(record.updatedAt),
        kind: "milestone",
        title: t("student.memorizationMilestone"),
        detail: t("student.timelineSurahsInClass", {
          count: String(surahCount),
          className: record.class ? classTitle(record.class) : t("student.timelineYourClass"),
        }),
        badge: `${surahCount}`,
      });
    }

    if (record.tajweedScore >= 80) {
      events.push({
        id: `milestone-tajweed-${record._id}`,
        date: new Date(record.updatedAt),
        kind: "milestone",
        title: t("student.strongTajweed"),
        detail: t("student.timelineTajweedUpdated", { score: String(record.tajweedScore) }),
        badge: `${record.tajweedScore}%`,
      });
    }
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
}

const kindMeta: Record<TimelineKind, { icon: LucideIcon; accent: string }> = {
  progress: { icon: TrendingUp, accent: "text-primary bg-[#EEF2F8]" },
  milestone: { icon: Award, accent: "text-emerald-600 bg-emerald-50" },
};

interface ProgressTimelineProps {
  records: StudentProgressRecord[];
  isLoading?: boolean;
}

export function ProgressTimeline({ records, isLoading }: ProgressTimelineProps) {
  const { t, locale } = usePortalTranslation();
  const dateLocale = locale === "bn" ? "bn-BD" : undefined;

  if (isLoading) {
    return <CardSkeleton lines={4} />;
  }

  const events = buildTimelineEvents(records, t);

  if (events.length === 0) {
    return (
      <Card className="flex flex-col gap-2 rounded-2xl border border-dashed border-portal p-5">
        <p className="text-sm font-semibold text-portal-heading">
          {t("student.progressHistoryMilestones")}
        </p>
        <p className="text-sm text-portal-muted">{t("student.timelineEmptyDesc")}</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
      <div>
        <p className="font-bold text-portal-heading">{t("student.progressHistoryMilestones")}</p>
        <p className="text-xs text-portal-muted">{t("student.recentUpdatesFromClasses")}</p>
      </div>

      <ol className="relative flex flex-col gap-0">
        {events.map((event, index) => {
          const { icon: Icon, accent } = kindMeta[event.kind];
          const isLast = index === events.length - 1;

          return (
            <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[1.125rem] top-10 h-[calc(100%-1.5rem)] w-px bg-portal-border"
                  aria-hidden
                />
              ) : null}
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl ${accent}`}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-portal-heading">{event.title}</p>
                  <time
                    className="shrink-0 text-xs text-portal-muted"
                    dateTime={event.date.toISOString()}
                  >
                    {event.date.toLocaleDateString(dateLocale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <p className="mt-1 text-sm text-portal-muted">{event.detail}</p>
                {event.badge ? (
                  <span className="mt-2 inline-block rounded-full bg-portal-muted px-2.5 py-0.5 text-xs font-medium text-portal-heading">
                    {event.badge}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
