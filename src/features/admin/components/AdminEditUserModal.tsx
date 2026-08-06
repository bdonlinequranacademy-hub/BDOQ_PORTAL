import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { WhatsAppPhoneField } from "@/components/whatsapp/WhatsAppPhoneField";
import { CurriculumAssignmentEditor } from "@/components/curriculum/NestedCurriculumSelect";
import { PROFILE_TIMEZONE_OPTIONS } from "@/lib/profileTimezones";
import { ASSIGNABLE_ROLES } from "@/lib/assignableRoles";
import {
  AdminUserFormFullWidth,
  AdminUserFormSection,
} from "@/features/admin/components/AdminUserFormSection";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AdminUser, CurriculumAssignment, Role } from "@/types/models";
import type { CurriculumNode } from "@/lib/api/curriculumApi";

export interface IUpdateUserPayload {
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  gender?: "male" | "female" | "";
  timezone?: string;
  country?: string;
  whatsapp?: string;
  curriculumAssignments?: CurriculumAssignment[];
}

interface IAdminEditUserModalProps {
  user: AdminUser | null;
  creatableRoles: readonly Role[];
  curriculumTree: CurriculumNode[];
  isPending: boolean;
  form: {
    name: string;
    email: string;
    role: (typeof ASSIGNABLE_ROLES)[number];
    isActive: boolean;
    gender: "" | "male" | "female";
    timezone: string;
    country: string;
    whatsapp: string;
    curriculumAssignments: CurriculumAssignment[];
  };
  onChange: <K extends keyof IAdminEditUserModalProps["form"]>(
    key: K,
    value: IAdminEditUserModalProps["form"][K]
  ) => void;
  onClose: () => void;
  onSubmit: (payload: IUpdateUserPayload) => Promise<void>;
}

export function AdminEditUserModal({
  user,
  creatableRoles,
  curriculumTree,
  isPending,
  form,
  onChange,
  onClose,
  onSubmit,
}: IAdminEditUserModalProps) {
  const { t, role, dynamicLabel } = usePortalTranslation();

  const needsContact = form.role === "student" || form.role === "teacher";
  const isStudent = form.role === "student";
  const isTeacher = form.role === "teacher";

  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    (!needsContact || form.country.trim().length > 0);

  async function handleSubmit() {
    if (!canSubmit) return;

    await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      isActive: form.isActive,
      ...(isTeacher ? { gender: form.gender } : {}),
      ...(needsContact ? { country: form.country, whatsapp: form.whatsapp } : {}),
      ...(isStudent
        ? {
            timezone: form.timezone,
            curriculumAssignments: form.curriculumAssignments,
          }
        : {}),
    });
  }

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      size="xl"
      title={t("admin.users.editTitle")}
      description={
        user ? t("admin.users.editDescFor", { name: user.name }) : undefined
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
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
            {isPending ? t("admin.users.saving") : t("admin.users.saveChanges")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <AdminUserFormSection title={t("admin.users.sectionAccount")} columns={2}>
          <Input
            label={t("admin.users.fullName")}
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            required
          />
          <Input
            label={t("admin.users.email")}
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            required
          />
          <Select
            label={t("admin.users.accountRole")}
            value={form.role}
            onChange={(event) =>
              onChange("role", event.target.value as (typeof ASSIGNABLE_ROLES)[number])
            }
          >
            {[...new Set([form.role, ...creatableRoles])].map((roleKey) => (
              <option key={roleKey} value={roleKey}>
                {role(roleKey)}
              </option>
            ))}
          </Select>
          <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-portal bg-portal-surface-muted/20 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => onChange("isActive", event.target.checked)}
              className="size-4 rounded border-portal text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-portal-heading">
              {t("admin.users.accountActive")}
            </span>
          </label>
        </AdminUserFormSection>

        {isTeacher ? (
          <AdminUserFormSection title={t("admin.users.sectionTeacher")} columns={2}>
            <Select
              label={t("admin.users.teacherGenderLabel")}
              value={form.gender}
              onChange={(event) =>
                onChange("gender", event.target.value as "" | "male" | "female")
              }
            >
              <option value="">{dynamicLabel("not_set")}</option>
              <option value="female">{dynamicLabel("female")}</option>
              <option value="male">{dynamicLabel("male")}</option>
            </Select>
          </AdminUserFormSection>
        ) : null}

        {needsContact ? (
          <AdminUserFormSection title={t("admin.users.sectionContact")} columns={2}>
            <CountrySelect value={form.country} onChange={(value) => onChange("country", value)} />
            <WhatsAppPhoneField
              country={form.country}
              value={form.whatsapp}
              onChange={(value) => onChange("whatsapp", value)}
            />
          </AdminUserFormSection>
        ) : null}

        {isStudent ? (
          <AdminUserFormSection title={t("admin.users.sectionStudentLearning")} columns={2}>
            <Select
              label={t("admin.users.timezone")}
              value={form.timezone}
              onChange={(event) => onChange("timezone", event.target.value)}
            >
              {PROFILE_TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Select>
            <AdminUserFormFullWidth>
              <CurriculumAssignmentEditor
                tree={curriculumTree}
                assignments={form.curriculumAssignments}
                onChange={(assignments) => onChange("curriculumAssignments", assignments)}
              />
            </AdminUserFormFullWidth>
          </AdminUserFormSection>
        ) : null}
      </div>
    </Modal>
  );
}
