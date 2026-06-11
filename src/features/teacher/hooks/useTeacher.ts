import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/lib/api/teacherApi";
import { useUiStore } from "@/stores/uiStore";
import { getAiErrorMessage } from "@/lib/utils/aiErrorMessage";
import type { AttendanceStatus, Grade, ClassLogStatus, Homework, HomeworkSubmission } from "@/types/models";

export const teacherKeys = {
  classes: ["teacher", "classes"] as const,
  class: (id: string) => ["teacher", "class", id] as const,
  students: ["teacher", "students"] as const,
  studentProgress: (id: string) => ["teacher", "studentProgress", id] as const,
  homework: ["teacher", "homework"] as const,
  homeworkDetail: (id: string) => ["teacher", "homework", id] as const,
  attendanceReport: (classId?: string, date?: string) =>
    ["teacher", "attendanceReport", classId, date] as const,
  atRisk: ["ai", "atRisk"] as const,
  notifications: ["teacher", "notifications"] as const,
  todaySchedule: ["teacher", "schedule", "today"] as const,
  weeklyRoutine: ["teacher", "schedule", "routine"] as const,
  classLogs: (status?: string) => ["teacher", "classLogs", status] as const,
  classLogStats: ["teacher", "classLogStats"] as const,
  earnings: (month?: string) => ["teacher", "earnings", month] as const,
  monthlyProgress: (month?: string) => ["teacher", "monthlyProgress", month] as const,
  monthlyQuestions: ["teacher", "monthlyQuestions"] as const,
  profile: ["teacher", "profile"] as const,
  studentRequests: ["teacher", "studentRequests"] as const,
  classAttendance: (classId?: string, date?: string) =>
    ["teacher", "classAttendance", classId, date] as const,
};

export function useTeacherClasses() {
  return useQuery({
    queryKey: teacherKeys.classes,
    queryFn: teacherApi.getClasses,
    select: (r) => r.data ?? [],
  });
}

export function useTeacherClass(id: string) {
  return useQuery({
    queryKey: teacherKeys.class(id),
    queryFn: () => teacherApi.getClass(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useTeacherStudents() {
  return useQuery({
    queryKey: teacherKeys.students,
    queryFn: teacherApi.getStudents,
    select: (r) => r.data ?? [],
  });
}

export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: teacherKeys.studentProgress(studentId),
    queryFn: () => teacherApi.getStudentProgress(studentId),
    select: (r) => r.data ?? [],
    enabled: Boolean(studentId),
  });
}

export function useTeacherHomework() {
  return useQuery({
    queryKey: teacherKeys.homework,
    queryFn: teacherApi.getHomework,
    select: (r) => r.data ?? [],
  });
}

export function useHomeworkDetail(id: string) {
  return useQuery({
    queryKey: teacherKeys.homeworkDetail(id),
    queryFn: () => teacherApi.getHomeworkDetail(id),
    select: (r) => {
      const raw = r.data as Record<string, unknown> | null;
      if (!raw) return null;
      const subs = (raw.submissions as Record<string, unknown>[] | undefined) ?? [];
      return {
        ...raw,
        className:
          typeof raw.class === "object" && raw.class && "title" in (raw.class as object)
            ? (raw.class as { title: string }).title
            : undefined,
        submissions: subs.map((s) => {
          const student = s.student as { _id?: string; name?: string } | string | undefined;
          const studentId =
            typeof student === "object" && student?._id
              ? String(student._id)
              : String(student ?? "");
          return {
            _id: String(s._id),
            studentId,
            studentName:
              typeof student === "object" && student?.name ? student.name : undefined,
            content: String(s.content ?? ""),
            submittedAt: String(s.submittedAt ?? ""),
            status: s.status as HomeworkSubmission["status"],
            reviewFeedback: s.reviewFeedback as string | undefined,
            grade: s.grade as Grade | undefined,
            feedback: s.feedback as string | undefined,
          };
        }),
      } as Homework;
    },
    enabled: Boolean(id),
  });
}

export function useAttendanceReport(classId?: string, date?: string) {
  return useQuery({
    queryKey: teacherKeys.attendanceReport(classId, date),
    queryFn: () => teacherApi.getAttendanceReport(classId, date),
    select: (r) => r.data ?? [],
    enabled: Boolean(classId),
  });
}

export function useClassAttendance(classId: string, date: string) {
  return useQuery({
    queryKey: teacherKeys.classAttendance(classId, date),
    queryFn: () => teacherApi.getClassAttendance(classId, date),
    select: (r) => r.data ?? [],
    enabled: Boolean(classId && date),
  });
}

export function useTeacherWeeklyReport() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.getWeeklyReport,
    onError: () => addToast("error", "Failed to build weekly report"),
  });
}

