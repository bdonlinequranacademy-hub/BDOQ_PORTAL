import type { AuthUser, Role } from "@/types/models";

/** Roles admins can assign. Parent is deprecated — student covers guardians & learners. */
export const ASSIGNABLE_ROLES: Role[] = ["student", "teacher", "admin", "super_admin"];

export const STAFF_ADMIN_ASSIGNABLE_ROLES: Role[] = ["student", "teacher"];

export const SUPER_ADMIN_ASSIGNABLE_ROLES: Role[] = ["student", "teacher", "admin"];

export function isStaffAdmin(role: Role): boolean {
  return role === "admin" || role === "super_admin";
}

export function isSuperAdmin(role: Role): boolean {
  return role === "super_admin";
}

export function isElevatedAccount(role: Role): boolean {
  return role === "admin" || role === "super_admin";
}

export function assignableRolesFor(actorRole: Role): Role[] {
  return isSuperAdmin(actorRole)
    ? SUPER_ADMIN_ASSIGNABLE_ROLES
    : STAFF_ADMIN_ASSIGNABLE_ROLES;
}

export function canManageUserAccount(actorRole: Role, targetRole: Role): boolean {
  if (isSuperAdmin(actorRole)) {
    return targetRole !== "super_admin";
  }
  return !isElevatedAccount(targetRole);
}

export function displayRole(role: Role | "parent" | string): Role {
  if (role === "parent") return "student";
  return role as Role;
}

export function normalizeAuthUser(user: AuthUser): AuthUser {
  if ((user.role as string) === "parent") {
    return { ...user, role: "student" };
  }
  return user;
}

export function roleLabel(role: Role | "parent" | string): string {
  if (role === "super_admin") return "Super Admin";
  return displayRole(role);
}
