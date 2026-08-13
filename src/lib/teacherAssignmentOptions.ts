import type { AdminTeacherProfile, AdminUser } from "@/types/models";

export interface ITeacherAssignmentOption {
  slug: string;
  name: string;
  gender?: "male" | "female";
}

export function buildTeacherAssignmentOptions(
  profiles: AdminTeacherProfile[],
  portalTeachers: AdminUser[]
): ITeacherAssignmentOption[] {
  const options: ITeacherAssignmentOption[] = [];
  const seen = new Set<string>();

  for (const profile of profiles) {
    const slug = profile.slug?.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (profile.linkedUserId) seen.add(profile.linkedUserId);
    options.push({
      slug,
      name: profile.name,
      gender: profile.gender,
    });
  }

  for (const teacher of portalTeachers) {
    if (teacher.role !== "teacher" || teacher.isActive === false) continue;
    if (seen.has(teacher.id)) continue;
    seen.add(teacher.id);
    options.push({
      slug: teacher.id,
      name: teacher.name,
      gender: teacher.gender,
    });
  }

  return options.sort((a, b) => a.name.localeCompare(b.name));
}
