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
import {
  AdminUserFormFullWidth,
  AdminUserFormSection,
} from "@/features/admin/components/AdminUserFormSection";
import { cn } from "@/lib/utils/cn";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import type { CurriculumAssignment, Role } from "@/types/models";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

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

const ROLE_HINT_KEYS: Partial<Record<Role, string>> = {
  student: "admin.users.roleHintStudent",
  teacher: "admin.users.roleHintTeacher",
  admin: "admin.users.roleHintAdmin",
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
  const { t, role, dynamicLabel } = usePortalTranslation();

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

  const roleHintKey = ROLE_HINT_KEYS[form.role];

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      size="xl"
      title={t("admin.users.createTitle")}
      description={t("admin.users.createDesc")}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={resetAndClose}
            className="rounded-xl border border-portal"
          >
            {t("admin.common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="rounded-xl bg-primary-dark text-white"
          >
            {isPending ? t("admin.users.creating") : t("admin.users.createUser")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-portal bg-portal-surface p-1">
          <p className="px-3 pt-2 text-xs font-medium uppercase tracking-wide text-portal-muted">
            {t("admin.users.accountRole")}
          </p>
          <div className="flex flex-wrap gap-1 p-1">
            {creatableRoles.map((roleKey) => {
              const active = form.role === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => update("role", roleKey)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-primary-dark text-white shadow-sm"
                      : "text-portal-muted hover:bg-portal-surface-muted/60 hover:text-portal-heading"
                  )}
                >
                  {role(roleKey)}
                </button>
              );
            })}
          </div>
          <p className="border-t border-portal px-3 py-2 text-xs text-portal-muted">
            {roleHintKey ? t(roleHintKey) : t("admin.users.roleHintDefault")}
          </p>
        </div>

        <AdminUserFormSection
          title={t("admin.users.sectionAccount")}
          description={t("admin.users.sectionAccountDesc")}
          columns={2}
        >
          <Input
            label={t("admin.users.fullName")}
            placeholder={t("admin.users.fullNamePlaceholder")}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            autoComplete="name"
            required
          />
          <Input
            label={t("admin.users.email")}
            type="email"
            placeholder={t("admin.users.emailPlaceholder")}
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            required
          />

          <AdminUserFormFullWidth>
            <div className="flex flex-col gap-1.5">
              <span className={formLabelClass}>{t("admin.users.password")}</span>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("admin.users.passwordPlaceholder")}
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
                    aria-label={
                      showPassword ? t("admin.users.hidePassword") : t("admin.users.showPassword")
                    }
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
                  title={t("admin.users.generatePassword")}
                >
                  <RefreshCw className="size-4" />
                  <span className="hidden sm:inline">{t("admin.users.generate")}</span>
                </Button>
              </div>
              <span className={formHintClass}>{t("admin.users.passwordHint")}</span>
            </div>
          </AdminUserFormFullWidth>

          {isTeacher ? (
            <Select
              label={t("admin.users.teacherGender")}
              value={form.gender}
              onChange={(event) =>
                update("gender", event.target.value as "" | "male" | "female")
              }
              hint={t("admin.users.teacherGenderHint")}
              required
            >
              <option value="">{t("admin.users.selectGender")}</option>
              <option value="female">{dynamicLabel("female")}</option>
              <option value="male">{dynamicLabel("male")}</option>
            </Select>
          ) : null}
        </AdminUserFormSection>

        {needsContact ? (
          <AdminUserFormSection
            title={t("admin.users.sectionContact")}
            description={t("admin.users.sectionContactDesc")}
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
              hint={t("admin.users.whatsappHint")}
            />
          </AdminUserFormSection>
        ) : null}

        {isStudent ? (
          <AdminUserFormSection
            title={t("admin.users.sectionStudent")}
            description={t("admin.users.sectionStudentDesc")}
            columns={2}
          >
            <Select
              label={t("admin.users.timezone")}
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
                  {t("admin.users.addPrograms")}
                  <span className="text-xs">{t("admin.users.optional")}</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-portal-heading">
                      {t("admin.users.studyPrograms")}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCurriculum(false);
                        update("curriculumAssignments", []);
                      }}
                      className="text-xs font-medium text-portal-muted hover:text-portal-heading"
                    >
                      {t("admin.users.remove")}
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
