import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

/**
 * Legacy routes `/admin/gallery/new` and `/admin/gallery/:id/edit`
 * now redirect into the unified Gallery CMS workspace.
 */
export function AdminGalleryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = usePortalTranslation();

  useEffect(() => {
    if (id) {
      navigate(`/admin/gallery?edit=${id}`, { replace: true });
      return;
    }
    navigate("/admin/gallery", { replace: true });
  }, [id, navigate]);

  return (
    <PageContainer>
      <PageLoading label={t("admin.common.openingGalleryCms")} />
    </PageContainer>
  );
}
