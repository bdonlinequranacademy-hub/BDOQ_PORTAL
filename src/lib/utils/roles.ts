import type { Role } from "@/types/models";

export function homePathForRole(role: Role): string {
  switch (role) {
    case "student":
      return "/student";
    case "teacher":
      return "/teacher";
    case "admin":
      return "/admin";
    case "parent":
      return "/student";
    default:
      return "/login";
  }
}
