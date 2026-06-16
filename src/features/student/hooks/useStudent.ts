import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/lib/api/studentApi";
import { useUiStore } from "@/stores/uiStore";
import { getAiErrorMessage } from "@/lib/utils/aiErrorMessage";

export const studentKeys = {
  classes: ["student", "classes"] as const,
  class: (id: string) => ["student", "class", id] as const,
  homework: ["student", "homework"] as const,
  attendance: ["student", "attendance"] as const,
  progress: ["student", "progress"] as const,
  curriculumPlan: ["student", "curriculumPlan"] as const,
  notifications: ["student", "notifications"] as const,
  todaySchedule: ["student", "schedule", "today"] as const,
  monthlyProgress: (month?: string) => ["student", "monthlyProgress", month] as const,
  profile: ["student", "profile"] as const,
  paymentStatus: ["student", "payments", "status"] as const,
  payments: ["student", "payments"] as const,
};

export function useStudentClasses() {
  return useQuery({
    queryKey: studentKeys.classes,
    queryFn: studentApi.getClasses,
    select: (r) => r.data ?? [],
  });
}

export function useStudentClass(id: string) {
  return useQuery({
    queryKey: studentKeys.class(id),
    queryFn: () => studentApi.getClass(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useStudentHomework() {
  return useQuery({
    queryKey: studentKeys.homework,
    queryFn: studentApi.getHomework,
    select: (r) => r.data ?? [],
  });
}

export function useStudentAttendance() {
  return useQuery({
    queryKey: studentKeys.attendance,
    queryFn: studentApi.getAttendance,
    select: (r) => r.data,
  });
}

export function useStudentProgress() {
  return useQuery({
    queryKey: studentKeys.progress,
    queryFn: studentApi.getProgress,
    select: (r) => r.data ?? [],
  });
}

export function useStudentCurriculumPlan() {
  return useQuery({
    queryKey: studentKeys.curriculumPlan,
    queryFn: studentApi.getCurriculumPlan,
    select: (r) => r.data ?? [],
  });
}

export function useStudentNotifications() {
  return useQuery({
    queryKey: studentKeys.notifications,
    queryFn: studentApi.getNotifications,
    select: (r) => r.data ?? [],
  });
}

export function useStudentTodaySchedule() {
  return useQuery({
    queryKey: studentKeys.todaySchedule,
    queryFn: studentApi.getTodaySchedule,
    select: (r) => r.data,
  });
}

export function useStudentMonthlyProgress(month?: string) {
  return useQuery({
    queryKey: studentKeys.monthlyProgress(month),
    queryFn: () => studentApi.getMonthlyProgress(month),
    select: (r) => r.data ?? [],
  });
}

export function useSubmitHomework(homeworkId: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (content: string) => studentApi.submitHomework(homeworkId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.homework });
      addToast("success", "Homework submitted");
    },
    onError: () => addToast("error", "Failed to submit homework"),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentApi.markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.notifications });
      qc.invalidateQueries({ queryKey: ["notifications", "unread", "student"] });
    },
  });
}

export function useGenerateStudyPlan() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: studentApi.generateStudyPlan,
    onError: (error) =>
      addToast("error", getAiErrorMessage(error, "Failed to generate study plan")),
  });
}

export function useGenerateWeeklySummary() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: studentApi.getWeeklyReport,
    onError: () => addToast("error", "Failed to build weekly report"),
  });
}

export function useStudentProfile() {
  return useQuery({
    queryKey: studentKeys.profile,
    queryFn: studentApi.getProfile,
    select: (r) => r.data,
  });
}

export function useUpdateStudentProfile() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: studentApi.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.profile });
      addToast("success", "Profile updated");
    },
    onError: () => addToast("error", "Failed to update profile"),
  });
}

export function useChangeStudentPassword() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: studentApi.changePassword,
    onSuccess: () => addToast("success", "Password changed"),
    onError: () => addToast("error", "Failed to change password"),
  });
}

export function useSubmitConcernReport() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: studentApi.submitConcernReport,
    onSuccess: () => addToast("success", "Concern report submitted"),
    onError: () => addToast("error", "Failed to submit report"),
  });
}

export function useStudentPaymentStatus() {
  return useQuery({
    queryKey: studentKeys.paymentStatus,
    queryFn: studentApi.getPaymentStatus,
    select: (r) => r.data,
  });
}

export function useStudentPayments() {
  return useQuery({
    queryKey: studentKeys.payments,
    queryFn: studentApi.getPayments,
    select: (r) => r.data ?? [],
  });
}

export function useSubmitStudentPayment() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: studentApi.submitPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.paymentStatus });
      qc.invalidateQueries({ queryKey: studentKeys.payments });
      addToast("success", "Payment submitted for review");
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
          : "Failed to submit payment";
      addToast("error", message);
    },
  });
}
