import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { WhatsAppPhoneField } from "@/components/whatsapp/WhatsAppPhoneField";
import { CurriculumAssignmentEditor } from "@/components/curriculum/NestedCurriculumSelect";
import { PROFILE_TIMEZONES } from "@/lib/profileTimezones";
import { roleLabel } from "@/lib/assignableRoles";
import {
  AdminUserFormFullWidth,
  AdminUserFormSection,
} from "@/features/admin/components/AdminUserFormSection";
import { cn } from "@/lib/utils/cn";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import type { CurriculumAssignment, Role } from "@/types/models";
import type { CurriculumNode } from "@/lib/api/curriculumApi";

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  gender?: "male" | "female";
  timezone?: string;
  country?: string;
  whatsapp?: string;
  curriculumAssignments?: CurriculumAssignment[];
}

interface IAdminCreateUserModalProps {
  open: boolean;
  onClose: () => void;
  creatableRoles: readonly Role[];
  curriculumTree: CurriculumNode[];
  isPending: boolean;
  onSubmit: (payload: ICreateUserPayload) => Promise<void>;
}

const ROLE_HINTS: Partial<Record<Role, string>> = {
  student: "Learners use the student portal for classes, homework, and payments.",
  teacher: "Teachers manage classes, attendance, homework, and earnings.",
  admin: "Admins manage users, curriculum, classes, and academy operations.",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "student" as Role,
  gender: "" as "" | "male" | "female",
  timezone: "Asia/Dhaka",
  country: "Bangladesh",
  whatsapp: "",
  curriculumAssignments: [] as CurriculumAssignment[],
};

function generateSecurePassword(length = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < length; i += 1) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export function AdminCreateUserModal({
  open,
  onClose,
  creatableRoles,
  curriculumTree,
  isPending,
  onSubmit,
}: IAdminCreateUserModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...EMPTY_FORM,
      role: creatableRoles[0] ?? "student",
    });
    setShowPassword(false);
    setShowCurriculum(false);
    setWhatsappError(null);
  }, [open, creatableRoles]);

  function resetAndClose() {
    setForm(EMPTY_FORM);
    setShowPassword(false);
    setShowCurriculum(false);
    setWhatsappError(null);
    onClose();
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const needsContact = form.role === "student" || form.role === "teacher";
  const isStudent = form.role === "student";
  const isTeacher = form.role === "teacher";

  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.length >= 6 &&
    !whatsappError &&
    (!needsContact || form.country.trim().length > 0) &&
    (!isTeacher || (form.gender === "male" || form.gender === "female"));

  async function handleSubmit() {
    if (!canSubmit) return;

    await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      ...(isTeacher && form.gender ? { gender: form.gender } : {}),
      ...(needsContact ? { country: form.country, whatsapp: form.whatsapp } : {}),
      ...(isStudent
        ? {
            timezone: form.timezone,
            curriculumAssignments: form.curriculumAssignments,
          }
        : {}),
    });

    setForm(EMPTY_FORM);
    setShowPassword(false);
    setShowCurriculum(false);
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      size="xl"
      title="Create new user"
      description="Choose a role, fill account details, then create the portal login."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={resetAndClose}
            className="rounded-xl border border-portal"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="rounded-xl bg-primary-dark text-white"
          >
            {isPending ? "Creating…" : "Create user"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-portal bg-portal-surface p-1">
          <p className="px-3 pt-2 text-xs font-medium uppercase tracking-wide text-portal-muted">
            Account role
          </p>
          <div className="flex flex-wrap gap-1 p-1">
            {creatableRoles.map((role) => {
              const active = form.role === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => update("role", role)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-primary-dark text-white shadow-sm"
                      : "text-portal-muted hover:bg-portal-surface-muted/60 hover:text-portal-heading"
                  )}
                >
                  {roleLabel(role)}
                </button>
              );
            })}
          </div>
          <p className="border-t border-portal px-3 py-2 text-xs text-portal-muted">
            {ROLE_HINTS[form.role] ?? "Choose the account type for this user."}
          </p>
        </div>

        <AdminUserFormSection
          title="Account details"
          description="Sign-in credentials for the academy portal."
          columns={2}
        >
          <Input
            label="Full name *"
            placeholder="e.g. Fatima Rahman"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            autoComplete="name"
            required
          />
          <Input
            label="Email address *"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            required
          />

          <AdminUserFormFullWidth>
            <div className="flex flex-col gap-1.5">
              <span className={formLabelClass}>Password *</span>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={(event) => update("password", event.target.value)}
                    autoComplete="new-password"
                    required
                    className={cn(formControlClass, "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-portal-muted hover:text-portal-heading"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    update("password", generateSecurePassword());
                    setShowPassword(true);
                  }}
                  className="shrink-0 rounded-xl border border-portal px-3"
                  title="Generate secure password"
                >
                  <RefreshCw className="size-4" />
                  <span className="hidden sm:inline">Generate</span>
                </Button>
              </div>
              <span className={formHintClass}>
                Min. 6 characters — share securely with the user after creation.
              </span>
            </div>
          </AdminUserFormFullWidth>

          {isTeacher ? (
            <Select
              label="Teacher gender *"
              value={form.gender}
              onChange={(event) =>
                update("gender", event.target.value as "" | "male" | "female")
              }
              hint="Required for student–teacher matching."
              required
            >
              <option value="">Select gender…</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Select>
          ) : null}
        </AdminUserFormSection>

        {needsContact ? (
          <AdminUserFormSection
            title="Contact & location"
            description="For WhatsApp updates, scheduling, and teacher–student matching."
            columns={2}
          >
            <CountrySelect
              value={form.country}
              onChange={(value) => update("country", value)}
            />
            <WhatsAppPhoneField
              country={form.country}
              value={form.whatsapp}
              onChange={(value) => update("whatsapp", value)}
              onError={setWhatsappError}
              hint="Optional now — add for WhatsApp reminders."
            />
          </AdminUserFormSection>
        ) : null}

        {isStudent ? (
          <AdminUserFormSection
            title="Student setup"
            description="Timezone affects class scheduling. Study programs can be added later."
            columns={2}
          >
            <Select
              label="Timezone"
              value={form.timezone}
              onChange={(event) => update("timezone", event.target.value)}
            >
              {PROFILE_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </Select>

            <AdminUserFormFullWidth>
              {!showCurriculum ? (
                <button
                  type="button"
                  onClick={() => setShowCurriculum(true)}
                  className="w-full rounded-xl border border-dashed border-portal px-4 py-3 text-left text-sm text-portal-muted transition hover:border-primary/40 hover:bg-primary/5 hover:text-portal-heading"
                >
                  + Add study programs <span className="text-xs">(optional)</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-portal-heading">Study programs</p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCurriculum(false);
                        update("curriculumAssignments", []);
                      }}
                      className="text-xs font-medium text-portal-muted hover:text-portal-heading"
                    >
                      Remove
                    </button>
                  </div>
                  <CurriculumAssignmentEditor
                    tree={curriculumTree}
                    assignments={form.curriculumAssignments}
                    onChange={(assignments) => update("curriculumAssignments", assignments)}
                  />
                </div>
              )}
            </AdminUserFormFullWidth>
          </AdminUserFormSection>
        ) : null}
      </div>
    </Modal>
  );
}
