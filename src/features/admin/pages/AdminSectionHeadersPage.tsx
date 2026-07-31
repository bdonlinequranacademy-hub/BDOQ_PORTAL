import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { useAdminSectionHeaders } from "@/features/admin/hooks/useAdmin";
import { AdminSectionHeaderPanel } from "@/features/admin/components/sectionHeaders/AdminSectionHeaderPanel";
import { SECTION_HEADER_CONFIGS } from "@/features/admin/components/sectionHeaders/adminSectionHeaderUtils";
import { formHintClass } from "@/lib/formControl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminSectionHeadersPage() {
  const { t } = usePortalTranslation();
  const { isLoading } = useAdminSectionHeaders();

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label={t("admin.common.loadingSectionHeaders")} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          {t("admin.common.websiteCms")}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-primary-dark">
          {t("admin.cms.sectionHeaders.title")}
        </h1>
        <p className={formHintClass}>
          {t("admin.cms.sectionHeaders.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        {SECTION_HEADER_CONFIGS.map((config) => (
          <AdminSectionHeaderPanel
            key={config.sectionKey}
            sectionKey={config.sectionKey}
          />
        ))}
      </div>
    </PageContainer>
  );
}
