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
    badgeClass:
      "bg-[#7C6BC4] text-white border-[#6B5BB3] dark:bg-[#8B7BD4] dark:text-white dark:border-[#A99BE8]/50",
  },
  admin: {
    roleLabel: "Admin",
    subtitle: "Manage your academy and students activities",
    badgeClass:
      "bg-amber-600 text-white border-amber-500/80 dark:bg-amber-500/25 dark:text-amber-100 dark:border-amber-400/35",
  },
  teacher: {
    roleLabel: "Teacher",
    subtitle: "Manage your classes, students, and teaching schedule",
    badgeClass:
      "bg-teal text-white border-teal/40 dark:bg-teal/25 dark:text-[#CCFBF1] dark:border-teal/40",
  },
  student: {
    roleLabel: "Student",
    subtitle: "Track your classes, progress, and learning journey",
    badgeClass:
      "bg-primary text-white border-primary/40 dark:bg-primary/25 dark:text-emerald-100 dark:border-primary/40",
  },
  parent: {
    roleLabel: "Parent",
    subtitle: "Follow your child's classes, homework, and progress",
    badgeClass:
      "bg-sky-600 text-white border-sky-500/80 dark:bg-sky-500/25 dark:text-sky-100 dark:border-sky-400/35",
  },
};

export function getPortalBrandingMeta(role: Role): IPortalBrandingMeta {
  return BRANDING_BY_ROLE[role] ?? BRANDING_BY_ROLE.student;
}

/** Prefer HD generated Quran panel; falls back to existing asset path used historically */
export const PORTAL_HEADER_QURAN_SRC = "/brand/portal-header-quran-hd.png";
export const PORTAL_HEADER_LANTERN_SRC = "/brand/portal-header-lantern.png";
export const PORTAL_HEADER_MOSQUE_SRC = "/brand/portal-mosque-elegance.svg";
export const PORTAL_HEADER_MOSQUE_HD_SRC = "/brand/portal-mosque-elegance.png";
export const PORTAL_HEADER_ATMOSPHERE_SRC = "/brand/portal-wing-atmosphere.png";
export const PORTAL_HEADER_PATTERN_SRC = "/brand/islamic-geo-pattern.svg";
export const PORTAL_HEADER_RIGHT_SCENE_SRC = "/brand/portal-header-right-scene.png";
export const PORTAL_HEADER_SCALLOP_FRAME_SRC = "/brand/portal-header-scallop-frame.png";

/** Islamic shape illustration — same asset as public-site IslamicShapeBackdrop */
export const PORTAL_ISLAMIC_SHAPE_BG = "/brand/islamic-shape-bg.png";
