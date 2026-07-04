import type { Role } from "@/types/models";

export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";

/** User-facing auth error copy (URL ?error= keys from backend OAuth redirects). */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth:
    "Google sign-in could not be completed. Please try again, or sign in with the email and password your academy gave you.",
  oauth_disabled:
    "Google sign-in is not available right now. Please use your email and password instead.",
  deactivated:
    "This account has been deactivated. Contact BDOQ Academy support at contact@bdonlinequranacademy.com.",
};

export function authErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return AUTH_ERROR_MESSAGES[code] ?? "Sign-in failed. Please check your details and try again.";
}

export function roleDashboardLabel(role: Role): string {
  switch (role) {
    case "teacher":
      return "Teacher dashboard";
    case "admin":
    case "super_admin":
      return "Admin dashboard";
    case "student":
    case "parent":
    default:
      return "Student dashboard";
  }
}

export function welcomeBackMessage(name: string, role: Role): string {
  const first = name.split(" ")[0] || name;
  return `Welcome back, ${first}! Opening your ${roleDashboardLabel(role)}…`;
}

export function googleSignInSuccessMessage(name: string, role: Role): string {
  const first = name.split(" ")[0] || name;
  if (role === "student" || role === "parent") {
    return `Signed in with Google. Welcome, ${first}! Your student account is ready.`;
  }
  return `Signed in with Google. Welcome back, ${first}! Opening your ${roleDashboardLabel(role)}…`;
}

export function registerSuccessMessage(name: string, requiresVerification: boolean): string {
  const first = name.split(" ")[0] || name;
  if (requiresVerification) {
    return `Almost done, ${first}! We sent a verification link to your email — open it to activate your student account.`;
  }
  return `Welcome, ${first}! Your student account is ready. You can now view classes and homework.`;
}

export function registerInstantWelcome(name: string): string {
  const first = name.split(" ")[0] || name;
  return `Welcome, ${first}! Your BDOQ Academy student account has been created successfully.`;
}

export const STAFF_ACCOUNT_NOTICE =
  "Teacher and admin accounts are created by your academy administrator. If you are staff, use the email and password BDOQ sent you — do not use Create account.";
