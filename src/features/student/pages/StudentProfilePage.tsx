import { useEffect, useState } from "react";
import {
  useChangeStudentPassword,
  useStudentProfile,
  useUpdateStudentProfile,
} from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { PROFILE_TIMEZONES } from "@/lib/profileTimezones";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { WhatsAppPhoneField } from "@/components/whatsapp/WhatsAppPhoneField";
import { toast } from "@/stores/uiStore";
import { PageLoading } from "@/components/ui/PageLoading";
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { useUploadProfileAvatar } from "@/hooks/useUploadProfileAvatar";
import { useAuthStore } from "@/stores/authStore";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentProfilePage() {
  const { t } = usePortalTranslation();
  const authUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useStudentProfile();
  const updateProfile = useUpdateStudentProfile();
  const changePassword = useChangeStudentPassword();
  const uploadAvatar = useUploadProfileAvatar("student");

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [country, setCountry] = useState("Bangladesh");
  const [whatsapp, setWhatsapp] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setTimezone(profile.timezone || "Asia/Dhaka");
    setCountry(profile.country || "Bangladesh");
    setWhatsapp(profile.whatsapp || "");
  }, [profile]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({ name, timezone, country, whatsapp });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("student.passwordsDoNotMatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("student.passwordMinLength"));
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  }

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{t("student.myProfile")}</h1>
        <p className="text-sm text-zinc-500">{t("student.profileSubtitle")}</p>
      </div>

      <Card className="flex flex-col items-center gap-3 rounded-3xl border-0 p-8 shadow-sm">
        <ProfileAvatarUpload
          name={(profile?.name ?? name) || "?"}
          avatarUrl={profile?.avatarUrl ?? authUser?.avatarUrl}
          gender={profile?.gender ?? authUser?.gender}
          isUploading={uploadAvatar.isPending}
          onUpload={async (file) => {
            await uploadAvatar.mutateAsync(file);
          }}
        />
        <div className="text-center">
          <p className="text-xl font-bold text-primary-dark">
            {(profile?.name ?? name) || "—"}
          </p>
          <p className="text-sm text-zinc-500">{profile?.email ?? "—"}</p>
          {profile?.studentId ? (
            <p className="mt-1 text-xs text-zinc-400">
              {t("student.studentIdLabel", { id: profile.studentId })}
            </p>
          ) : null}
        </div>
      </Card>

      {isLoading ? (
        <PageLoading label={t("student.loadingProfile")} />
      ) : (
        <>
          <Card className="rounded-3xl border-0 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-primary-dark">{t("student.accountLocation")}</h2>
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">{t("student.displayName")}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={formControlClass}
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">{t("student.timezone")}</span>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={formControlClass}
                >
                  {PROFILE_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <CountrySelect value={country} onChange={setCountry} />

              <WhatsAppPhoneField
                country={country}
                value={whatsapp}
                onChange={setWhatsapp}
                required
              />

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="h-11 rounded-xl bg-primary-dark text-white"
              >
                {updateProfile.isPending ? t("student.saving") : t("student.saveProfile")}
              </Button>
            </form>
          </Card>

          <Card className="rounded-3xl border-0 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-primary-dark">{t("student.changePassword")}</h2>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">
                  {t("student.currentPassword")}
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={formControlClass}
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">{t("student.newPassword")}</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={formControlClass}
                  minLength={6}
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">
                  {t("student.confirmNewPassword")}
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={formControlClass}
                  minLength={6}
                  required
                />
              </label>
              {passwordMismatch ? (
                <p className="text-xs text-red-600">{t("student.passwordsDoNotMatch")}</p>
              ) : null}
              <Button
                type="submit"
                disabled={changePassword.isPending || passwordMismatch}
                className="h-11 rounded-xl bg-primary-dark text-white"
              >
                {changePassword.isPending ? t("student.updating") : t("student.updatePassword")}
              </Button>
            </form>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
