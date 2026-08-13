import type { Role } from "@/types/models";

export interface PortalPageLink {
  label: string;
  path: string;
  keywords?: string;
}

export function portalPagesForRole(role: Role): PortalPageLink[] {
  switch (role) {
    case "teacher":
      return [
        { label: "Dashboard", path: "/teacher", keywords: "home" },
        { label: "Today's Schedule", path: "/teacher/schedule/today", keywords: "today classes" },
        { label: "My Routine", path: "/teacher/schedule/routine", keywords: "weekly schedule" },
        { label: "Class Logs", path: "/teacher/class-logs", keywords: "session logs" },
        { label: "Earnings", path: "/teacher/earnings", keywords: "pay salary bdt" },
        { label: "Gifts & Donations", path: "/teacher/gifts", keywords: "bakhshish eid sadaqah donation sponsor" },
        { label: "Availability", path: "/teacher/availability", keywords: "free am i" },
        { label: "Request Student", path: "/teacher/student-requests", keywords: "new student" },
        { label: "Weekly Family Report", path: "/teacher/weekly-report", keywords: "weekly parent report template" },
        { label: "My Students", path: "/teacher/students", keywords: "students list" },
        { label: "My Classes", path: "/teacher/classes", keywords: "courses" },
        { label: "Homework", path: "/teacher/homework", keywords: "assign grade" },
        { label: "Attendance", path: "/teacher/attendance", keywords: "present absent sheet" },
        { label: "Progress", path: "/teacher/progress", keywords: "tajweed surah update" },
        { label: "Profile", path: "/teacher/profile", keywords: "account settings password" },
        { label: "Notifications", path: "/teacher/notifications", keywords: "alerts" },
      ];
    case "student":
      return [
        { label: "Dashboard", path: "/student", keywords: "home" },
        { label: "My Classes", path: "/student/classes", keywords: "quran courses tajweed hifz" },
        { label: "Homework", path: "/student/homework", keywords: "assignments tajweed practice" },
        { label: "Attendance", path: "/student/attendance", keywords: "present absent class" },
        { label: "Progress", path: "/student/progress", keywords: "tajweed hifz noorani qaida" },
        { label: "Weekly Summary", path: "/student/summary", keywords: "weekly report parent" },
        { label: "Payments", path: "/student/payments", keywords: "tuition fee bdt monthly package" },
        { label: "Gifts & Donations", path: "/student/gifts", keywords: "bakhshish eid sadaqah donation sponsor gift" },
        { label: "Notifications", path: "/student/notifications", keywords: "alerts class reminder" },
        { label: "Profile", path: "/student/profile", keywords: "account settings" },
      ];
    case "super_admin":
    case "admin":
      return [
        { label: "Dashboard", path: "/admin", keywords: "home overview" },
        { label: "WhatsApp queue", path: "/admin/whatsapp-queue", keywords: "whatsapp payment reminder leads" },
        { label: "Users", path: "/admin/users", keywords: "students teachers" },
        { label: "Payments", path: "/admin/payments", keywords: "tuition billing zelle wise approve" },
        { label: "Gifts & Donations", path: "/admin/gifts", keywords: "bakhshish eid sadaqah donation sponsor optional" },
        { label: "Curriculum", path: "/admin/curriculum", keywords: "programs quran tajweed tree" },
        { label: "Classes", path: "/admin/classes", keywords: "courses schedule" },
        { label: "Academy Routine", path: "/admin/schedule/routine", keywords: "weekly slots" },
        { label: "Class Logs", path: "/admin/class-logs", keywords: "approve sessions" },
        { label: "Free Class Leads", path: "/admin/trial-bookings", keywords: "free trial website form" },
        { label: "Contact Inbox", path: "/admin/contact-messages", keywords: "contact enquiry email" },
        {
          label: "Newsletter",
          path: "/admin/newsletter-subscribers",
          keywords: "newsletter subscribe email footer list",
        },
        { label: "Student Admissions", path: "/admin/student-admissions", keywords: "public admission form website" },
        { label: "Teacher Applications", path: "/admin/teacher-applications", keywords: "teacher registration cv" },
        { label: "Teacher Requests", path: "/admin/student-requests", keywords: "teacher request student assign" },
        { label: "Homework", path: "/admin/homework", keywords: "assignments" },
        { label: "Earnings", path: "/admin/earnings", keywords: "pay verify bdt" },
        { label: "Attendance", path: "/admin/attendance", keywords: "present absent" },
        { label: "Progress", path: "/admin/progress", keywords: "reports" },
        { label: "Blog", path: "/admin/blog", keywords: "posts cms" },
        { label: "Student Reviews", path: "/admin/testimonials", keywords: "testimonials reviews video audio text homepage" },
        { label: "Resources", path: "/admin/resources", keywords: "ebooks audio videos cms" },
        { label: "Certificates", path: "/admin/certificates", keywords: "certificate achievement generate pdf" },
        { label: "Profile", path: "/admin/profile", keywords: "account settings password" },
      ];
    default:
      return [];
  }
}

export function filterPortalPages(role: Role, query: string): PortalPageLink[] {
  const q = query.trim().toLowerCase();
  if (!q) return portalPagesForRole(role).slice(0, 6);
  return portalPagesForRole(role).filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.path.toLowerCase().includes(q) ||
      (p.keywords?.toLowerCase().includes(q) ?? false)
  );
}

export function profilePathForRole(role: Role): string | null {
  switch (role) {
    case "student":
      return "/student/profile";
    case "teacher":
      return "/teacher/profile";
    case "admin":
    case "super_admin":
      return "/admin/profile";
    default:
      return null;
  }
}
