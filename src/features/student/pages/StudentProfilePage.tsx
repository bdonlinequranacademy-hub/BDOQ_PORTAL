import { useEffect, useState } from "react";
import {
  useChangeStudentPassword,
  useStudentProfile,
  useUpdateStudentProfile,
} from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { formControlClass } from "@/lib/formControl";
import { PROFILE_TIMEZONES } from "@/lib/profileTimezones";
import { toast } from "@/stores/uiStore";

import { PageLoading } from "@/components/ui/PageLoading";
export function StudentProfilePage() {
  const { data: profile, isLoading } = useStudentProfile();
  const updateProfile = useUpdateStudentProfile();
  const changePassword = useChangeStudentPassword();

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [country, setCountry] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setTimezone(profile.timezone || "Asia/Dhaka");
    setCountry(profile.country || "");
  }, [profile]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({ name, timezone, country });
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
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-[#03214F]">My Profile</h1>
        <p className="text-sm text-zinc-500">
          Your timezone and country help teachers schedule classes correctly.
        </p>
      </div>

      <Card className="flex flex-col items-center gap-3 rounded-3xl border-0 p-8 shadow-sm">
        <BrandLogo size="lg" />
        <div className="text-center">
          <p className="text-xl font-bold text-[#03214F]">
            {(profile?.name ?? name) || "—"}
          </p>
          <p className="text-sm text-zinc-500">{profile?.email ?? "—"}</p>
          {profile?.studentId ? (
            <p className="mt-1 text-xs text-zinc-400">ID: {profile.studentId}</p>
          ) : null}
        </div>
      </Card>

      {isLoading ? (
        <PageLoading label="Loading profile…" />
      ) : (
        <>
          <Card className="rounded-3xl border-0 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-[#03214F]">Account & location</h2>
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
                  {PROFILE_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500">Country</span>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Bangladesh, USA, UK"
                  className={formControlClass}
                />
              </label>

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="h-11 rounded-xl bg-[#03214F] text-white"
              >
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </Card>

          <Card className="rounded-3xl border-0 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-[#03214F]">Change password</h2>
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
                  className={formControlClass}
                  minLength={6}
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
                  minLength={6}
                  required
                />
              </label>
              {passwordMismatch ? (
                <p className="text-xs text-red-600">Passwords do not match</p>
              ) : null}
              <Button
                type="submit"
                disabled={changePassword.isPending || passwordMismatch}
                className="h-11 rounded-xl bg-[#03214F] text-white"
              >
                {changePassword.isPending ? "Updating…" : "Update password"}
              </Button>
            </form>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
