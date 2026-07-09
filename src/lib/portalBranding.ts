import type { Role } from "@/types/models";

export interface IPortalBrandingMeta {
  roleLabel: string;
  subtitle: string;
  badgeClass: string;
}

const BRANDING_BY_ROLE: Record<Role, IPortalBrandingMeta> = {
  super_admin: {
    roleLabel: "Super Admin",
    subtitle: "Manage your academy, staff, and platform-wide settings",
    badgeClass: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200/80",
  },
  admin: {
    roleLabel: "Admin",
    subtitle: "Manage your academy and students activities",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200/80",
  },
  teacher: {
    roleLabel: "Teacher",
    subtitle: "Manage your classes, students, and teaching schedule",
    badgeClass: "bg-teal/15 text-teal border-teal/25",
  },
  student: {
    roleLabel: "Student",
    subtitle: "Track your classes, progress, and learning journey",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  parent: {
    roleLabel: "Parent",
    subtitle: "Follow your child's classes, homework, and progress",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200/80",
  },
};

export function getPortalBrandingMeta(role: Role): IPortalBrandingMeta {
  return BRANDING_BY_ROLE[role] ?? BRANDING_BY_ROLE.student;
}

export const PORTAL_HEADER_QURAN_SRC = "/brand/portal-header-quran.png";

/** Islamic shape illustration — same asset as public-site IslamicShapeBackdrop */
export const PORTAL_ISLAMIC_SHAPE_BG = "/brand/islamic-shape-bg.png";