export function useComplianceScan() {
  return useMutation({
    mutationFn: ({
      text,
      context,
    }: {
      text: string;
      context?: "class_log" | "homework_feedback" | "homework_submission";
    }) => teacherApi.scanCompliance(text, context),
  });
}

export function useSubmitConcernReport() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.submitConcernReport,
    onSuccess: () => addToast("success", "Concern report submitted"),
    onError: () => addToast("error", "Failed to submit report"),
  });
}

export function useAtRiskStudents() {
  const locale = useUiStore((s) => s.aiLocale);
  return useQuery({
    queryKey: [...teacherKeys.atRisk, locale],
    queryFn: teacherApi.getAtRisk,
    select: (r) => r.data ?? [],
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeacherNotifications() {
  return useQuery({
    queryKey: teacherKeys.notifications,
    queryFn: teacherApi.getNotifications,
    select: (r) => r.data ?? [],
  });
}

export function useMarkTeacherNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.notifications });
      qc.invalidateQueries({ queryKey: ["notifications", "unread", "teacher"] });
    },
  });
}

export function useTeacherTodaySchedule() {
  return useQuery({
    queryKey: teacherKeys.todaySchedule,
    queryFn: teacherApi.getTodaySchedule,
    select: (r) => r.data,
  });
}

export function useTeacherWeeklyRoutine() {
  return useQuery({
    queryKey: teacherKeys.weeklyRoutine,
    queryFn: teacherApi.getWeeklyRoutine,
    select: (r) => r.data ?? [],
  });
}

export function useTeacherClassLogs(status?: ClassLogStatus) {
  return useQuery({
    queryKey: teacherKeys.classLogs(status),
    queryFn: () => teacherApi.getClassLogs(status),
    select: (r) => r.data ?? [],
  });
}

export function useTeacherClassLogStats() {
  return useQuery({
    queryKey: teacherKeys.classLogStats,
    queryFn: teacherApi.getClassLogStats,
    select: (r) => r.data,
  });
}

export function useCreateClassLog() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.createClassLog,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["teacher", "classLogs"] });
      qc.invalidateQueries({ queryKey: teacherKeys.classLogStats });
      qc.invalidateQueries({ queryKey: ["teacher", "earnings"] });
      addToast("success", "Class log submitted for approval");
      const warnings = (res as { warnings?: string[] }).warnings;
      if (warnings?.length) {
        addToast("info", warnings[0]);
      }
    },
    onError: (error: unknown) => {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to submit class log";
      addToast("error", message);
    },
  });
}

export function useTeacherEarnings(month?: string) {
  return useQuery({
    queryKey: teacherKeys.earnings(month),
    queryFn: () => teacherApi.getEarnings(month),
    select: (r) => r.data,
  });
}

export function useTeacherMonthlyProgress(month?: string) {
  return useQuery({
    queryKey: teacherKeys.monthlyProgress(month),
    queryFn: () => teacherApi.getMonthlyProgress(month),
    select: (r) => r.data ?? [],
  });
}

export function useMonthlyProgressQuestions() {
  return useQuery({
    queryKey: teacherKeys.monthlyQuestions,
    queryFn: teacherApi.getMonthlyProgressQuestions,
    select: (r) => r.data ?? [],
  });
}

export function useSaveMonthlyProgress() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.saveMonthlyProgress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teacher", "monthlyProgress"] });
      addToast("success", "Monthly progress saved");
    },
    onError: () => addToast("error", "Failed to save monthly progress"),
  });
}

export function useTeacherProfile() {
  return useQuery({
    queryKey: teacherKeys.profile,
    queryFn: teacherApi.getProfile,
    select: (r) => r.data,
  });
}

