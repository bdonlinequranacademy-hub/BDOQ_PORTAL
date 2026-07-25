import type { Role } from "@/types/models";
import { isStaffAdmin } from "@/lib/assignableRoles";

export function homePathForRole(role: Role): string {
  switch (role) {
    case "student":
      return "/student";
    case "teacher":
      return "/teacher";
    case "admin":
    case "super_admin":
      return "/admin";
    default:
      return "/login";
  }
}

export function matchesAdminRoute(role: Role): boolean {
  return isStaffAdmin(role);
}
