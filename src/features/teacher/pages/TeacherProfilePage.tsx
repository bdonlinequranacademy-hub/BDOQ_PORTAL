import { useEffect, useState } from "react";
import {
  useChangeTeacherPassword,
  useTeacherProfile,
  useUpdateTeacherProfile,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { WhatsAppPhoneField } from "@/components/whatsapp/WhatsAppPhoneField";
import { toast } from "@/stores/uiStore";

import { PageLoading } from "@/components/ui/PageLoading";
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { useUploadProfileAvatar } from "@/hooks/useUploadProfileAvatar";
import { useAuthStore } from "@/stores/authStore";

const TIMEZONES = [
  "Asia/Dhaka",
  "Asia/Riyadh",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
];

export function TeacherProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useTeacherProfile();
  const updateProfile = useUpdateTeacherProfile();
  const changePassword = useChangeTeacherPassword();
  const uploadAvatar = useUploadProfileAvatar("teacher");

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [country, setCountry] = useState("Bangladesh");
  const [whatsapp, setWhatsapp] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bKashNumber, setBKashNumber] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setTimezone(profile.timezone || "Asia/Dhaka");
    setCountry(profile.country || "Bangladesh");
    setWhatsapp(profile.whatsapp || "");
    setMeetingLink(profile.meetingLink || "");
    setBankName(profile.bankName || "");
    setBankAccount(profile.bankAccount || "");
    setBKashNumber(profile.bKashNumber || "");
  }, [profile]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({
      name,
      timezone,
      country,
      whatsapp,
      meetingLink,
      bankName,
      bankAccount,
      bKashNumber,
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
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
    <PageContainer>
      <PageHeader
        title="My Profile"
        subtitle="Timezone, meeting link, payout details, and password"
        showBismillah
      />

      {isLoading ? (
        <PageLoading label="Loading profile…" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card className="flex flex-col items-center gap-3 border-0 p-6 shadow-sm lg:row-span-2 lg:sticky lg:top-24">
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
              <p className="text-sm text-portal-muted">{profile?.email ?? "—"}</p>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <h2 className="mb-4 font-bold text-primary-dark">Account & schedule</h2>
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Display name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={formControlClass}
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Timezone</span>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={formControlClass}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
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

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Class meeting link</span>
                <input
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Zoom / Google Meet URL"
                  className={formControlClass}
                />
              </label>

              <h3 className="pt-2 font-semibold text-primary-dark">Payout details</h3>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Bank name</span>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={formControlClass}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Bank account</span>
                <input
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className={formControlClass}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">bKash number</span>
                <input
                  value={bKashNumber}
                  onChange={(e) => setBKashNumber(e.target.value)}
                  className={formControlClass}
                />
              </label>

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="mt-2 w-full rounded-xl"
              >
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </Card>

          <Card className="border-0 shadow-sm">
            <h2 className="mb-4 font-bold text-primary-dark">Change password</h2>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Current password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={formControlClass}
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  className={formControlClass}
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={formControlClass}
                  required
                />
                {passwordMismatch ? (
                  <span className="text-xs text-red-500">Passwords do not match</span>
                ) : null}
              </label>

              <Button
                type="submit"
                variant="secondary"
                disabled={
                  changePassword.isPending ||
                  passwordMismatch ||
                  newPassword.length < 6
                }
                className="mt-2 w-full rounded-xl"
              >
                {changePassword.isPending ? "Updating…" : "Update password"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
