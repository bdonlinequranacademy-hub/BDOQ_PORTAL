import type { ReactNode } from "react";
import type { Role } from "@/types/models";

export interface IPortalNavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

export interface IPortalNavSection {
  id: string;
  label: string | null;
  items: IPortalNavItem[];
}

const ADMIN_GROUPS: Record<string, readonly string[]> = {
  management: [
    "/admin/users",
    "/admin/payments",
    "/admin/curriculum",
    "/admin/classes",
    "/admin/schedule/routine",
    "/admin/live-monitor",
    "/admin/class-logs",
    "/admin/homework",
    "/admin/earnings",
    "/admin/attendance",
    "/admin/progress",
  ],
  communication: [
    "/admin/trial-bookings",
    "/admin/contact-messages",
    "/admin/newsletter-subscribers",
    "/admin/student-admissions",
    "/admin/teacher-applications",
    "/admin/student-requests",
  ],
  content: [
    "/admin/blog",
    "/admin/testimonials",
    "/admin/gallery",
    "/admin/pricing",
    "/admin/resources",
    "/admin/certificates",
  ],
  settings: ["/admin/profile"],
};

const TEACHER_GROUPS: Record<string, readonly string[]> = {
  teaching: [
    "/teacher/schedule/today",
    "/teacher/schedule/routine",
    "/teacher/class-logs",
    "/teacher/classes",
    "/teacher/attendance",
    "/teacher/homework",
    "/teacher/progress",
    "/teacher/weekly-report",
  ],
  students: ["/teacher/students", "/teacher/student-requests"],
  account: [
    "/teacher/earnings",
    "/teacher/availability",
    "/teacher/notifications",
    "/teacher/profile",
  ],
};

const STUDENT_GROUPS: Record<string, readonly string[]> = {
  learning: [
    "/student/classes",
    "/student/homework",
    "/student/attendance",
    "/student/progress",
    "/student/summary",
  ],
  account: ["/student/payments", "/student/notifications", "/student/profile"],
};

const SECTION_LABELS: Record<string, string> = {
  management: "Management",
  communication: "Communication",
  content: "Content",
  settings: "Settings",
  teaching: "Teaching",
  students: "Students",
  learning: "Learning",
  account: "Account",
};

function groupsForRole(role: Role): Record<string, readonly string[]> | null {
  switch (role) {
    case "admin":
    case "super_admin":
      return ADMIN_GROUPS;
    case "teacher":
      return TEACHER_GROUPS;
    case "student":
      return STUDENT_GROUPS;
    default:
      return null;
  }
}

/** Split flat nav (from AppLayout) into mockup-style sections; keeps all items, data order within groups. */
export function groupPortalNavItems(
  navItems: IPortalNavItem[],
  role: Role
): IPortalNavSection[] {
  const byPath = new Map(navItems.map((item) => [item.path, item]));
  const dashboard = navItems.find(
    (item) =>
      item.path === `/${role}` ||
      item.path === "/admin" ||
      item.label === "Dashboard"
  );

  const groups = groupsForRole(role);
  if (!groups) {
    return [{ id: "main", label: null, items: navItems }];
  }

  const used = new Set<string>();
  const sections: IPortalNavSection[] = [];

  if (dashboard) {
    sections.push({ id: "dashboard", label: null, items: [dashboard] });
    used.add(dashboard.path);
  }

  for (const [id, paths] of Object.entries(groups)) {
    const items = paths
      .map((path) => byPath.get(path))
      .filter((item): item is IPortalNavItem => Boolean(item));
    items.forEach((item) => used.add(item.path));
    if (items.length > 0) {
      sections.push({
        id,
        label: SECTION_LABELS[id] ?? id,
        items,
      });
    }
  }

  const leftovers = navItems.filter((item) => !used.has(item.path));
  if (leftovers.length > 0) {
    sections.push({
      id: "more",
      label: "More",
      items: leftovers,
    });
  }

  return sections;
}