export function useUpdateTeacherProfile() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.profile });
      addToast("success", "Profile updated");
    },
    onError: () => addToast("error", "Failed to update profile"),
  });
}

export function useChangeTeacherPassword() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.changePassword,
    onSuccess: () => addToast("success", "Password changed"),
    onError: () => addToast("error", "Failed to change password"),
  });
}

export function useCheckAvailability() {
  return useMutation({
    mutationFn: teacherApi.checkAvailability,
  });
}

export function useTeacherStudentRequests() {
  return useQuery({
    queryKey: teacherKeys.studentRequests,
    queryFn: teacherApi.getStudentRequests,
    select: (r) => r.data ?? [],
  });
}

export function useCreateStudentRequest() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.createStudentRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.studentRequests });
      addToast("success", "Request sent to admin");
    },
    onError: () => addToast("error", "Failed to submit request"),
  });
}

export function useCreateHomework() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.createHomework,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.homework });
      addToast("success", "Homework created");
    },
    onError: () => addToast("error", "Failed to create homework"),
  });
}

export function useReviewHomeworkSubmission(homeworkId: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: { studentId: string; action: "approve" | "return"; feedback?: string }) =>
      teacherApi.reviewHomeworkSubmission(homeworkId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: teacherKeys.homeworkDetail(homeworkId) });
      qc.invalidateQueries({ queryKey: teacherKeys.homework });
      addToast(
        "success",
        vars.action === "approve" ? "Submission approved" : "Returned to student"
      );
    },
    onError: () => addToast("error", "Failed to review submission"),
  });
}

export function useGradeSubmission(homeworkId: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: { studentId: string; grade: Grade; feedback?: string }) =>
      teacherApi.gradeSubmission(homeworkId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.homeworkDetail(homeworkId) });
      qc.invalidateQueries({ queryKey: teacherKeys.homework });
      addToast("success", "Grade submitted");
    },
    onError: () => addToast("error", "Failed to submit grade"),
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({
      classId,
      date,
      attendances,
    }: {
      classId: string;
      date: string;
      attendances: { studentId: string; status: AttendanceStatus }[];
    }) => teacherApi.markAttendance(classId, date, attendances),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["teacher", "attendanceReport"] });
      qc.invalidateQueries({
        queryKey: teacherKeys.classAttendance(variables.classId, variables.date),
      });
      addToast("success", "Attendance saved");
    },
    onError: () => addToast("error", "Failed to save attendance"),
  });
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.updateProgress,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: teacherKeys.studentProgress(vars.studentId),
      });
      addToast("success", "Progress updated");
    },
    onError: () => addToast("error", "Failed to update progress"),
  });
}

export function useToggleCurriculumComplete() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({
      studentId,
      ...payload
    }: {
      studentId: string;
      programId: string;
      unitId?: string;
      topicId?: string;
      completed: boolean;
    }) => teacherApi.toggleCurriculumComplete(studentId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: teacherKeys.students });
      qc.invalidateQueries({
        queryKey: teacherKeys.studentProgress(vars.studentId),
      });
      addToast(
        "success",
        vars.completed ? "Marked as completed" : "Marked as in progress"
      );
    },
    onError: () => addToast("error", "Failed to update curriculum"),
  });
}

export function useGenerateProgressReport() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (studentId: string) => teacherApi.generateProgressReport(studentId),
    onError: (error) =>
      addToast("error", getAiErrorMessage(error, "Failed to generate report")),
  });
}

export function useGenerateParentSummary() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (studentId: string) => teacherApi.generateParentSummary(studentId),
    onError: (error) =>
      addToast("error", getAiErrorMessage(error, "Failed to generate summary")),
  });
}

export function useGenerateEarlyWarning() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (studentId: string) => teacherApi.generateEarlyWarning(studentId),
    onError: (error) =>
      addToast("error", getAiErrorMessage(error, "Failed to generate AI guidance")),
  });
}

export function useGenerateClassLogDraft() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: teacherApi.generateClassLogDraft,
    onError: (error) =>
      addToast("error", getAiErrorMessage(error, "Failed to generate draft")),
  });
}
