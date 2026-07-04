import { useState } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import {
  useAdminUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import {
  ASSIGNABLE_ROLES,
  assignableRolesFor,
  canManageUserAccount,
  displayRole,
  isSuperAdmin,
  roleLabel,
} from "@/lib/assignableRoles";
import { useAuthStore } from "@/stores/authStore";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { AdminCreateUserModal } from "@/features/admin/components/AdminCreateUserModal";
import { AdminEditUserModal } from "@/features/admin/components/AdminEditUserModal";
import type { CurriculumAssignment, Role } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";

const ROLE_COLORS: Record<Role, string> = {
  student: "bg-teal-100 text-teal-700",
  teacher: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
  super_admin: "bg-fuchsia-100 text-fuchsia-800",
  parent: "bg-teal-100 text-teal-700",
};

type RoleFilter = (typeof ASSIGNABLE_ROLES)[number] | "all";
type GenderFilter = "all" | "male" | "female";

function genderLabel(gender?: "male" | "female") {
  if (gender === "female") return "Female";
  if (gender === "male") return "Male";
  return null;
}

export function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const actorRole = currentUser?.role ?? "admin";
  const creatableRoles = assignableRolesFor(actorRole);
  const roleFilterOptions = isSuperAdmin(actorRole)
    ? (["all", ...ASSIGNABLE_ROLES] as const)
    : (["all", ...creatableRoles, "admin"] as const);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<(typeof ASSIGNABLE_ROLES)[number]>("student");
  const [editActive, setEditActive] = useState(true);
  const [editGender, setEditGender] = useState<"" | "male" | "female">("");
  const [editTimezone, setEditTimezone] = useState("Asia/Dhaka");
  const [editCountry, setEditCountry] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editCurriculumAssignments, setEditCurriculumAssignments] = useState<
    CurriculumAssignment[]
  >([]);

  const { data: curriculumTree = [] } = useCurriculumTree();

  const teacherGender =
    roleFilter === "teacher" && genderFilter !== "all" ? genderFilter : undefined;

  const { data: users = [], isLoading } = useAdminUsers(
    roleFilter === "all" ? undefined : roleFilter,
    teacherGender
  );
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser(editUserId ?? "");

  const editingUser = users.find((user) => user.id === editUserId) ?? null;

  function openEditUser(user: (typeof users)[number]) {
    setEditUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(displayRole(user.role) as (typeof ASSIGNABLE_ROLES)[number]);
    setEditActive(user.isActive !== false);
    setEditGender(user.gender ?? "");
    setEditTimezone(user.timezone ?? "Asia/Dhaka");
    setEditCountry(user.country ?? "");
    setEditWhatsapp(user.whatsapp ?? "");
    setEditCurriculumAssignments(user.curriculumAssignments ?? []);
  }

  function closeEditUser() {
    setEditUserId(null);
  }

  function handleDeactivate(user: (typeof users)[number]) {
    if (
      !window.confirm(
        `Deactivate ${user.name}? They will not be able to sign in until reactivated.`
      )
    ) {
      return;
    }
    deleteUser.mutate(user.id);
  }

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const pagination = usePaginatedList(filtered, {
    resetDeps: [search, roleFilter, genderFilter],
  });

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} users`}
        action={
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 rounded-xl bg-primary-dark text-white"
          >
            <Plus className="size-4" />
            Add User
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          className={`${formControlClass} py-3 pl-10`}
          placeholder="Search users…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {roleFilterOptions.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              roleFilter === role
                ? "bg-primary-dark text-white"
                : "border border-zinc-200 bg-white text-primary-dark"
            }`}
          >
            {role === "all" ? "all" : roleLabel(role as Role)}
          </button>
        ))}
      </div>

      {roleFilter === "teacher" ? (
        <div className="flex flex-wrap gap-2">
          {(["all", "female", "male"] as const).map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => setGenderFilter(gender)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                genderFilter === gender
                  ? "bg-[#C4922B] text-white"
                  : "border border-zinc-200 bg-white text-primary-dark"
              }`}
            >
              {gender === "all" ? "All teachers" : gender}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <PageLoading label="Loading users…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          description={
            search
              ? "Try a different name or email."
              : "No users match the selected filters."
          }
        />
      ) : (
        <>
        <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
          <div className="hidden md:grid md:grid-cols-[2fr_2fr_1fr_80px] md:gap-4 md:border-b md:border-zinc-100 md:bg-zinc-50 md:px-5 md:py-3 md:text-xs md:font-semibold md:uppercase md:tracking-wide md:text-zinc-500">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {pagination.paginatedItems.map((user) => {
              const shownRole = displayRole(user.role);
              const manageable = canManageUserAccount(actorRole, user.role);
              return (
                <div
                  key={user.id}
                  className={`flex flex-col gap-2.5 p-4 sm:gap-2 md:grid md:grid-cols-[2fr_2fr_1fr_80px] md:items-center md:gap-4 md:p-4 ${
                    user.isActive === false ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-primary-dark sm:text-sm">{user.name}</p>
                      {user.isActive === false ? (
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-600">
                          Inactive
                        </span>
                      ) : null}
                      {genderLabel(user.gender) ? (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          {genderLabel(user.gender)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-zinc-500 md:hidden">{user.email}</p>
                    {displayRole(user.role) === "student" && (user.timezone || user.country) ? (
                      <p className="text-[10px] text-zinc-400">
                        {user.timezone ? `${user.timezone}` : ""}
                        {user.timezone && user.country ? " · " : ""}
                        {user.country ? formatCountryWithFlag(user.country) : ""}
                      </p>
                    ) : null}
                    {displayRole(user.role) === "teacher" && user.country ? (
                      <p className="text-[10px] text-zinc-400">
                        {formatCountryWithFlag(user.country)}
                      </p>
                    ) : null}
                  </div>
                  <p className="hidden text-sm text-zinc-600 md:block">{user.email}</p>
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[shownRole]}`}
                  >
                    {roleLabel(user.role)}
                  </span>
                  <div className="flex justify-end gap-1">
                    {manageable ? (
                      <>
                        <button
                          onClick={() => openEditUser(user)}
                          className="rounded-lg p-2 text-primary-dark hover:bg-zinc-100"
                          aria-label="Edit user"
                          title="Edit user"
                        >
                          <Pencil className="size-4" />
                        </button>
                        {user.isActive !== false ? (
                          <button
                            onClick={() => handleDeactivate(user)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            aria-label="Deactivate user"
                            title="Deactivate user"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        ) : null}
                      </>
                    ) : (
                      <span className="px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                        Protected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Pagination pagination={pagination} itemLabel="users" />
        </>
      )}

      <AdminEditUserModal
        user={editingUser}
        creatableRoles={creatableRoles}
        curriculumTree={curriculumTree}
        isPending={updateUser.isPending}
        form={{
          name: editName,
          email: editEmail,
          role: editRole,
          isActive: editActive,
          gender: editGender,
          timezone: editTimezone,
          country: editCountry,
          whatsapp: editWhatsapp,
          curriculumAssignments: editCurriculumAssignments,
        }}
        onChange={(key, value) => {
          if (key === "name") setEditName(value as string);
          if (key === "email") setEditEmail(value as string);
          if (key === "role") setEditRole(value as (typeof ASSIGNABLE_ROLES)[number]);
          if (key === "isActive") setEditActive(value as boolean);
          if (key === "gender") setEditGender(value as "" | "male" | "female");
          if (key === "timezone") setEditTimezone(value as string);
          if (key === "country") setEditCountry(value as string);
          if (key === "whatsapp") setEditWhatsapp(value as string);
          if (key === "curriculumAssignments") {
            setEditCurriculumAssignments(value as CurriculumAssignment[]);
          }
        }}
        onClose={closeEditUser}
        onSubmit={async (payload) => {
          await updateUser.mutateAsync(payload);
          closeEditUser();
        }}
      />

      <AdminCreateUserModal
        open={showForm}
        onClose={() => setShowForm(false)}
        creatableRoles={creatableRoles}
        curriculumTree={curriculumTree}
        isPending={createUser.isPending}
        onSubmit={async (payload) => {
          await createUser.mutateAsync(payload);
          setShowForm(false);
        }}
      />
    </PageContainer>
  );
}
