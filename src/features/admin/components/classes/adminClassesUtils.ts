import type { AdminClass, PopulatedUserRef } from "@/types/models";
import {
  classTitle,
  classesScheduledToday,
  formatScheduleLine,
  primaryScheduleEntry,
  studentCount,
  teacherName,
} from "@/lib/utils/class";

export type AdminClassesTab = "all" | "active" | "inactive" | "today";
export type AdminClassesSort = "newest" | "oldest" | "name" | "students";

export interface IAdminClassesStats {
  total: number;
  enrolled: number;
  scheduled: number;
  active: number;
  today: number;
}

export interface ITeacherFilterOption {
  id: string;
  name: string;
}

export function computeAdminClassesStats(classes: AdminClass[]): IAdminClassesStats {
  const active = classes.filter((cls) => cls.isActive !== false).length;
  const enrolled = classes.reduce((sum, cls) => sum + studentCount(cls), 0);
  const scheduled = classes.filter((cls) => primaryScheduleEntry(cls.schedule)?.day).length;
  const today = classesScheduledToday(classes).length;

  return {
    total: classes.length,
    enrolled,
    scheduled,
    active,
    today,
  };
}

export function extractTeacherOptions(classes: AdminClass[]): ITeacherFilterOption[] {
  const map = new Map<string, string>();

  for (const cls of classes) {
    const teacher = cls.teacher;
    if (typeof teacher === "object" && teacher?._id) {
      map.set(teacher._id, teacher.name);
    }
  }

  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function teacherHandle(teacher: PopulatedUserRef | string | undefined): string {
  if (!teacher || typeof teacher === "string") return "";
  if (!teacher.email) return "";
  return `@${teacher.email.split("@")[0] ?? ""}`;
}

export function classStatusLabel(cls: AdminClass): string {
  return cls.isActive === false ? "Inactive" : "Active";
}

export function classStatusStyles(cls: AdminClass): string {
  return cls.isActive === false
    ? "bg-amber-100 text-amber-800"
    : "bg-emerald-100 text-emerald-800";
}

export function studentCapacityPercent(count: number, max = 20): number {
  return Math.min(100, Math.round((count / max) * 100));
}

export function filterAdminClasses(
  classes: AdminClass[],
  options: {
    search: string;
    tab: AdminClassesTab;
    teacherFilter: string;
    sortBy: AdminClassesSort;
  }
): AdminClass[] {
  const query = options.search.trim().toLowerCase();

  const filtered = classes.filter((cls) => {
    const title = classTitle(cls).toLowerCase();
    const teacher = teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined).toLowerCase();
    const description = cls.description?.toLowerCase() ?? "";

    const matchesSearch =
      !query || title.includes(query) || teacher.includes(query) || description.includes(query);

    const matchesTeacher =
      options.teacherFilter === "all" ||
      (typeof cls.teacher === "object" && cls.teacher?._id === options.teacherFilter);

    const matchesTab =
      options.tab === "all" ||
      (options.tab === "active" && cls.isActive !== false) ||
      (options.tab === "inactive" && cls.isActive === false) ||
      (options.tab === "today" && classesScheduledToday([cls]).length > 0);

    return matchesSearch && matchesTeacher && matchesTab;
  });

  return filtered.sort((a, b) => {
    if (options.sortBy === "name") {
      return classTitle(a).localeCompare(classTitle(b));
    }
    if (options.sortBy === "students") {
      return studentCount(b) - studentCount(a);
    }

    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return options.sortBy === "newest" ? bTime - aTime : aTime - bTime;
  });
}

export function exportClassesFile(classes: AdminClass[], format: "csv" | "excel"): void {
  const filename = `classes-${new Date().toISOString().slice(0, 10)}`;
  const header = ["Class", "Teacher", "Students", "Schedule", "Status"];
  const lines = [
    header.join(","),
    ...classes.map((cls) =>
      [
        csvEscape(classTitle(cls)),
        csvEscape(teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)),
        String(studentCount(cls)),
        csvEscape(formatScheduleLine(cls.schedule) ?? ""),
        csvEscape(classStatusLabel(cls)),
      ].join(",")
    ),
  ];

  const mime =
    format === "excel"
      ? "application/vnd.ms-excel;charset=utf-8"
      : "text/csv;charset=utf-8";
  const extension = format === "excel" ? "xls" : "csv";
  const blob = new Blob([lines.join("\n")], { type: mime });
  downloadBlob(blob, `${filename}.${extension}`);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function scheduledWeekDays(classes: AdminClass[]): Set<number> {
  const days = new Set<number>();
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  for (const cls of classes) {
    const day = primaryScheduleEntry(cls.schedule)?.day?.toLowerCase();
    if (day && day in dayMap) {
      days.add(dayMap[day]!);
    }
  }

  return days;
}
