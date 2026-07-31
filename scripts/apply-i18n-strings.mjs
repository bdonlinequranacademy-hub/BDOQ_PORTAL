import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const REPLACEMENTS = [
  [/label="Export"/g, 'label={t("admin.common.export")}'],
  [/>\s*Export\s*</g, '>{t("admin.common.export")}<'],
  [/>\s*Refresh\s*</g, '>{t("admin.trialLeads.actionRefresh")}<'],
  [/>\s*Refreshing…\s*</g, '>{t("admin.trialLeads.refreshing")}<'],
  [/>\s*Quick actions\s*</g, '>{t("admin.cms.shared.quickActions")}<'],
  [/>\s*Total\s*</g, '>{t("stats.total")}<'],
  [/placeholder="Search posts…"/g, 'placeholder={t("admin.cms.shared.searchPosts")}'],
  [/placeholder="Search packages…"/g, 'placeholder={t("admin.cms.shared.searchPackages")}'],
  [/placeholder="Search reviews…"/g, 'placeholder={t("admin.cms.shared.searchReviews")}'],
  [/placeholder="Search resources…"/g, 'placeholder={t("admin.cms.shared.searchResources")}'],
  [/placeholder="Search gallery…"/g, 'placeholder={t("admin.cms.shared.searchGallery")}'],
  [/placeholder="Search name, email, phone…"/g, 'placeholder={t("admin.admissions.searchPlaceholder")}'],
  [/placeholder="Search teacher, course, note…"/g, 'placeholder={t("admin.studentRequests.toolbarSearchPlaceholder")}'],
  [/placeholder="Search name, email, subject…"/g, 'placeholder={t("admin.contact.listSearchPlaceholder")}'],
  [/placeholder="Search student, course, ID…"/g, 'placeholder={t("admin.certificates.historySearch")}'],
  [/placeholder="Type your reply…"/g, 'placeholder={t("admin.contact.conversationReplyPlaceholder")}'],
  [/placeholder="Optional note for the teacher…"/g, 'placeholder={t("admin.studentRequests.notePlaceholder")}'],
  [/>\s*New post\s*</g, '>{t("admin.common.newPost")}<'],
  [/>\s*New item\s*</g, '>{t("admin.cms.shared.newItem")}<'],
  [/>\s*View all\s*</g, '>{t("admin.common.viewAllTeachers")}<'],
  [/>\s*View on website\s*</g, '>{t("admin.cms.shared.viewWebsite")}<'],
  [/>\s*Live preview\s*</g, '>{t("admin.cms.shared.livePreview")}<'],
  [/>\s*Recent posts\s*</g, '>{t("admin.cms.shared.recentPosts")}<'],
  [/>\s*Categories\s*</g, '>{t("admin.cms.shared.categories")}<'],
  [/>\s*Status overview\s*</g, '>{t("admin.cms.shared.statusOverview")}<'],
  [/>\s*Top rated\s*</g, '>{t("admin.cms.shared.topRated")}<'],
  [/>\s*Rating distribution\s*</g, '>{t("admin.cms.shared.ratingDistribution")}<'],
  [/>\s*Media types\s*</g, '>{t("admin.cms.shared.mediaTypes")}<'],
  [/>\s*Publishing checklist\s*</g, '>{t("admin.cms.shared.publishingChecklist")}<'],
  [/>\s*Assets breakdown\s*</g, '>{t("admin.cms.shared.assetsBreakdown")}<'],
  [/>\s*Gallery settings\s*</g, '>{t("admin.cms.shared.settingsTitle")}<'],
  [/>\s*Tip\s*</g, '>{t("admin.cms.shared.tipBanner")}<'],
  [/>\s*All categories\s*</g, '>{t("admin.cms.shared.allCategories")}<'],
  [/>\s*All types\s*</g, '>{t("admin.cms.shared.allTypes")}<'],
  [/>\s*No items match your filters\s*</g, '>{t("admin.cms.shared.noMatch")}<'],
  [/>\s*Create new user\s*</g, '>{t("admin.users.createTitle")}<'],
  [/>\s*Edit user\s*</g, '>{t("admin.users.editTitle")}<'],
  [/>\s*Create user\s*</g, '>{t("admin.users.createUser")}<'],
  [/>\s*Save changes\s*</g, '>{t("admin.users.saveChanges")}<'],
  [/>\s*Saving…\s*</g, '>{t("admin.users.saving")}<'],
  [/>\s*Creating…\s*</g, '>{t("admin.users.creating")}<'],
  [/>\s*Join\s*</g, '>{t("shared.schedule.join")}<'],
  [/>\s*Log Session\s*</g, '>{t("shared.schedule.logSession")}<'],
  [/>\s*Lesson report\s*</g, '>{t("shared.schedule.lessonReport")}<'],
  [/>\s*Submit for Approval\s*</g, '>{t("shared.schedule.submitForApproval")}<'],
  [/>\s*Submitting…\s*</g, '>{t("shared.schedule.submitting")}<'],
  [/>\s*Close\s*</g, '>{t("shared.schedule.close")}<'],
  [/>\s*Student\s*</g, '>{t("shared.schedule.student")}<'],
  [/>\s*Teacher\s*</g, '>{t("shared.schedule.teacher")}<'],
  [/>\s*Earnings\s*</g, '>{t("shared.schedule.earnings")}<'],
  [/>\s*Reject\s*</g, '>{t("admin.studentRequests.listReject")}<'],
  [/>\s*Approve\s*</g, '>{t("admin.studentRequests.listApprove")}<'],
  [/>\s*Total requests\s*</g, '>{t("admin.studentRequests.statsTotal")}<'],
  [/>\s*Pending review\s*</g, '>{t("admin.studentRequests.statsPending")}<'],
  [/>\s*How this works\s*</g, '>{t("admin.studentRequests.howItWorksTitle")}<'],
  [/>\s*All messages\s*</g, '>{t("admin.contact.statsAll")}<'],
  [/>\s*Requires reply\s*</g, '>{t("admin.contact.statsNeedsReply")}<'],
  [/>\s*Replied\s*</g, '>{t("admin.contact.statsReplied")}<'],
  [/>\s*Archived\s*</g, '>{t("admin.contact.statsArchived")}<'],
  [/>\s*Mark replied\s*</g, '>{t("admin.contact.actionMarkReplied")}<'],
  [/>\s*Archive\s*</g, '>{t("admin.contact.actionArchive")}<'],
  [/>\s*Restore\s*</g, '>{t("admin.contact.actionRestore")}<'],
  [/>\s*Send reply\s*</g, '>{t("admin.contact.conversationSend")}<'],
  [/>\s*Total Certificates\s*</g, '>{t("admin.certificates.statsTotal")}<'],
  [/>\s*Certificate history\s*</g, '>{t("admin.certificates.historyTitle")}<'],
  [/>\s*Design & Template\s*</g, '>{t("admin.certificates.templateTitle")}<'],
  [/>\s*Save section header\s*</g, '>{t("admin.cms.sectionHeaders.saveHeader")}<'],
  [/>\s*Save header\s*</g, '>{t("admin.cms.sectionHeaders.saveHeader")}<'],
  [/>\s*Published\s*</g, '>{t("admin.common.statPublished")}<'],
  [/>\s*Drafts\s*</g, '>{t("admin.cms.shared.statDrafts")}<'],
  [/>\s*Draft\s*</g, '>{statusLabel("draft")}<'],
  [/>\s*Featured\s*</g, '>{t("admin.cms.shared.statFeatured")}<'],
  [/>\s*All\s*</g, '>{t("labels.all")}<'],
  [/option value="">All categories<\/option>/g, 'option value="">{t("admin.cms.shared.allCategories")}</option>'],
  [/option value="newest">Newest first<\/option>/g, 'option value="newest">{t("admin.studentRequests.toolbarSortNewest")}</option>'],
  [/option value="oldest">Oldest first<\/option>/g, 'option value="oldest">{t("admin.studentRequests.toolbarSortOldest")}</option>'],
];

