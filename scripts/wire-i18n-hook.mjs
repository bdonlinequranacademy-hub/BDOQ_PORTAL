/**
 * Wire usePortalTranslation into batch-2 admin components.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMPORT = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";\n';
const HOOK =
  "  const { t, statusLabel, dynamicLabel, role, formatDate, formatDateTime, formatMoney, formatBdt, formatUsd, formatNumber, pickField } = usePortalTranslation();\n";

const TARGETS = [
  "src/features/admin/components/teacher-applications/AdminTeacherApplicationsTable.tsx",
  "src/features/admin/components/teacher-applications/AdminTeacherApplicationsSidebar.tsx",
  "src/features/admin/components/teacher-applications/AdminTeacherApplicationDetailModal.tsx",
  "src/features/admin/components/student-requests/AdminStudentRequestsStatsGrid.tsx",
  "src/features/admin/components/student-requests/AdminStudentRequestsToolbar.tsx",
  "src/features/admin/components/student-requests/AdminStudentRequestsList.tsx",
  "src/features/admin/components/student-requests/AdminStudentRequestsSidebar.tsx",
  "src/features/admin/components/student-requests/AdminStudentRequestsPendingAlert.tsx",
  "src/features/admin/components/student-requests/AdminStudentRequestsHowItWorks.tsx",
  "src/features/admin/components/contact-inbox/AdminContactInboxStatsGrid.tsx",
  "src/features/admin/components/contact-inbox/AdminContactInboxList.tsx",
  "src/features/admin/components/contact-inbox/AdminContactInboxDetails.tsx",
  "src/features/admin/components/contact-inbox/AdminContactInboxConversation.tsx",
  "src/features/admin/components/contact-inbox/AdminContactInboxNewAlert.tsx",
  "src/features/admin/components/certificates/AdminCertificatesStatsGrid.tsx",
  "src/features/admin/components/certificates/AdminCertificatesHistory.tsx",
  "src/features/admin/components/certificates/AdminCertificateTemplatePanel.tsx",
  "src/features/admin/components/certificates/AdminCertFormSection.tsx",
  "src/features/admin/components/blog/AdminBlogOverviewHeader.tsx",
  "src/features/admin/components/blog/AdminBlogQuickActions.tsx",
  "src/features/admin/components/blog/AdminBlogRecentPosts.tsx",
  "src/features/admin/components/blog/AdminBlogCategoriesCard.tsx",
  "src/features/admin/components/blog/AdminBlogTable.tsx",
  "src/features/admin/components/blog/AdminBlogToolbar.tsx",
  "src/features/admin/components/pricing/AdminPricingStatsGrid.tsx",
  "src/features/admin/components/pricing/AdminPricingOverviewHeader.tsx",
  "src/features/admin/components/pricing/AdminPricingFormSection.tsx",
  "src/features/admin/components/pricing/AdminPricingLivePreview.tsx",
  "src/features/admin/components/pricing/AdminPricingTipBanner.tsx",
  "src/features/admin/components/pricing/AdminPricingQuickActions.tsx",
  "src/features/admin/components/pricing/AdminPricingStatusOverview.tsx",
  "src/features/admin/components/pricing/AdminPricingTable.tsx",
  "src/features/admin/components/pricing/AdminPricingToolbar.tsx",
  "src/features/admin/components/gallery/AdminGalleryStatsGrid.tsx",
  "src/features/admin/components/gallery/AdminGalleryOverviewHeader.tsx",
  "src/features/admin/components/gallery/AdminGalleryRecentList.tsx",
  "src/features/admin/components/gallery/AdminGalleryMediaForm.tsx",
  "src/features/admin/components/gallery/AdminGalleryPreviewCard.tsx",
  "src/features/admin/components/gallery/AdminGallerySettingsPanel.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsMediaTypesCard.tsx",
  "src/features/admin/components/testimonials/TestimonialMediaBadge.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsRatingDistribution.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsStatsGrid.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsToolbar.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsOverviewHeader.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsTipBanner.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsTopRated.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsTable.tsx",
  "src/features/admin/components/testimonials/AdminTestimonialsQuickActions.tsx",
  "src/features/admin/components/resources/AdminResourcesStatsGrid.tsx",
  "src/features/admin/components/resources/AdminResourcesToolbar.tsx",
  "src/features/admin/components/resources/AdminResourceChecklist.tsx",
  "src/features/admin/components/resources/AdminResourceLivePreview.tsx",
  "src/features/admin/components/resources/AdminResourceFormSection.tsx",
  "src/features/admin/components/resources/AdminResourcesAssetsCard.tsx",
  "src/features/admin/components/resources/AdminResourcesQuickActions.tsx",
  "src/features/admin/components/resources/AdminResourcesCategoriesCard.tsx",
  "src/features/admin/components/resources/AdminResourcesTable.tsx",
  "src/features/admin/components/resources/AdminResourcesOverviewHeader.tsx",
  "src/features/admin/components/sectionHeaders/AdminSectionHeaderPanel.tsx",
  "src/features/admin/components/AdminCreateUserModal.tsx",
  "src/features/admin/components/AdminEditUserModal.tsx",
  "src/features/admin/components/AdminUserFormSection.tsx",
  "src/components/schedule/SessionScheduleTable.tsx",
  "src/components/schedule/SessionTimelineRow.tsx",
  "src/components/schedule/SessionSlotCard.tsx",
  "src/components/schedule/SessionActionButtons.tsx",
  "src/components/schedule/ScheduleViewToggle.tsx",
  "src/components/schedule/SessionTimeRow.tsx",
  "src/components/schedule/LogSessionSheet.tsx",
  "src/components/schedule/ClassLogCard.tsx",
  "src/components/schedule/WeeklySchedule.tsx",
];

function wireFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return { rel, status: "missing" };
  let src = fs.readFileSync(abs, "utf8");
  if (src.includes("usePortalTranslation()")) return { rel, status: "skip" };

  if (!src.includes("usePortalTranslation")) {
    const idx = src.lastIndexOf("\nimport ");
    if (idx >= 0) {
      const end = src.indexOf("\n", idx + 1);
      src = src.slice(0, end + 1) + IMPORT + src.slice(end + 1);
    } else {
      src = IMPORT + src;
    }
  }

  // Add hook to each exported function component (not nested helpers with Display/Inner prefix only once per export)
  src = src.replace(
    /export function (\w+)\([^)]*\)\s*\{/g,
    (match, name, offset, whole) => {
      const after = whole.slice(offset + match.length, offset + match.length + 200);
      if (after.includes("usePortalTranslation()")) return match;
      return `${match}\n${HOOK}`;
    }
  );

  fs.writeFileSync(abs, src);
  return { rel, status: "wired" };
}

const results = TARGETS.map(wireFile);
console.log(
  results
    .filter((r) => r.status === "wired")
    .map((r) => r.rel)
    .join("\n")
);
console.log("wired:", results.filter((r) => r.status === "wired").length);
console.log("skipped:", results.filter((r) => r.status === "skip").length);
