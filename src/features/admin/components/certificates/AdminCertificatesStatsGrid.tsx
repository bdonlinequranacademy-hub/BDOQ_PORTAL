import {
  Award,
  BadgeCheck,
  CalendarPlus,
  FileCheck2,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type ICertificateStats,
} from "@/features/admin/components/certificates/adminCertificatesUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminCertificatesStatsGridProps {
  stats: ICertificateStats;
}

export function AdminCertificatesStatsGrid({
  stats,
}: IAdminCertificatesStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
      <StatCard
        label={t("admin.certificates.statsTotal")}
        value={stats.total}
        icon={<Award className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.thisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.thisMonth) })
            : t("admin.certificates.statsTotal")
        }
      />
      <StatCard
        label={t("admin.certificates.statsIssued")}
        value={stats.issued}
        icon={<FileCheck2 className="size-5 text-sky-600" />}
        iconBg="bg-sky-100"
        hint={
          stats.thisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.thisMonth) })
            : t("admin.certificates.historyTitle")
        }
      />
      <StatCard
        label={t("admin.certificates.statsWithBadge")}
        value={stats.withBadge}
        icon={<BadgeCheck className="size-5 text-gold-dark" />}
        iconBg="bg-gold/20"
        hint={pctOfTotal(stats.withBadge, stats.total, t)}
      />
      <StatCard
        label={t("admin.certificates.statsThisMonth")}
        value={stats.thisMonth}
        icon={<CalendarPlus className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={t("admin.cms.shared.statThisMonth")}
      />
    </div>
  );
}