const HOOK_FULL =
  "const { t, statusLabel, dynamicLabel, role, formatDate, formatDateTime, formatMoney, formatBdt, formatUsd, formatNumber, pickField } = usePortalTranslation();";
const HOOK_MIN = "const { t, statusLabel, formatBdt, formatNumber, formatDateTime } = usePortalTranslation();";

function processFile(abs) {
  let src = fs.readFileSync(abs, "utf8");
  if (!src.includes("usePortalTranslation()")) return false;

  for (const [from, to] of REPLACEMENTS) {
    src = src.replace(from, to);
  }

  if (src.includes(HOOK_FULL) && !src.includes('t("')) {
    src = src.replace(HOOK_FULL, HOOK_MIN);
  } else if (src.includes(HOOK_FULL)) {
    // trim unused destructuring - keep t and what's used
    const uses = {
      t: src.includes("t("),
      statusLabel: src.includes("statusLabel("),
      dynamicLabel: src.includes("dynamicLabel("),
      role: src.includes("role("),
      formatDate: src.includes("formatDate("),
      formatDateTime: src.includes("formatDateTime("),
      formatMoney: src.includes("formatMoney("),
      formatBdt: src.includes("formatBdt("),
      formatUsd: src.includes("formatUsd("),
      formatNumber: src.includes("formatNumber("),
      pickField: src.includes("pickField("),
    };
    const parts = Object.entries(uses)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (parts.length === 0) parts.push("t");
    src = src.replace(
      /const \{ t, statusLabel, dynamicLabel, role, formatDate, formatDateTime, formatMoney, formatBdt, formatUsd, formatNumber, pickField \} = usePortalTranslation\(\);/,
      `const { ${parts.join(", ")} } = usePortalTranslation();`
    );
  }

  fs.writeFileSync(abs, src);
  return true;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".tsx") && fs.readFileSync(p, "utf8").includes("usePortalTranslation()")) out.push(p);
  }
  return out;
}

const dirs = [
  "src/features/admin/components",
  "src/components/schedule",
].map((d) => path.join(ROOT, d));

let n = 0;
for (const dir of dirs) {
  for (const f of walk(dir)) {
    if (processFile(f)) n++;
  }
}
// also student-admissions and earnings already done
console.log("processed", n);
