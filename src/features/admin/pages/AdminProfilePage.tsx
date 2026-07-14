import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Check,
  ChevronRight,
  Globe,
  KeyRound,
  LayoutDashboard,
  Lock,
  MonitorSmartphone,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import {
  useAdminProfile,
  useChangeAdminPassword,
  useUpdateAdminProfile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { useUploadProfileAvatar } from "@/hooks/useUploadProfileAvatar";
import { useAuthStore } from "@/stores/authStore";
import { toast, useUiStore } from "@/stores/uiStore";
import { BDOQ_ROLE_PORTAL_LABEL } from "@/lib/bdoqBrand";
import { cn } from "@/lib/utils/cn";
import type { Role } from "@/types/models";

function roleBadgeLabel(role: string): string {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  return BDOQ_ROLE_PORTAL_LABEL[role as Role] ?? role.replace(/_/g, " ");
}

function formatJoined(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function usernameFromEmail(email: string): string {
  return email.split("@")[0] || "—";
}

export function AdminProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const addToast = useUiStore((s) => s.addToast);
  const { data: profile, isLoading } = useAdminProfile();
  const updateProfile = useUpdateAdminProfile();
  const changePassword = useChangeAdminPassword();
  const uploadAvatar = useUploadProfileAvatar(authUser?.role ?? "admin");

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setGender(profile.gender ?? "");
  }, [profile]);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({
      name: name.trim(),
      ...(gender === "male" || gender === "female" ? { gender } : {}),
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
          setShowPasswordForm(false);
        },
      }
    );
  }

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading profile…" />
      </PageContainer>
    );
  }

  const displayName = (profile?.name ?? name) || "—";
  const email = profile?.email ?? "—";
  const role = profile?.role ?? authUser?.role ?? "admin";
  const authProvider = (profile?.authProvider ?? "local").toLowerCase();
  const shortId = profile?._id ? profile._id.slice(-8).toUpperCase() : "—";

  const permissions =
    role === "super_admin"
      ? ["All Access", "System Control", "User Management", "CMS"]
      : ["Users", "Classes", "CMS", "Billing"];

  return (
    <PageContainer>
      <div>
        <h1 className="font-display text-2xl font-bold text-primary-dark sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1.5 text-sm text-portal-muted">
          Manage your account information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)]">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
            <div className="flex flex-col items-center text-center">
              <ProfileAvatarUpload
                name={displayName}
                avatarUrl={profile?.avatarUrl ?? authUser?.avatarUrl}
                gender={profile?.gender ?? authUser?.gender}
                isUploading={uploadAvatar.isPending}
                onUpload={async (file) => {
                  await uploadAvatar.mutateAsync(file);
                }}
              />
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-primary-dark">{displayName}</h2>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                  {roleBadgeLabel(role)}
                </span>
              </div>
              <p className="mt-1 text-sm text-portal-muted">{email}</p>
              <p className="mt-1 text-xs text-portal-muted">
                Joined on {formatJoined(profile?.createdAt)}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-portal pt-4">
              <div className="rounded-xl bg-orange-50 px-2 py-3 text-center">
                <Shield className="mx-auto size-4 text-orange-600" aria-hidden />
                <p className="mt-1.5 text-[10px] font-medium uppercase text-portal-muted">
                  Status
                </p>
                <p className="mt-0.5 text-xs font-bold text-portal-heading">
                  {profile?.isActive === false ? "Inactive" : "Active"}
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 px-2 py-3 text-center">
                <KeyRound className="mx-auto size-4 text-primary-dark" aria-hidden />
                <p className="mt-1.5 text-[10px] font-medium uppercase text-portal-muted">
                  Auth
                </p>
                <p className="mt-0.5 text-xs font-bold capitalize text-portal-heading">
                  {authProvider}
                </p>
              </div>
              <div className="rounded-xl bg-sky-50 px-2 py-3 text-center">
                <UserRound className="mx-auto size-4 text-sky-600" aria-hidden />
                <p className="mt-1.5 text-[10px] font-medium uppercase text-portal-muted">
                  Gender
                </p>
                <p className="mt-0.5 text-xs font-bold capitalize text-portal-heading">
                  {profile?.gender || "—"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
            <h3 className="text-sm font-bold text-primary-dark">Account Security</h3>
            <ul className="mt-4 divide-y divide-portal">
              <li className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="size-4 text-primary" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-portal-heading">Password</p>
                    <p className="text-xs text-portal-muted">
                      Update your portal sign-in password
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-lg border border-primary/30 px-3 text-xs font-semibold text-primary"
                  onClick={() => setShowPasswordForm((v) => !v)}
                >
                  Change
                </Button>
              </li>
              <li className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-amber-100">
                    <ShieldCheck className="size-4 text-amber-700" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-portal-heading">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-portal-muted">Not available yet</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  disabled
                  className="rounded-lg border border-portal px-3 text-xs font-semibold text-portal-muted"
                >
                  Enable
                </Button>
              </li>
              <li className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-sky-100">
                    <MonitorSmartphone className="size-4 text-sky-600" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-portal-heading">
                      Login Sessions
                    </p>
                    <p className="text-xs text-portal-muted">
                      Sign out to end this browser session
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-lg border border-primary/30 px-3 text-xs font-semibold text-primary"
                  onClick={() => {
                    logout();
                    addToast("success", "Signed out");
                  }}
                >
                  Manage
                </Button>
              </li>
            </ul>

            {showPasswordForm ? (
              <form
                onSubmit={handlePasswordSubmit}
                className="mt-2 space-y-3 rounded-xl border border-portal bg-portal-muted/15 p-4"
              >
                <label className="block">
                  <span className={formLabelClass}>Current password</span>
                  <input
                    type="password"
                    className={cn(formControlClass, "mt-1.5")}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </label>
                <label className="block">
                  <span className={formLabelClass}>New password</span>
                  <input
                    type="password"
                    className={cn(formControlClass, "mt-1.5")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className={formLabelClass}>Confirm new password</span>
                  <input
                    type="password"
                    className={cn(formControlClass, "mt-1.5")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </label>
                {passwordMismatch ? (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                ) : null}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl border border-portal"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={changePassword.isPending || passwordMismatch}
                    className="rounded-xl bg-primary text-white hover:bg-primary-dark"
                  >
                    {changePassword.isPending ? "Updating…" : "Update password"}
                  </Button>
                </div>
              </form>
            ) : null}
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
            <h3 className="text-sm font-bold text-primary-dark">Quick Actions</h3>
            <ul className="mt-3 divide-y divide-portal">
              {(
                [
                  {
                    to: "/admin",
                    label: "Admin Dashboard",
                    hint: "Overview & shortcuts",
                    icon: LayoutDashboard,
                  },
                  {
                    to: "/admin/users",
                    label: "Manage Users",
                    hint: "Students & teachers",
                    icon: Users,
                  },
                  {
                    to: "/admin/certificates",
                    label: "Certificates",
                    hint: "Generate & history",
                    icon: Award,
                  },
                ] as const
              ).map(({ to, label, hint, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 py-3 transition hover:bg-portal-muted/20"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-portal-heading">
                        {label}
                      </span>
                      <span className="text-xs text-portal-muted">{hint}</span>
                    </span>
                    <ChevronRight className="size-4 text-portal-muted" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <h3 className="text-sm font-bold text-primary-dark">Personal Information</h3>
            <p className="mt-0.5 text-xs text-portal-muted">
              Update your display name and gender. Email cannot be changed here.
            </p>

            <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={formLabelClass}>Full Name</span>
                  <input
                    className={cn(formControlClass, "mt-1.5")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className={formLabelClass}>Username</span>
                  <input
                    className={cn(formControlClass, "mt-1.5 cursor-not-allowed bg-portal-muted/20")}
                    value={usernameFromEmail(typeof email === "string" ? email : "")}
                    readOnly
                    disabled
                  />
                  <span className={cn(formHintClass, "mt-1 block")}>
                    Derived from your email address
                  </span>
                </label>
                <label className="block">
                  <span className={formLabelClass}>Email Address</span>
                  <input
                    className={cn(formControlClass, "mt-1.5 cursor-not-allowed bg-portal-muted/20")}
                    value={email}
                    readOnly
                    disabled
                  />
                </label>
                <label className="block">
                  <span className={formLabelClass}>Gender</span>
                  <select
                    className={cn(formControlClass, "mt-1.5")}
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as "" | "male" | "female")
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending || !name.trim()}
                  className="rounded-xl bg-primary px-5 text-white hover:bg-primary-dark"
                >
                  {updateProfile.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-primary-dark">Admin Information</h3>
                <p className="mt-0.5 text-xs text-portal-muted">
                  Role and access summary for this portal account.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-portal-muted">Role</p>
                    <p className="mt-1 text-sm font-semibold text-portal-heading">
                      {roleBadgeLabel(role)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-portal-muted">Admin ID</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-portal-heading">
                      {shortId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-portal-muted">Department</p>
                    <p className="mt-1 text-sm font-semibold text-portal-heading">
                      Portal Administration
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-portal-muted">Permissions</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {permissions.map((perm, i) => (
                      <span
                        key={perm}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-bold",
                          i === 0
                            ? "bg-primary/15 text-primary-dark"
                            : i === 1
                              ? "bg-sky-100 text-sky-700"
                              : "bg-violet-100 text-violet-700"
                        )}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center rounded-2xl bg-gold/15 px-5 py-4 text-center">
                <Award className="size-10 text-gold-dark" aria-hidden />
                <p className="mt-2 text-xs font-bold text-gold-dark">
                  {roleBadgeLabel(role)}
                </p>
                <p className="mt-0.5 text-[10px] text-portal-muted">
                  {role === "super_admin"
                    ? "Full system access"
                    : "Admin portal access"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <h3 className="text-sm font-bold text-primary-dark">Connected Accounts</h3>
            <p className="mt-0.5 text-xs text-portal-muted">
              Sign-in methods linked to this admin account.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  {
                    id: "local",
                    label: "Email & Password",
                    icon: KeyRound,
                    connected: authProvider === "local",
                  },
                  {
                    id: "google",
                    label: "Google",
                    icon: Globe,
                    connected: authProvider === "google",
                  },
                  {
                    id: "facebook",
                    label: "Facebook",
                    icon: Users,
                    connected: authProvider === "facebook",
                  },
                ] as const
              ).map(({ id, label, icon: Icon, connected }) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-xl border border-portal px-3 py-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-portal-muted/40">
                    <Icon className="size-4 text-portal-heading" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-portal-heading">{label}</p>
                    <p className="truncate text-[11px] text-portal-muted">
                      {connected ? email : "Not linked"}
                    </p>
                  </div>
                  {connected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-dark">
                      <Check className="size-3.5" aria-hidden />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-portal-muted">
                      —
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
