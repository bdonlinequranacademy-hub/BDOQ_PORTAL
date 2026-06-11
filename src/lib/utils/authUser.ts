import type { AuthUser } from "@/types/models";

export function authUserId(user: AuthUser | null | undefined): string | undefined {
  if (!user) return undefined;
  return user._id ?? user.id;
}
