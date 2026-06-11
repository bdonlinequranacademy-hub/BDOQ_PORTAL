import type { AdminClass, PopulatedUserRef } from "@/types/models";

export function classTitle(cls: { title?: string; name?: string }) {
  return cls.title ?? cls.name ?? "Untitled class";
}

export function teacherName(
  teacher: PopulatedUserRef | string | undefined
): string {
  if (!teacher) return "—";
  if (typeof teacher === "string") return "Teacher";
  return teacher.name;
}

export function studentList(
  students: PopulatedUserRef[] | string[] | undefined
): PopulatedUserRef[] {
  if (!students?.length) return [];
  if (typeof students[0] === "string") return [];
  return students as PopulatedUserRef[];
}

export function studentCount(cls: AdminClass) {
  const list = studentList(cls.students);
  return list.length;
}
