import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, UserPlus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAdminUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
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
import { AdminCreateUserModal } from "@/features/admin/components/AdminCreateUserModal";
import { AdminEditUserModal } from "@/features/admin/components/AdminEditUserModal";
import { AdminUsersStatsGrid } from "@/features/admin/components/users/AdminUsersStatsGrid";
import {
  AdminUsersFilterPanel,
  type AdminUsersStatusFilter,
} from "@/features/admin/components/users/AdminUsersFilterPanel";
import {
  AdminUsersTable,
  exportUsersFile,
} from "@/features/admin/components/users/AdminUsersTable";
import type { CurriculumAssignment, Role } from "@/types/models";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { cn } from "@/lib/utils/cn";

type RoleFilter = (typeof ASSIGNABLE_ROLES)[number] | "all";
type GenderFilter = "all" | "male" | "female";
type SortOption = "newest" | "oldest" | "name";

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useAuthStore((s) => s.user);
  const actorRole = currentUser?.role ?? "admin";
  const creatableRoles = assignableRolesFor(actorRole);
  const roleFilterOptions = isSuperAdmin(actorRole)
    ? (["all", ...ASSIGNABLE_ROLES] as const)
    : (["all", ...creatableRoles, "admin"] as const);

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [statusFilter, setStatusFilter] = useState<AdminUsersStatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
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

  const { data: allUsers = [], isLoading: statsLoading } = useAdminUsers();
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
    if (searchParams.has("edit")) {
      const next = new URLSearchParams(searchParams);
      next.delete("edit");
      setSearchParams(next, { replace: true });
    }
  }

  function handleViewUser(user: (typeof users)[number]) {
    navigate(`/admin/users/${user.id}`);
  }

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (
      roleParam &&
      (ASSIGNABLE_ROLES as readonly string[]).includes(roleParam) &&
      roleFilter !== roleParam
    ) {
      setRoleFilter(roleParam as RoleFilter);
    }
  }, [searchParams, roleFilter]);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId || users.length === 0 || editUserId === editId) return;
    const target = users.find((user) => user.id === editId) ?? allUsers.find((user) => user.id === editId);
    if (target) openEditUser(target);
  }, [searchParams, users, allUsers, editUserId]);

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

  function clearFilters() {
    setSearch("");
    setRoleFilter("all");
    setGenderFilter("all");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("newest");
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users
      .filter((user) => {
        const matchesSearch =
          !query ||
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && user.isActive !== false) ||
          (statusFilter === "inactive" && user.isActive === false);

        const joinedAt = user.createdAt ? new Date(user.createdAt) : null;
        const matchesFrom =
          !dateFrom || (joinedAt ? joinedAt >= new Date(`${dateFrom}T00:00:00`) : false);
        const matchesTo =
          !dateTo || (joinedAt ? joinedAt <= new Date(`${dateTo}T23:59:59`) : false);

        return matchesSearch && matchesStatus && matchesFrom && matchesTo;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }

        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortBy === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [users, search, statusFilter, dateFrom, dateTo, sortBy]);

  const pagination = usePaginatedList(filtered, {
    resetDeps: [search, roleFilter, genderFilter, statusFilter, dateFrom, dateTo, sortBy],
  });

  return (
    <PageContainer className="gap-5 lg:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            User Management
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-2xl text-portal-muted">
            Create, manage and organize users across the platform.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          <UserPlus className="size-4" aria-hidden />
          Add New User
        </Button>
      </div>

      <AdminUsersStatsGrid users={allUsers} isLoading={statsLoading} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">
        <AdminUsersFilterPanel
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          genderFilter={genderFilter}
          onGenderFilterChange={setGenderFilter}
          showGenderFilter={roleFilter === "teacher"}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClearFilters={clearFilters}
          onExportCsv={() => exportUsersFile(filtered, "csv")}
          onExportExcel={() => exportUsersFile(filtered, "excel")}
          roleFilterOptions={roleFilterOptions}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {roleFilterOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-[8px] px-4 py-1.5 text-sm font-semibold transition",
                    roleFilter === role
                      ? "bg-primary text-white shadow-sm"
                      : "border border-portal bg-portal-surface text-portal-heading hover:border-primary/30"
                  )}
                >
                  {role === "all" ? "All Users" : roleLabel(role as Role)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[170px]">
                <Select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="py-2 text-sm"
                  aria-label="Sort users"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A–Z</option>
                </Select>
              </div>
              <div className="hidden items-center gap-1 rounded-xl border border-portal bg-portal-surface p-1 sm:flex">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <List className="size-4" aria-hidden />
                </span>
                <span className="inline-flex size-9 items-center justify-center rounded-lg text-portal-muted">
                  <LayoutGrid className="size-4" aria-hidden />
                </span>
              </div>
            </div>
          </div>

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
              actionLabel={creatableRoles.length > 0 ? "Add New User" : undefined}
              onAction={creatableRoles.length > 0 ? () => setShowForm(true) : undefined}
            />
          ) : (
            <>
              <AdminUsersTable
                users={pagination.paginatedItems}
                onView={handleViewUser}
                onEdit={openEditUser}
                onDeactivate={handleDeactivate}
                canManage={(targetRole) => canManageUserAccount(actorRole, targetRole)}
              />
              <Pagination pagination={pagination} itemLabel="users" />
            </>
          )}
        </div>
      </div>

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
