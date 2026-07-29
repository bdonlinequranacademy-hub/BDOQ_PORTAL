import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { useAdminSectionHeaders } from "@/features/admin/hooks/useAdmin";
import { AdminSectionHeaderPanel } from "@/features/admin/components/sectionHeaders/AdminSectionHeaderPanel";
import { SECTION_HEADER_CONFIGS } from "@/features/admin/components/sectionHeaders/adminSectionHeaderUtils";
import { formHintClass } from "@/lib/formControl";

export function AdminSectionHeadersPage() {
  const { isLoading } = useAdminSectionHeaders();

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading section headers…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Website CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-primary-dark">
          Section Headers
        </h1>
        <p className={formHintClass}>
          Edit badge, headline, and subheadline for home sections and public
          pages. Item CMS pages (FAQ, testimonials, gallery, etc.) also include
          a quick header panel at the top.
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
