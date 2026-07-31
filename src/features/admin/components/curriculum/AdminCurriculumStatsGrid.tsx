import {
  BookOpen,
  Clock,
  FolderTree,
  Layers,
  ScrollText,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { ICurriculumStats } from "@/features/admin/components/curriculum/adminCurriculumUtils";

interface IAdminCurriculumStatsGridProps {
  stats: ICurriculumStats;
  dirty: boolean;
  isLoading?: boolean;
}

export function AdminCurriculumStatsGrid({
  stats,
  dirty,
  isLoading,
}: IAdminCurriculumStatsGridProps) {
  const { t, dynamicLabel, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.curriculum.totalPrograms")}
        value={isLoading ? "—" : stats.programs}
        icon={<BookOpen className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.curriculum.activeLearningTracks")}
      />
      <StatCard
        label={t("admin.curriculum.totalSections")}
        value={isLoading ? "—" : stats.sections}
        icon={<FolderTree className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={t("admin.curriculum.organizedUnits")}
      />
      <StatCard
        label={t("admin.curriculum.totalTopics")}
        value={isLoading ? "—" : stats.topics}
        icon={<Layers className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        hint={t("admin.curriculum.lessonsModules")}
      />
      <StatCard
        label={t("admin.curriculum.surahsConfigured")}
        value={isLoading ? "—" : stats.surahs}
        icon={<ScrollText className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={t("admin.curriculum.hifzRecitationTracks")}
      />
      <StatCard
        label={t("admin.curriculum.saveStatus")}
        value={dirty ? dynamicLabel("draft") : dynamicLabel("saved")}
        icon={<Clock className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        className="col-span-2 xl:col-span-1"
        hint={
          dirty
            ? t("admin.curriculum.unsavedChanges")
            : t("admin.curriculum.itemsWithBengali", {
                count: formatNumber(stats.withBengali),
              })
        }
      />
    </div>
  );
}
