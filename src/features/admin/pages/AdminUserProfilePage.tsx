import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useAdminUserProfile,
  useDeleteUser,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { AdminTeacherProfileView } from "@/features/admin/components/users/AdminTeacherProfileView";
import { AdminStudentProfileView } from "@/features/admin/components/users/AdminStudentProfileView";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminUserProfilePage() {
  const { t, role: translateRole } = usePortalTranslation();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAdminUserProfile(id);
  const deleteUser = useDeleteUser();

  function handleEdit() {
    if (!data?.user) return;
    navigate(`/admin/users?edit=${data.user.id}&role=${data.user.role}`);
  }

  function handleDeactivate() {
    if (!data?.user) return;
    if (
      !window.confirm(
        t("admin.userProfile.confirmDeactivate", { name: data.user.name })
      )
    ) {
      return;
    }
    deleteUser.mutate(data.user.id, {
      onSuccess: () => navigate("/admin/users"),
    });
  }

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label={t("admin.common.loadingProfile")} />
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer>
        <EmptyState
          title={t("admin.userProfile.notFound")}
          description={t("admin.common.loadErrorDesc")}
          actionLabel={t("admin.userProfile.backToUsers")}
          onAction={() => navigate("/admin/users")}
        />
      </PageContainer>
    );
  }

  if (data.kind === "teacher") {
    return (
      <PageContainer>
        <AdminTeacherProfileView
          data={data}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
      </PageContainer>
    );
  }

  if (data.kind === "student") {
    return (
      <PageContainer>
        <AdminStudentProfileView
          data={data}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
      </PageContainer>
    );
  }

  const { user, stats } = data;

  return (
    <PageContainer className="gap-5">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-portal-muted transition hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("admin.userProfile.backToUsers")}
      </Link>

      <section className="rounded-3xl border border-portal bg-portal-surface p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <UserAvatar
            name={user.name}
            avatarUrl={user.avatarUrl}
            gender={user.gender}
            size="xl"
            shape="circle"
          />
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-dark">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-portal-muted">
              {translateRole(user.role)} · {user.email}
            </p>
            <p className="mt-1 text-sm text-portal-muted">
              {t("admin.userProfile.onPlatformYears", {
                count: String(stats.yearsOnPlatform),
              })}
            </p>
            <button
              type="button"
              onClick={handleEdit}
              className="mt-4 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary hover:text-white"
            >
              {t("admin.userProfile.editUser")}
            </button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
