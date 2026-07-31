import {
  FileSpreadsheet,
  RotateCcw,
  Save,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import {
  computeCurriculumStats,
  exportCurriculumFile,
} from "@/features/admin/components/curriculum/adminCurriculumUtils";
import { cn } from "@/lib/utils/cn";

const SEGMENT_COLORS = [
  "#32C991",
  "#0D9488",
  "#D4A853",
  "#6366F1",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#8B5CF6",
];

interface IAdminCurriculumOverviewProps {
  tree: CurriculumNode[];
}

export function AdminCurriculumOverview({ tree }: IAdminCurriculumOverviewProps) {
  const { t, formatNumber } = usePortalTranslation();

  const segments = tree
    .map((program) => ({
      label: program.label,
      count: program.children?.length ?? 0,
    }))
    .filter((segment) => segment.count > 0);

  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  if (total === 0) {
    return (
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.curriculum.overviewTitle")}</h2>
        <p className="mt-2 text-sm text-portal-muted">{t("admin.curriculum.noSectionsConfigured")}</p>
      </Card>
    );
  }

  let cursor = 0;
  const gradientParts = segments.map((segment, index) => {
    const pct = (segment.count / total) * 100;
    const start = cursor;
    cursor += pct;
    return `${SEGMENT_COLORS[index % SEGMENT_COLORS.length]} ${start}% ${cursor}%`;
  });

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.curriculum.overviewTitle")}</h2>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div
          className="relative size-36 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}
          aria-hidden
        >
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-2xl font-bold text-portal-heading">{formatNumber(total)}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              {t("admin.curriculum.sectionsLabel")}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {segments.map((segment, index) => (
            <div key={segment.label} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                />
                <span className="truncate text-portal-heading">{segment.label}</span>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-portal-muted">
                {formatNumber(Math.round((segment.count / total) * 100))}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface IAdminCurriculumActivityProps {
  tree: CurriculumNode[];
  dirty: boolean;
}

export function AdminCurriculumActivity({ tree, dirty }: IAdminCurriculumActivityProps) {
  const { t, formatNumber } = usePortalTranslation();
  const stats = computeCurriculumStats(tree);
  const items = [
    {
      id: "programs",
      text: t("admin.curriculum.programsLoaded", { count: formatNumber(stats.programs) }),
      tone: "text-primary",
    },
    {
      id: "sections",
      text: t("admin.curriculum.sectionsAcrossPrograms", { count: formatNumber(stats.sections) }),
      tone: "text-teal-700",
    },
    {
      id: "topics",
      text: t("admin.curriculum.topicsSurahsConfigured", {
        count: formatNumber(stats.topics + stats.surahs),
      }),
      tone: "text-amber-700",
    },
    {
      id: "save",
      text: dirty ? t("admin.curriculum.unsavedChangesHint") : t("admin.curriculum.allChangesSaved"),
      tone: dirty ? "text-red-600" : "text-emerald-700",
    },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.curriculum.recentActivity")}</h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-portal/80 bg-portal-muted/30 px-3 py-2.5"
          >
            <span className={cn("mt-1 size-2 shrink-0 rounded-full bg-current", item.tone)} />
            <p className="text-sm text-portal-heading">{item.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface IAdminCurriculumQuickActionsProps {
  dirty: boolean;
  saving: boolean;
  resetting: boolean;
  onSave: () => void;
  onReset: () => void;
  onExportCsv: () => void;
}

export function AdminCurriculumQuickActions({
  dirty,
  saving,
  resetting,
  onSave,
  onReset,
  onExportCsv,
}: IAdminCurriculumQuickActionsProps) {
  const { t } = usePortalTranslation();

  const actions = [
    {
      id: "csv",
      label: t("filters.exportCsv"),
      icon: FileSpreadsheet,
      onClick: onExportCsv,
      disabled: false,
    },
    {
      id: "reset",
      label: t("admin.curriculum.resetDefaults"),
      icon: RotateCcw,
      onClick: onReset,
      disabled: resetting,
    },
    {
      id: "save",
      label: saving ? t("admin.curriculum.saving") : t("admin.curriculum.saveChanges"),
      icon: Save,
      onClick: onSave,
      disabled: !dirty || saving,
    },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.curriculum.quickActions")}</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className="flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-surface p-3.5 text-left transition hover:border-primary/30 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <action.icon className="size-4 text-primary" aria-hidden />
            <span className="text-sm font-semibold text-portal-heading">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

export function exportCurriculumCsv(tree: CurriculumNode[]): void {
  exportCurriculumFile(tree, "csv");
}
