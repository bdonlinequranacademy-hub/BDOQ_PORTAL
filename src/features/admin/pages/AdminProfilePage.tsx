import { useEffect, useState } from "react";
import {
  useAdminProfile,
  useChangeAdminPassword,
  useUpdateAdminProfile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { toast } from "@/stores/uiStore";
import { PageLoading } from "@/components/ui/PageLoading";
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { useUploadProfileAvatar } from "@/hooks/useUploadProfileAvatar";
import { useAuthStore } from "@/stores/authStore";
import { BDOQ_ROLE_PORTAL_LABEL } from "@/lib/bdoqBrand";
import type { Role } from "@/types/models";

function roleLabel(role: string) {
  return BDOQ_ROLE_PORTAL_LABEL[role as Role] ?? role.replace("_", " ");
}

export function AdminProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useAdminProfile();
  const updateProfile = useUpdateAdminProfile();
  const changePassword = useChangeAdminPassword();
  const uploadAvatar = useUploadProfileAvatar(authUser?.role ?? "admin");

  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
  }, [profile]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({ name });
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
        <h1 className="text-2xl font-bold text-primary-dark">My Profile</h1>
        <p className="text-sm text-zinc-500">
          Manage your admin account details and password.
        </p>
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
          {profile?.role ? (
            <span className="mt-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
              {roleLabel(profile.role)}
            </span>
          ) : null}
        </div>
      </Card>

      {isLoading ? (
        <PageLoading label="Loading profile…" />
      ) : (
        <>
          <Card className="rounded-3xl border-0 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-primary-dark">Account details</h2>
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
                <span className="text-xs font-medium text-zinc-500">Email</span>
                <input
                  value={profile?.email ?? ""}
                  className={`${formControlClass} cursor-not-allowed bg-zinc-50 text-zinc-500`}
                  readOnly
                  disabled
                />
              </label>

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="h-11 rounded-xl bg-primary-dark text-white"
              >
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </Card>

          <Card className="rounded-3xl border-0 p-6 shadow-sm">
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
                  autoComplete="current-password"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                />
              </label>
              {passwordMismatch ? (
                <p className="text-xs text-red-600">Passwords do not match</p>
              ) : null}
              <Button
                type="submit"
                disabled={changePassword.isPending || passwordMismatch}
                className="h-11 rounded-xl bg-primary-dark text-white"
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
