import { Eye, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { displayRole } from "@/lib/assignableRoles";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import type { AdminUser, Role } from "@/types/models";

const ROLE_COLORS: Record<Role, string> = {
  student: "bg-teal-100 text-teal-700",
  teacher: "bg-blue-100 text-blue-700",
  admin: "bg-violet-100 text-violet-700",
  super_admin: "bg-fuchsia-100 text-fuchsia-800",
};

function userHandle(user: AdminUser): string {
  const local = user.email.split("@")[0] ?? user.name;
  return `@${local.replace(/\s+/g, "").toLowerCase()}`;
}

interface IAdminUsersTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  canManage: (targetRole: Role) => boolean;
}

export interface IExportUsersHelpers {
  t: (key: string, params?: Record<string, string>) => string;
  role: (roleKey: string) => string;
  formatDate: (iso: string) => string;
  statusLabel: (status: string) => string;
}

export function AdminUsersTable({
  users,
  onView,
  onEdit,
  onDeactivate,
  canManage,
}: IAdminUsersTableProps) {
  const { t, statusLabel, dynamicLabel, role, formatDate } = usePortalTranslation();

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("labels.user")}</th>
              <th className="px-5 py-3.5">{t("labels.email")}</th>
              <th className="px-5 py-3.5">{t("labels.role")}</th>
              <th className="px-5 py-3.5">{t("tables.status")}</th>
              <th className="px-5 py-3.5">{t("labels.joined_on")}</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal">
            {users.map((user) => {
              const shownRole = displayRole(user.role);
              const manageable = canManage(user.role);
              const isActive = user.isActive !== false;

              return (
                <tr
                  key={user.id}
                  className={cn(
                    "transition hover:bg-portal-muted/25",
                    !isActive && "opacity-70"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name}
                        gender={user.gender}
                        size="sm"
                        shape="circle"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-portal-heading">
                          <button
                            type="button"
                            onClick={() => onView(user)}
                            className="text-left transition hover:text-primary"
                          >
                            {user.name}
                          </button>
                        </p>
                        <p className="truncate text-xs text-portal-muted">{userHandle(user)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-muted">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        ROLE_COLORS[shownRole]
                      )}
                    >
                      {role(user.role)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-portal-heading">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          isActive ? "bg-emerald-500" : "bg-red-500"
                        )}
                        aria-hidden
                      />
                      {statusLabel(isActive ? "active" : "inactive")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-muted">
                    {user.createdAt ? formatDate(user.createdAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      {manageable ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onView(user)}
                            className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
                            aria-label={t("admin.users.viewUser", { name: user.name })}
                            title={t("admin.common.viewProfile")}
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(user)}
                            className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
                            aria-label={t("admin.users.editUserNamed", { name: user.name })}
                            title={t("admin.common.editUser")}
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeactivate(user)}
                            className="rounded-lg p-2 text-portal-muted transition hover:bg-red-50 hover:text-red-600"
                            aria-label={
                              isActive
                                ? t("admin.users.deactivateUserNamed", { name: user.name })
                                : t("admin.users.deleteUserNamed", { name: user.name })
                            }
                            title={
                              isActive
                                ? t("admin.common.deactivateUser")
                                : t("admin.common.deleteUser")
                            }
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </>
                      ) : (
                        <span className="px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-portal-muted">
                          {t("admin.users.protected")}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-portal lg:hidden">
        {users.map((user) => {
          const shownRole = displayRole(user.role);
          const manageable = canManage(user.role);
          const isActive = user.isActive !== false;

          return (
            <div
              key={user.id}
              className={cn("flex flex-col gap-3 p-4", !isActive && "opacity-70")}
            >
              <div className="flex items-start gap-3">
                <UserAvatar name={user.name} gender={user.gender} size="sm" shape="circle" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-portal-heading">{user.name}</p>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        ROLE_COLORS[shownRole]
                      )}
                    >
                      {role(user.role)}
                    </span>
                  </div>
                  <p className="text-xs text-portal-muted">{userHandle(user)}</p>
                  <p className="mt-1 text-sm text-portal-muted">{user.email}</p>
                  {user.gender ? (
                    <p className="text-[10px] text-portal-muted">{dynamicLabel(user.gender)}</p>
                  ) : null}
                  {shownRole === "student" && (user.timezone || user.country) ? (
                    <p className="text-[10px] text-portal-muted">
                      {user.timezone ?? ""}
                      {user.timezone && user.country ? " · " : ""}
                      {user.country ? formatCountryWithFlag(user.country) : ""}
                    </p>
                  ) : null}
                  {shownRole === "teacher" && user.country ? (
                    <p className="text-[10px] text-portal-muted">
                      {formatCountryWithFlag(user.country)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-portal-heading">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      isActive ? "bg-emerald-500" : "bg-red-500"
                    )}
                    aria-hidden
                  />
                  {statusLabel(isActive ? "active" : "inactive")}
                </span>
                <span className="text-portal-muted">
                  {user.createdAt ? formatDate(user.createdAt) : "—"}
                </span>
              </div>

              <div className="flex justify-end gap-1">
                {manageable ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="rounded-lg p-2 text-primary hover:bg-portal-muted/50"
                      aria-label={t("admin.users.viewUser", { name: user.name })}
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-lg p-2 text-primary hover:bg-portal-muted/50"
                      aria-label={t("admin.users.editUserNamed", { name: user.name })}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeactivate(user)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label={
                        isActive
                          ? t("admin.users.deactivateUserNamed", { name: user.name })
                          : t("admin.users.deleteUserNamed", { name: user.name })
                      }
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-portal-muted">
                    {t("admin.users.protected")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function exportUsersFile(
  users: AdminUser[],
  format: "csv" | "excel",
  helpers: IExportUsersHelpers
): void {
  const { t, role, formatDate, statusLabel } = helpers;
  const headers = [
    t("labels.user"),
    t("labels.email"),
    t("labels.role"),
    t("tables.status"),
    t("labels.joined_on"),
  ];
  const rows = users.map((user) => [
    user.name,
    user.email,
    role(user.role),
    statusLabel(user.isActive === false ? "inactive" : "active"),
    user.createdAt ? formatDate(user.createdAt) : "—",
  ]);

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const delimiter = format === "excel" ? "\t" : ",";
  const content = [headers, ...rows]
    .map((row) => row.map((cell) => escape(cell)).join(delimiter))
    .join("\n");

  const mime =
    format === "excel"
      ? "application/vnd.ms-excel;charset=utf-8;"
      : "text/csv;charset=utf-8;";
  const extension = format === "excel" ? "xls" : "csv";

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${t("admin.users.exportFileName")}-${new Date().toISOString().slice(0, 10)}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}
