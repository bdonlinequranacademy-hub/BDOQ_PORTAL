import type { Role } from "@/types/models";

/** Roles admins can assign. Parent is deprecated — student covers guardians & learners. */
export const ASSIGNABLE_ROLES: Role[] = ["student", "teacher", "admin"];

export function displayRole(role: Role): Role {
  return role === "parent" ? "student" : role;
}

export function roleLabel(role: Role): string {
  return displayRole(role);
}
