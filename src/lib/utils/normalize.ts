import type {
  AtRiskReason,
  AtRiskStudent,
  Class,
  Notification,
  Progress,
  RiskLevel,
  ScheduleEntry,
  Student,
} from "@/types/models";

type RawRecord = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  return String(value);
}

function asId(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "_id" in (value as RawRecord)) {
    return asString((value as RawRecord)._id);
  }
  return String(value);
}

export function normalizeSchedule(raw: unknown): ScheduleEntry[] {
  if (!raw) return [];
  const entries = Array.isArray(raw) ? raw : [raw];
  return entries
    .filter((entry): entry is RawRecord => Boolean(entry) && typeof entry === "object")
    .map((entry) => ({
      day: asString(entry.day),
      time: asString(entry.time),
      duration:
        typeof entry.duration === "number" && entry.duration > 0
          ? entry.duration
          : undefined,
    }));
}

export function normalizeClass(raw: RawRecord): Class {
  const studentsRaw = raw.students;
  const studentIds = Array.isArray(studentsRaw)
    ? studentsRaw.map((student) => asId(student))
    : [];

  const students = Array.isArray(studentsRaw)
    ? studentsRaw
        .filter((s): s is RawRecord => Boolean(s) && typeof s === "object")
        .map((student) => ({
          _id: asId(student),
          name: asString(student.name),
          country: student.country ? asString(student.country) : undefined,
          timezone: student.timezone ? asString(student.timezone) : undefined,
          studentId: student.studentId ? asString(student.studentId) : undefined,
        }))
    : undefined;

  const teacher = raw.teacher;

  return {
    _id: asId(raw._id),
    name: asString(raw.title ?? raw.name, "Untitled class"),
    subject: asString(raw.description ?? raw.subject),
    teacherId: asId(teacher),
    teacherName:
      teacher && typeof teacher === "object" && "name" in teacher
        ? asString((teacher as RawRecord).name)
        : undefined,
    studentIds,
    students,
    studentCount: studentIds.length,
    schedule: normalizeSchedule(raw.schedule),
    meetingLink: raw.meetingLink ? asString(raw.meetingLink) : undefined,
    description: raw.description ? asString(raw.description) : undefined,
    level: raw.level ? asString(raw.level) : undefined,
    createdAt: raw.createdAt ? asString(raw.createdAt) : undefined,
  };
}

export interface TeacherStudent extends Student {
  studentId?: string;
  country?: string;
  timezone?: string;
  classes: { _id: string; title: string }[];
  curriculumAssignments?: import("@/lib/api/curriculumApi").CurriculumAssignment[];
}

function mapCurriculumLabels(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const labels = raw as RawRecord;
  return {
    program:
      "program" in labels && labels.program
        ? asString(labels.program)
        : undefined,
    unit:
      "unit" in labels && labels.unit ? asString(labels.unit) : undefined,
    topic:
      "topic" in labels && labels.topic ? asString(labels.topic) : undefined,
  };
}

export function normalizeCurriculumAssignments(
  raw: unknown
): import("@/lib/api/curriculumApi").CurriculumAssignment[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const a = item as RawRecord;
    return {
      programId: asString(a.programId),
      unitId: a.unitId ? asString(a.unitId) : undefined,
      topicId: a.topicId ? asString(a.topicId) : undefined,
      completed: Boolean(a.completed),
      completedAt: a.completedAt ? asString(a.completedAt) : undefined,
      curriculumLabels: mapCurriculumLabels(a.curriculumLabels),
    };
  });
}

export function normalizeTeacherStudent(raw: RawRecord): TeacherStudent {
  const classes = Array.isArray(raw.classes)
    ? raw.classes.map((cls) => ({
        _id: asId(cls),
        title: asString((cls as RawRecord).title ?? (cls as RawRecord).name, "Class"),
      }))
    : [];

  const curriculumAssignments = Array.isArray(raw.curriculumAssignments)
    ? normalizeCurriculumAssignments(raw.curriculumAssignments)
    : undefined;

  return {
    _id: asId(raw._id),
    name: asString(raw.name),
    email: asString(raw.email),
    role: "student",
    studentId: raw.studentId ? asString(raw.studentId) : undefined,
    country: raw.country ? asString(raw.country) : undefined,
    timezone: raw.timezone ? asString(raw.timezone) : undefined,
    classes,
    curriculumAssignments,
  };
}

