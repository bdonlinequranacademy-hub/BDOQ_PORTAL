import type { Role } from "@/types/models";
import { LOGIN_PATH, REGISTER_PATH } from "@/lib/authMessages";

/** @deprecated Portal URL roles removed — use LOGIN_PATH / REGISTER_PATH */
export type PortalIntent = "student" | "teacher" | "admin";

export const loginPathForPortal = (): string => LOGIN_PATH;

export const registerPathForPortal = (): string => REGISTER_PATH;

/** Legacy: always returns student; portal query params are ignored */
export function parsePortalIntent(_value: string | null): PortalIntent {
  return "student";
}

export function roleMatchesPortal(_userRole: Role, _portal: PortalIntent): boolean {
  return true;
}
