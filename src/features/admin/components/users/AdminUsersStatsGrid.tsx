import {
  GraduationCap,
  Shield,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { displayRole } from "@/lib/assignableRoles";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AdminUser, Role } from "@/types/models";

interface IAdminUsersStatsGridProps {
  users: AdminUser[];
  isLoading?: boolean;
}

function countByRole(users: AdminUser[], role: Role): number {
  return users.filter((user) => displayRole(user.role) === role).length;
}

function joinedThisMonth(users: AdminUser[]): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return users.filter((user) => {
    if (!user.createdAt) return false;
    return new Date(user.createdAt) >= monthStart;
  }).length;
}

export function AdminUsersStatsGrid({ users, isLoading }: IAdminUsersStatsGridProps) {
  const { t, role, formatNumber } = usePortalTranslation();
  const monthCount = joinedThisMonth(users);
  const monthHint =
    monthCount > 0
      ? t("admin.users.joinedThisMonth", { count: formatNumber(monthCount) })
      : t("admin.users.noChangeThisMonth");

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.users.totalUsers")}
        value={isLoading ? "—" : users.length}
        icon={<Users className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={monthHint}
      />
      <StatCard
        label={t("admin.users.students")}
        value={isLoading ? "—" : countByRole(users, "student")}
        icon={<GraduationCap className="size-5 text-teal" />}
        iconBg="bg-teal/10"
        hint={t("admin.users.roleAccounts", { role: role("student") })}
      />
      <StatCard
        label={t("admin.users.teachers")}
        value={isLoading ? "—" : countByRole(users, "teacher")}
        icon={<UserCog className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={t("admin.users.roleAccounts", { role: role("teacher") })}
      />
      <StatCard
        label={t("admin.users.admins")}
        value={isLoading ? "—" : countByRole(users, "admin")}
        icon={<Shield className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={t("admin.users.roleAccounts", { role: role("admin") })}
      />
      <StatCard
        label={t("admin.users.superAdmins")}
        value={isLoading ? "—" : countByRole(users, "super_admin")}
        icon={<ShieldCheck className="size-5 text-fuchsia-600" />}
        iconBg="bg-fuchsia-100"
        className="col-span-2 xl:col-span-1"
        hint={t("admin.users.roleAccounts", { role: role("super_admin") })}
      />
    </div>
  );
}