export function normalizeProgressRecord(raw: RawRecord): Progress {
  const cls = raw.class;
  return {
    _id: asId(raw._id),
    studentId: asId(raw.student),
    classId: asId(cls),
    surahsMemorized: Array.isArray(raw.surahsCompleted)
      ? (raw.surahsCompleted as string[])
      : Array.isArray(raw.surahsMemorized)
        ? (raw.surahsMemorized as string[])
        : [],
    tajweedScore: typeof raw.tajweedScore === "number" ? raw.tajweedScore : 0,
    curriculumProgram: raw.curriculumProgram ? asString(raw.curriculumProgram) : undefined,
    curriculumUnit: raw.curriculumUnit ? asString(raw.curriculumUnit) : undefined,
    curriculumTopic: raw.curriculumTopic ? asString(raw.curriculumTopic) : undefined,
    curriculumLabels:
      raw.curriculumLabels && typeof raw.curriculumLabels === "object"
        ? {
            program:
              "program" in (raw.curriculumLabels as object) &&
              (raw.curriculumLabels as { program?: unknown }).program
                ? asString((raw.curriculumLabels as { program: unknown }).program)
                : undefined,
            unit:
              "unit" in (raw.curriculumLabels as object) &&
              (raw.curriculumLabels as { unit?: unknown }).unit
                ? asString((raw.curriculumLabels as { unit: unknown }).unit)
                : undefined,
            topic:
              "topic" in (raw.curriculumLabels as object) &&
              (raw.curriculumLabels as { topic?: unknown }).topic
                ? asString((raw.curriculumLabels as { topic: unknown }).topic)
                : undefined,
          }
        : undefined,
    notes: raw.notes ? asString(raw.notes) : undefined,
    updatedAt: raw.updatedAt ? asString(raw.updatedAt) : undefined,
  };
}

export function normalizeProgressList(raw: unknown): Progress[] {
  if (!Array.isArray(raw)) {
    if (raw && typeof raw === "object") {
      return [normalizeProgressRecord(raw as RawRecord)];
    }
    return [];
  }
  return raw.map((item) => normalizeProgressRecord(item as RawRecord));
}

function inferReasonType(message: string): AtRiskReason["type"] {
  const lower = message.toLowerCase();
  if (lower.includes("homework") || lower.includes("assignment")) return "homework";
  if (
    lower.includes("attend") ||
    lower.includes("absent") ||
    lower.includes("miss") ||
    lower.includes("session log") ||
    lower.includes("verified session")
  ) {
    return "attendance";
  }
  return "progress";
}

export function normalizeAtRiskStudent(raw: RawRecord): AtRiskStudent {
  const student = (raw.student as RawRecord | undefined) ?? {};
  const reasonsRaw = Array.isArray(raw.reasons) ? raw.reasons : [];

  const reasons: AtRiskReason[] = reasonsRaw.map((reason) => {
    if (typeof reason === "string") {
      return { type: inferReasonType(reason), message: reason };
    }
    const record = reason as RawRecord;
    return {
      type: (record.type as AtRiskReason["type"]) ?? inferReasonType(asString(record.message)),
      message: asString(record.message ?? reason),
    };
  });

  return {
    studentId: asId(raw.studentId ?? student._id ?? student.id),
    studentName: asString(raw.studentName ?? student.name, "Student"),
    riskLevel: (raw.riskLevel as RiskLevel) ?? "medium",
    reasons,
    aiGuidance: asString(raw.aiGuidance ?? raw.aiWarning, "") || undefined,
    attendanceRate:
      typeof raw.attendanceRate === "number" ? raw.attendanceRate : undefined,
    homeworkCompletion:
      typeof raw.homeworkCompletion === "number" ? raw.homeworkCompletion : undefined,
  };
}

export function normalizeNotification(raw: RawRecord): Notification {
  return {
    _id: asId(raw._id),
    userId: asId(raw.user ?? raw.userId),
    title: asString(raw.title),
    message: asString(raw.message),
    isRead: Boolean(raw.isRead),
    createdAt: asString(raw.createdAt),
    type: raw.type ? asString(raw.type) : undefined,
  };
}
