import {
  BookOpen,
  Clock,
  FolderTree,
  Layers,
  ScrollText,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
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
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label="Total Programs"
        value={isLoading ? "—" : stats.programs}
        icon={<BookOpen className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint="Active learning tracks"
      />
      <StatCard
        label="Total Sections"
        value={isLoading ? "—" : stats.sections}
        icon={<FolderTree className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint="Organized units"
      />
      <StatCard
        label="Total Topics"
        value={isLoading ? "—" : stats.topics}
        icon={<Layers className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        hint="Lessons & modules"
      />
      <StatCard
        label="Surahs Configured"
        value={isLoading ? "—" : stats.surahs}
        icon={<ScrollText className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint="Hifz & recitation tracks"
      />
      <StatCard
        label="Save Status"
        value={dirty ? "Draft" : "Saved"}
        icon={<Clock className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        className="col-span-2 xl:col-span-1"
        hint={
          dirty
            ? "Unsaved changes pending"
            : `${stats.withBengali} items with Bengali labels`
        }
      />
    </div>
  );
}
