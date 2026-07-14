import { Eye, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { displayRole, roleLabel } from "@/lib/assignableRoles";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { cn } from "@/lib/utils/cn";
import type { AdminUser, Role } from "@/types/models";

const ROLE_COLORS: Record<Role, string> = {
  student: "bg-teal-100 text-teal-700",
  teacher: "bg-blue-100 text-blue-700",
  admin: "bg-violet-100 text-violet-700",
  super_admin: "bg-fuchsia-100 text-fuchsia-800",
  parent: "bg-sky-100 text-sky-700",
};

function userHandle(user: AdminUser): string {
  const local = user.email.split("@")[0] ?? user.name;
  return `@${local.replace(/\s+/g, "").toLowerCase()}`;
}

function formatJoinedDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function genderLabel(gender?: "male" | "female") {
  if (gender === "female") return "Female";
  if (gender === "male") return "Male";
  return null;
}

interface IAdminUsersTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  canManage: (targetRole: Role) => boolean;
}

export function AdminUsersTable({
  users,
  onView,
  onEdit,
  onDeactivate,
  canManage,
}: IAdminUsersTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Joined On</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
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
                      {roleLabel(user.role)}
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
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-muted">
                    {formatJoinedDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      {manageable ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onView(user)}
                            className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
                            aria-label={`View ${user.name}`}
                            title="View profile"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(user)}
                            className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
                            aria-label={`Edit ${user.name}`}
                            title="Edit user"
                          >
                            <Pencil className="size-4" />
                          </button>
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => onDeactivate(user)}
                              className="rounded-lg p-2 text-portal-muted transition hover:bg-red-50 hover:text-red-600"
                              aria-label={`Deactivate ${user.name}`}
                              title="Deactivate user"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          ) : null}
                        </>
                      ) : (
                        <span className="px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-portal-muted">
                          Protected
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
                      {roleLabel(user.role)}
                    </span>
                  </div>
                  <p className="text-xs text-portal-muted">{userHandle(user)}</p>
                  <p className="mt-1 text-sm text-portal-muted">{user.email}</p>
                  {genderLabel(user.gender) ? (
                    <p className="text-[10px] text-portal-muted">{genderLabel(user.gender)}</p>
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
                  {isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-portal-muted">{formatJoinedDate(user.createdAt)}</span>
              </div>

              <div className="flex justify-end gap-1">
                {manageable ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="rounded-lg p-2 text-primary hover:bg-portal-muted/50"
                      aria-label={`View ${user.name}`}
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-lg p-2 text-primary hover:bg-portal-muted/50"
                      aria-label={`Edit ${user.name}`}
                    >
                      <Pencil className="size-4" />
                    </button>
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => onDeactivate(user)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label={`Deactivate ${user.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
                  </>
                ) : (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-portal-muted">
                    Protected
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

export function exportUsersFile(users: AdminUser[], format: "csv" | "excel"): void {
  const headers = ["Name", "Email", "Role", "Status", "Joined On"];
  const rows = users.map((user) => [
    user.name,
    user.email,
    roleLabel(user.role),
    user.isActive === false ? "Inactive" : "Active",
    formatJoinedDate(user.createdAt),
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
  link.download = `bdoq-users-${new Date().toISOString().slice(0, 10)}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}
