import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { studentApi } from "@/lib/api/studentApi";
import { teacherApi } from "@/lib/api/teacherApi";
import { adminApi } from "@/lib/api/adminApi";
import { adminKeys } from "@/features/admin/hooks/useAdmin";
import { isStaffAdmin } from "@/lib/assignableRoles";

function adminPendingCount(
  pending?: {
    newTrials?: number;
    newContacts?: number;
    newStudentAdmissions?: number;
    newTeacherApplications?: number;
    pendingClassLogs?: number;
    pendingPayments?: number;
    pendingStudentRequests?: number;
  }
) {
  if (!pending) return 0;
  return (
    (pending.newTrials ?? 0) +
    (pending.newContacts ?? 0) +
    (pending.newStudentAdmissions ?? 0) +
    (pending.newTeacherApplications ?? 0) +
    (pending.pendingClassLogs ?? 0) +
    (pending.pendingPayments ?? 0) +
    (pending.pendingStudentRequests ?? 0)
  );
}

export function useUnreadNotificationCount() {
  const role = useAuthStore((s) => s.user?.role);

  const studentQuery = useQuery({
    queryKey: ["notifications", "unread", "student"],
    queryFn: async () => {
      const res = await studentApi.getNotifications();
      return (res.data ?? []).filter((n) => !n.isRead).length;
    },
    enabled: role === "student",
    staleTime: 30_000,
  });

  const teacherQuery = useQuery({
    queryKey: ["notifications", "unread", "teacher"],
    queryFn: async () => {
      const res = await teacherApi.getNotifications();
      return (res.data ?? []).filter((n) => !n.isRead).length;
    },
    enabled: role === "teacher",
    staleTime: 30_000,
  });

  const adminQuery = useQuery({
    queryKey: adminKeys.stats,
    queryFn: adminApi.getStats,
    select: (r) => adminPendingCount(r.data?.pendingActions),
    enabled: Boolean(role && isStaffAdmin(role)),
    staleTime: 120_000,
  });

  const count =
    role === "student"
      ? (studentQuery.data ?? 0)
      : role === "teacher"
        ? (teacherQuery.data ?? 0)
        : role && isStaffAdmin(role)
          ? (adminQuery.data ?? 0)
          : 0;

  const isLoading =
    role === "student"
      ? studentQuery.isLoading
      : role === "teacher"
        ? teacherQuery.isLoading
        : role && isStaffAdmin(role)
          ? adminQuery.isLoading
          : false;

  return {
    count,
    hasNotifications: Boolean(
      role && (role === "student" || role === "teacher" || isStaffAdmin(role))
    ),
    isLoading,
  };
}
