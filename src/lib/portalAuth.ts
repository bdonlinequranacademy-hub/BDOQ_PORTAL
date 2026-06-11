import type { Role } from "@/types/models";

export type PortalIntent = "student" | "teacher" | "admin";

const PORTAL_INTENTS: PortalIntent[] = ["student", "teacher", "admin"];

export function parsePortalIntent(value: string | null): PortalIntent {
  if (value && PORTAL_INTENTS.includes(value as PortalIntent)) {
    return value as PortalIntent;
  }
  return "student";
}

export function loginPathForPortal(portal: PortalIntent): string {
  return `/login?portal=${portal}`;
}

export function registerPathForPortal(portal: PortalIntent = "student"): string {
  return `/register?portal=${portal}`;
}

export const PORTAL_COPY: Record<
  PortalIntent,
  { signInTitle: string; signInSubtitle: string; registerNote?: string }
> = {
  student: {
    signInTitle: "Student sign in",
    signInSubtitle:
      "Learners and guardians use one student account for classes, homework, and progress.",
  },
  teacher: {
    signInTitle: "Teacher sign in",
    signInSubtitle:
      "Sign in with the email and password issued by your academy admin.",
    registerNote:
      "Teacher accounts are created by an admin — not through public registration.",
  },
  admin: {
    signInTitle: "Admin sign in",
    signInSubtitle: "Academy staff only. Use credentials provided by your organisation.",
    registerNote:
      "Admin accounts are created internally — not through public registration.",
  },
};

export function roleMatchesPortal(userRole: Role, portal: PortalIntent): boolean {
  if (portal === "student") return userRole === "student" || userRole === "parent";
  return userRole === portal;
}
