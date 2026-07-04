export const PORTAL_TEACHER_AVATARS = {
  male: "/images/teachers/male-teacher.png",
  female: "/images/teachers/female-teacher.png",
} as const;

export function defaultPortalAvatarUrl(gender: "male" | "female"): string {
  return PORTAL_TEACHER_AVATARS[gender];
}
