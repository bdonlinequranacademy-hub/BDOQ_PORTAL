/**
 * Batch 2 i18n: add hooks to nested helpers using t(), extend string replacements, trim unused destructuring.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const HOOK_LINE =
  "  const { t, statusLabel, dynamicLabel, formatDate, formatDateTime, formatMoney, formatBdt, formatUsd, formatNumber, pickField } = usePortalTranslation();";
const HOOK_IMPORT = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";';

const REPLACEMENTS = [
  // Teacher applications table
  [/<th className="px-5 py-3\.5">Applicant<\/th>/g, '<th className="px-5 py-3.5">{t("admin.teacherApplications.tableApplicant")}</th>'],
  [/<th className="px-5 py-3\.5">Subjects<\/th>/g, '<th className="px-5 py-3.5">{t("admin.teacherApplications.tableSubject")}</th>'],
  [/<th className="px-5 py-3\.5">Experience<\/th>/g, '<th className="px-5 py-3.5">{t("admin.experience")}</th>'],
  [/<th className="px-5 py-3\.5">Qualification<\/th>/g, '<th className="px-5 py-3.5">{t("admin.qualifications")}</th>'],
  [/<th className="px-5 py-3\.5">Applied on<\/th>/g, '<th className="px-5 py-3.5">{t("admin.teacherApplications.tableSubmitted")}</th>'],
  [/<th className="px-5 py-3\.5">Status<\/th>/g, '<th className="px-5 py-3.5">{t("tables.status")}</th>'],
  [/<th className="px-5 py-3\.5 text-right">Actions<\/th>/g, '<th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>'],
  [/title="View application"/g, 'title={t("admin.teacherApplications.viewApplication")}'],
  [/aria-label=\{`View \$\{app\.fullName\}`\}/g, 'aria-label={t("admin.teacherApplications.viewApplication")}'],
  [/<h2 className="text-sm font-bold text-portal-heading">Search &amp; filters<\/h2>/g, '<h2 className="text-sm font-bold text-portal-heading">{t("admin.teacherApplications.toolbarTitle")}</h2>'],
  [/placeholder="Search name, email, phone…"/g, 'placeholder={t("admin.teacherApplications.searchPlaceholder")}'],
  [/aria-label="Search teacher applications"/g, 'aria-label={t("admin.teacherApplications.searchPlaceholder")}'],
  [/aria-label="Filter by subject"/g, 'aria-label={t("admin.teacherApplications.tableSubject")}'],
  [/aria-label="Filter by country"/g, 'aria-label={t("admin.teacherApplications.tableCountry")}'],
  [/<option value="">All subjects<\/option>/g, '<option value="">{t("admin.teacherApplications.allSubjects")}</option>'],
  [/<option value="">All countries<\/option>/g, '<option value="">{t("admin.teacherApplications.allCountries")}</option>'],
  [/aria-label="Date from"/g, 'aria-label={t("filters.dateFrom")}'],
  [/aria-label="Date to"/g, 'aria-label={t("filters.dateTo")}'],
  [/label: "Review new"/g, 'label: t("admin.admissions.actionReviewNew")'],
  [/label: "Admissions"/g, 'label: t("admin.admissions.title")'],
  [/label: "Contact inbox"/g, 'label: t("admin.contact.title")'],
  [/>\s*Application overview\s*</g, '>{t("admin.teacherApplications.sidebarConversion")}<'],
  [/>\s*Recent applications\s*</g, '>{t("admin.cms.shared.recentItems")}<'],
  [/>\s*Top subjects applied\s*</g, '>{t("admin.teacherApplications.sidebarSubjects")}<'],
  [/>\s*No applications yet\.\s*</g, '>{t("admin.teacherApplications.noApplications")}<'],
  [/>\s*No recent submissions\.\s*</g, '>{t("admin.cms.shared.noRecent")}<'],
  [/>\s*No subject data yet\.\s*</g, '>{t("admin.cms.shared.noRecent")}<'],
  [/>\s*Request overview\s*</g, '>{t("admin.studentRequests.sidebarStatusChart")}<'],
  [/>\s*Top courses requested\s*</g, '>{t("admin.studentRequests.sidebarByCourse")}<'],
  [/>\s*Recent activity\s*</g, '>{t("admin.studentRequests.sidebarActivity")}<'],
  [/>\s*No requests yet\.\s*</g, '>{t("admin.studentRequests.noRequests")}<'],
  [/>\s*No course data yet\.\s*</g, '>{t("admin.cms.shared.noRecent")}<'],
  [/>\s*No recent activity\.\s*</g, '>{t("admin.cms.shared.noRecent")}<'],
  [/>\s*Export report\s*</g, '>{t("admin.common.export")}<'],
  [/>\s*Go to Classes\s*</g, '>{t("admin.classes.title")}<'],
  [/>\s*Review pending \(\{pendingCount\}\)\s*</g, '>{t("admin.studentRequests.alertCta")} ({formatNumber(pendingCount)})<'],
  [/aria-label="Close application details"/g, 'aria-label={t("admin.admissions.modalClose")}'],
  [/>\s*Admin note\s*</g, '>{t("admin.admissions.modalAdminNote")}<'],
  [/>\s*Uploaded documents\s*</g, '>{t("admin.teacherApplications.modalDocuments")}<'],
  [/>\s*Reply via email\s*</g, '>{t("admin.admissions.modalReplyEmail")}<'],
  [/label="WhatsApp"/g, 'label={t("admin.admissions.modalWhatsApp")}'],
  [/>\s*Newest first\s*</g, '>{t("admin.studentRequests.toolbarSortNewest")}<'],
  [/>\s*Oldest first\s*</g, '>{t("admin.studentRequests.toolbarSortOldest")}<'],
  [/>\s*No requests in this view\s*</g, '>{t("admin.studentRequests.listEmpty")}<'],
  [/>\s*Pending student requests\s*</g, '>{t("admin.studentRequests.alertTitle")}<'],
  [/>\s*Unread contact messages\s*</g, '>{t("admin.contact.alertTitle")}<'],
  [/>\s*Original message\s*</g, '>{t("admin.contact.conversationOriginal")}<'],
  [/>\s*Name\s*</g, '>{t("admin.contact.detailsName")}<'],
  [/>\s*Email\s*</g, '>{t("admin.contact.detailsEmail")}<'],
  [/>\s*Subject\s*</g, '>{t("admin.contact.detailsSubject")}<'],
  [/>\s*Received\s*</g, '>{t("admin.contact.detailsReceived")}<'],
  [/>\s*No messages in this tab\s*</g, '>{t("admin.contact.listEmpty")}<'],
  [/>\s*Issued\s*</g, '>{t("admin.certificates.statsIssued")}<'],
  [/>\s*With badge\s*</g, '>{t("admin.certificates.statsWithBadge")}<'],
  [/>\s*This month\s*</g, '>{t("admin.cms.shared.statThisMonth")}<'],
  [/>\s*No certificates issued yet\s*</g, '>{t("admin.certificates.historyEmpty")}<'],
  [/>\s*View\s*</g, '>{t("admin.certificates.historyView")}<'],
  [/>\s*Download\s*</g, '>{t("admin.certificates.historyDownload")}<'],
  [/>\s*Certificate details\s*</g, '>{t("admin.certificates.formSectionDetails")}<'],
  [/>\s*Additional options\s*</g, '>{t("admin.certificates.formSectionOptions")}<'],
  [/>\s*Week\s*</g, '>{t("shared.schedule.weekView")}<'],
  [/>\s*List\s*</g, '>{t("shared.schedule.listView")}<'],
  [/>\s*Schedule view\s*</g, '>{t("shared.schedule.scheduleView")}<'],
  [/>\s*No schedule yet\s*</g, '>{t("shared.schedule.noSchedule")}<'],
  [/>\s*Mark attendance\s*</g, '>{t("shared.schedule.markAttendance")}<'],
  [/>\s*Cancel session\s*</g, '>{t("shared.schedule.cancelSession")}<'],
  [/>\s*Session date\s*</g, '>{t("shared.schedule.sessionDate")}<'],
  [/>\s*Topics covered \(optional\)\s*</g, '>{t("shared.schedule.topicsCovered")}<'],
  [/placeholder="e\.g\. Surah Al-Mulk, Madd rules, homework review"/g, 'placeholder={t("shared.schedule.topicsPlaceholder")}'],
  [/placeholder="What was covered in today's class\? Tajweed corrections, surahs revised, homework assigned…"/g, 'placeholder={t("shared.schedule.lessonReportPlaceholder")}'],
  [/>\s*Loading curriculum…\s*</g, '>{t("shared.schedule.loadingCurriculum")}<'],
  [/>\s*Select section\s*</g, '>{t("admin.cms.sectionHeaders.selectSection")}<'],
  [/>\s*Saving…\s*</g, '>{t("admin.cms.sectionHeaders.saving")}<'],
  [/>\s*Account role\s*</g, '>{t("admin.users.accountRole")}<'],
  [/>\s*Account details\s*</g, '>{t("admin.users.sectionAccount")}<'],
  [/>\s*Contact &amp; location\s*</g, '>{t("admin.users.sectionContact")}<'],
  [/>\s*Student setup\s*</g, '>{t("admin.users.sectionStudent")}<'],
  [/>\s*\+ Add study programs\s*</g, '>{t("admin.users.addPrograms")}<'],
  [/>\s*Study programs\s*</g, '>{t("admin.users.studyPrograms")}<'],
  [/>\s*Remove\s*</g, '>{t("admin.users.remove")}<'],
  [/>\s*Deactivate account\s*</g, '>{t("admin.users.deactivate")}<'],
  [/>\s*Reactivate account\s*</g, '>{t("admin.users.reactivate")}<'],
  [/>\s*Generate\s*</g, '>{t("admin.users.generate")}<'],
  [/>\s*Show password\s*</g, '>{t("admin.users.showPassword")}<'],
  [/>\s*Hide password\s*</g, '>{t("admin.users.hidePassword")}<'],
  [/\{ id: "all", label: "All" \}/g, '{ id: "all", label: t("labels.all") }'],
  [/\{ id: "new", label: "New" \}/g, '{ id: "new", label: t("admin.admissions.tabNew") }'],
  [/\{ id: "reviewing", label: "Under review" \}/g, '{ id: "reviewing", label: t("admin.admissions.tabReviewing") }'],
  [/\{ id: "approved", label: "Approved" \}/g, '{ id: "approved", label: t("admin.admissions.tabApproved") }'],
  [/\{ id: "rejected", label: "Rejected" \}/g, '{ id: "rejected", label: statusLabel("rejected") }'],
  [/\{ id: "closed", label: "Closed" \}/g, '{ id: "closed", label: t("admin.admissions.tabClosed") }'],
  [/\{ id: "all", label: "All applications" \}/g, '{ id: "all", label: t("admin.teacherApplications.tabAll") }'],
  [/\+(\{subjects\.extra\}) more/g, '+$1 {t("labels.more")}'],
];

function addHookToFunctionsUsingT(src) {
  // Match function declarations that use t( but don't have usePortalTranslation in first 300 chars
  return src.replace(
    /function (\w+)\([^)]*\)\s*\{/g,
    (match, _name, offset, whole) => {
      const bodyStart = offset + match.length;
      const nextChunk = whole.slice(bodyStart, bodyStart + 800);
      if (!nextChunk.includes("t(") && !nextChunk.includes("statusLabel(")) return match;
      if (nextChunk.includes("usePortalTranslation()")) return match;
      return match + "\n" + HOOK_LINE + "\n";
    }
  );
}

function trimHook(src) {
  const hookRe =
    /const \{ t, statusLabel, dynamicLabel, role, formatDate, formatDateTime, formatMoney, formatBdt, formatUsd, formatNumber, pickField \} = usePortalTranslation\(\);/g;
  return src.replace(hookRe, () => {
    const uses = {
      t: /\bt\(/g,
      statusLabel: /\bstatusLabel\(/g,
      dynamicLabel: /\bdynamicLabel\(/g,
      role: /\brole\(/g,
      formatDate: /\bformatDate\(/g,
      formatDateTime: /\bformatDateTime\(/g,
      formatMoney: /\bformatMoney\(/g,
      formatBdt: /\bformatBdt\(/g,
      formatUsd: /\bformatUsd\(/g,
      formatNumber: /\bformatNumber\(/g,
      pickField: /\bpickField\(/g,
    };
    const parts = Object.entries(uses)
      .filter(([, re]) => re.test(src))
      .map(([k]) => k);
    if (parts.length === 0) return "";
    return `const { ${parts.join(", ")} } = usePortalTranslation();`;
  });
}

function processFile(abs) {
  let src = fs.readFileSync(abs, "utf8");
  const orig = src;

  for (const [from, to] of REPLACEMENTS) {
    src = src.replace(from, to);
  }

  src = addHookToFunctionsUsingT(src);

  if (src.includes("usePortalTranslation()") && !src.includes(HOOK_IMPORT)) {
    const m = src.match(/^((?:import[\s\S]*?;\r?\n)+)/);
    if (m) src = m[1] + HOOK_IMPORT + "\r\n" + src.slice(m[1].length);
  }

  src = trimHook(src);

  // Remove empty hook lines
  src = src.replace(/\n\s*\n\s*\n/g, "\n\n");

  if (src !== orig) {
    fs.writeFileSync(abs, src);
    return true;
  }
  return false;
}

const targets = fs
  .readFileSync(path.join(import.meta.dirname, "wire-i18n-hook.mjs"), "utf8")
  .match(/"src\/[^"]+\.tsx"/g)
  ?.map((s) => s.slice(1, -1))
  .map((rel) => path.join(ROOT, rel)) ?? [];

let n = 0;
for (const abs of targets) {
  if (fs.existsSync(abs) && processFile(abs)) {
    n++;
    console.log(path.relative(ROOT, abs));
  }
}

// Also schedule + user modals already wired
console.log("updated", n, "files");
