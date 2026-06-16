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

        { label: "Monthly Progress", path: "/teacher/monthly-progress", keywords: "report" },

        { label: "Availability", path: "/teacher/availability", keywords: "free am i" },

        { label: "Request Student", path: "/teacher/student-requests", keywords: "new student" },

        { label: "Student Care", path: "/teacher/student-care", keywords: "needs care alerts" },

        { label: "Weekly Family Report", path: "/teacher/weekly-report", keywords: "weekly parent report template" },

        { label: "Report Concern", path: "/teacher/report-concern", keywords: "poaching safety conduct" },

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

        { label: "Classes", path: "/student/classes", keywords: "courses schedule" },

        { label: "Homework", path: "/student/homework", keywords: "assignments" },

        { label: "Attendance", path: "/student/attendance", keywords: "present absent" },

        { label: "Progress", path: "/student/progress", keywords: "tajweed hifz" },

        { label: "Weekly Summary", path: "/student/summary", keywords: "weekly report template" },

        { label: "Payments", path: "/student/payments", keywords: "tuition fee zelle wise proof" },

        { label: "Report Concern", path: "/student/report-concern", keywords: "poaching safety" },

        { label: "Profile", path: "/student/profile", keywords: "account settings" },

        { label: "Notifications", path: "/student/notifications", keywords: "alerts" },

      ];

    case "super_admin":
    case "admin":

      return [

        { label: "Dashboard", path: "/admin", keywords: "home overview" },

        { label: "Users", path: "/admin/users", keywords: "students teachers" },

        { label: "Payments", path: "/admin/payments", keywords: "tuition billing zelle wise approve" },

        { label: "Curriculum", path: "/admin/curriculum", keywords: "programs quran tajweed tree" },

        { label: "Classes", path: "/admin/classes", keywords: "courses schedule" },

        { label: "Academy Routine", path: "/admin/schedule/routine", keywords: "weekly slots" },

        { label: "Class Logs", path: "/admin/class-logs", keywords: "approve sessions" },

        { label: "Trial Bookings", path: "/admin/trial-bookings", keywords: "leads website form" },

        { label: "Contact Messages", path: "/admin/contact-messages", keywords: "contact enquiry email" },

        { label: "Student Requests", path: "/admin/student-requests", keywords: "assign student" },

        { label: "Homework", path: "/admin/homework", keywords: "assignments" },

        { label: "Monthly Progress", path: "/admin/monthly-progress", keywords: "reports" },

        { label: "Earnings", path: "/admin/earnings", keywords: "pay verify bdt" },

        { label: "Attendance", path: "/admin/attendance", keywords: "present absent" },

        { label: "Progress", path: "/admin/progress", keywords: "reports" },

        { label: "Student Care", path: "/admin/student-care", keywords: "needs care alerts" },

        { label: "Concern Reports", path: "/admin/concern-reports", keywords: "poaching safety conduct" },

        { label: "Blog", path: "/admin/blog", keywords: "posts cms" },

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

