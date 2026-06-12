import { useState } from "react";
import { Search, Plus, Trash2, X, Pencil } from "lucide-react";
import {
  useAdminUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formControlClass } from "@/lib/formControl";
import { ASSIGNABLE_ROLES, displayRole } from "@/lib/assignableRoles";
import { PROFILE_TIMEZONES } from "@/lib/profileTimezones";
import {
  CurriculumAssignmentEditor,
  useCurriculumTree,
} from "@/components/curriculum/NestedCurriculumSelect";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import type { CurriculumAssignment, Role } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
const ROLE_COLORS: Record<Role, string> = {
  student: "bg-teal-100 text-teal-700",
  teacher: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
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
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof ASSIGNABLE_ROLES)[number]>("student");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [country, setCountry] = useState("Bangladesh");
  const [curriculumAssignments, setCurriculumAssignments] = useState<CurriculumAssignment[]>([]);

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<(typeof ASSIGNABLE_ROLES)[number]>("student");
  const [editActive, setEditActive] = useState(true);
  const [editGender, setEditGender] = useState<"" | "male" | "female">("");
  const [editTimezone, setEditTimezone] = useState("Asia/Dhaka");
  const [editCountry, setEditCountry] = useState("");
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

  function openEditUser(user: (typeof users)[number]) {
    setEditUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(displayRole(user.role) as (typeof ASSIGNABLE_ROLES)[number]);
    setEditActive(user.isActive !== false);
    setEditGender(user.gender ?? "");
    setEditTimezone(user.timezone ?? "Asia/Dhaka");
    setEditCountry(user.country ?? "");
    setEditCurriculumAssignments(user.curriculumAssignments ?? []);
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
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!name || !email || !password) return;
    if ((role === "student" || role === "teacher") && !country) return;
    await createUser.mutateAsync({
      name,
      email,
      password,
      role,
      ...(role === "teacher" && gender ? { gender } : {}),
      ...(role === "student" || role === "teacher" ? { country } : {}),
      ...(role === "student"
        ? {
            timezone,
            curriculumAssignments,
          }
        : {}),
    });
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setGender("");
    setTimezone("Asia/Dhaka");
    setCountry("Bangladesh");
    setCurriculumAssignments([]);
    setShowForm(false);
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">User Management</h1>
          <p className="text-sm text-zinc-500">{users.length} users</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="gap-2 rounded-xl bg-[#03214F] text-white"
        >
          <Plus className="size-4" />
          Add User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          className={`${formControlClass} py-3 pl-10`}
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...ASSIGNABLE_ROLES] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              roleFilter === r
                ? "bg-[#03214F] text-white"
                : "border border-zinc-200 bg-white text-[#03214F]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {roleFilter === "teacher" ? (
        <div className="flex flex-wrap gap-2">
          {(["all", "female", "male"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenderFilter(g)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                genderFilter === g
                  ? "bg-[#C4922B] text-white"
                  : "border border-zinc-200 bg-white text-[#03214F]"
              }`}
            >
              {g === "all" ? "All teachers" : g}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <PageLoading label="Loading users…" />
      ) : (
        <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
          <div className="hidden md:grid md:grid-cols-[2fr_2fr_1fr_80px] md:gap-4 md:border-b md:border-zinc-100 md:bg-zinc-50 md:px-5 md:py-3 md:text-xs md:font-semibold md:uppercase md:tracking-wide md:text-zinc-500">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {filtered.map((u) => {
              const shownRole = displayRole(u.role);
              return (
                <div
                  key={u.id}
                  className={`flex flex-col gap-2 p-4 md:grid md:grid-cols-[2fr_2fr_1fr_80px] md:items-center md:gap-4 ${
                    u.isActive === false ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#03214F]">{u.name}</p>
                      {u.isActive === false ? (
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-600">
                          Inactive
                        </span>
                      ) : null}
                      {genderLabel(u.gender) ? (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          {genderLabel(u.gender)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-zinc-400 md:hidden">{u.email}</p>
                    {displayRole(u.role) === "student" && (u.timezone || u.country) ? (
                      <p className="text-[10px] text-zinc-400">
                        {u.timezone ? `${u.timezone}` : ""}
                        {u.timezone && u.country ? " · " : ""}
                        {u.country ? formatCountryWithFlag(u.country) : ""}
                      </p>
                    ) : null}
                    {displayRole(u.role) === "teacher" && u.country ? (
                      <p className="text-[10px] text-zinc-400">
                        {formatCountryWithFlag(u.country)}
                      </p>
                    ) : null}
                  </div>
                  <p className="hidden text-sm text-zinc-600 md:block">{u.email}</p>
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_COLORS[shownRole]}`}
                  >
                    {shownRole}
                  </span>
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEditUser(u)}
                      className="rounded-lg p-2 text-[#03214F] hover:bg-zinc-100"
                      aria-label="Edit user"
                      title="Edit user"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {u.isActive !== false ? (
                      <button
                        onClick={() => handleDeactivate(u)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label="Deactivate user"
                        title="Deactivate user"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {editUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="flex w-full max-w-md flex-col gap-4 rounded-2xl border-0 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-[#03214F]">
                Edit User
              </span>
              <button onClick={() => setEditUserId(null)}>
                <X className="size-5 text-zinc-400" />
              </button>
            </div>
            <Input
              placeholder="Full name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <Select
              value={editRole}
              onChange={(e) =>
                setEditRole(e.target.value as (typeof ASSIGNABLE_ROLES)[number])
              }
              label="Role"
            >
              {ASSIGNABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
            {editRole === "teacher" ? (
              <Select
                value={editGender}
                onChange={(e) =>
                  setEditGender(e.target.value as "" | "male" | "female")
                }
                label="Gender"
              >
                <option value="">Not set</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
            ) : null}
            {editRole === "student" || editRole === "teacher" ? (
              <CountrySelect value={editCountry} onChange={setEditCountry} />
            ) : null}
            {editRole === "student" ? (
              <>
                <Select
                  value={editTimezone}
                  onChange={(e) => setEditTimezone(e.target.value)}
                  label="Timezone"
                >
                  {PROFILE_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
                </Select>
                <CurriculumAssignmentEditor
                  tree={curriculumTree}
                  assignments={editCurriculumAssignments}
                  onChange={setEditCurriculumAssignments}
                />
              </>
            ) : null}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-100 px-4 py-3">
              <input
                type="checkbox"
                checked={editActive}
                onChange={(e) => setEditActive(e.target.checked)}
              />
              <span className="text-sm font-medium text-[#03214F]">Account active</span>
            </label>
            <Button
              onClick={async () => {
                if (!editName || !editEmail) return;
                if (
                  (editRole === "student" || editRole === "teacher") &&
                  !editCountry
                ) {
                  return;
                }
                await updateUser.mutateAsync({
                  name: editName,
                  email: editEmail,
                  role: editRole,
                  isActive: editActive,
                  ...(editRole === "teacher" ? { gender: editGender } : {}),
                  ...(editRole === "student" || editRole === "teacher"
                    ? { country: editCountry }
                    : {}),
                  ...(editRole === "student"
                    ? {
                        timezone: editTimezone,
                        curriculumAssignments: editCurriculumAssignments,
                      }
                    : {}),
                });
                setEditUserId(null);
              }}
              disabled={
                updateUser.isPending ||
                ((editRole === "student" || editRole === "teacher") &&
                  !editCountry)
              }
              className="h-11 rounded-xl bg-[#03214F] text-white"
            >
              {updateUser.isPending ? "Saving…" : "Save changes"}
            </Button>
          </Card>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="flex w-full max-w-md flex-col gap-4 rounded-2xl border-0 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-[#03214F]">
                New User
              </span>
              <button onClick={() => setShowForm(false)}>
                <X className="size-5 text-zinc-400" />
              </button>
            </div>
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as (typeof ASSIGNABLE_ROLES)[number])}
              label="Role"
            >
              {ASSIGNABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
            {role === "teacher" ? (
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value as "" | "male" | "female")}
                label="Gender"
              >
                <option value="">Select gender…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
            ) : null}
            {role === "student" || role === "teacher" ? (
              <CountrySelect value={country} onChange={setCountry} />
            ) : null}
            {role === "student" ? (
              <>
                <Select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  label="Timezone"
                >
                  {PROFILE_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
                </Select>
                <CurriculumAssignmentEditor
                  tree={curriculumTree}
                  assignments={curriculumAssignments}
                  onChange={setCurriculumAssignments}
                />
              </>
            ) : null}
            <p className="text-xs text-zinc-500">
              Student accounts cover learners and guardians in one portal.
            </p>
            <Button
              onClick={handleCreate}
              disabled={
                createUser.isPending ||
                ((role === "student" || role === "teacher") && !country)
              }
              className="h-11 rounded-xl bg-[#03214F] text-white"
            >
              {createUser.isPending ? "Creating…" : "Create User"}
            </Button>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
