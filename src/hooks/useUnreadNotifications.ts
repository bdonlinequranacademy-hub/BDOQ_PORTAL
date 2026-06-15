import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { studentApi } from "@/lib/api/studentApi";
import { teacherApi } from "@/lib/api/teacherApi";
import { adminApi } from "@/lib/api/adminApi";
import { isStaffAdmin } from "@/lib/assignableRoles";

export function useUnreadNotificationCount() {
  const role = useAuthStore((s) => s.user?.role);

  const { data: count = 0, isLoading } = useQuery({
    queryKey: ["notifications", "unread", role],
    queryFn: async () => {
      if (role === "student") {
        const res = await studentApi.getNotifications();
        return (res.data ?? []).filter((n) => !n.isRead).length;
      }
      if (role === "teacher") {
        const res = await teacherApi.getNotifications();
        return (res.data ?? []).filter((n) => !n.isRead).length;
      }
      if (role && isStaffAdmin(role)) {
        const res = await adminApi.getStats();
        const pending = res.data?.pendingActions;
        return (
          (pending?.newTrials ?? 0) +
          (pending?.newContacts ?? 0) +
          (pending?.pendingClassLogs ?? 0) +
          (pending?.newConcernReports ?? 0)
        );
      }
      return 0;
    },
    enabled: Boolean(
      role && (role === "student" || role === "teacher" || isStaffAdmin(role))
    ),
    staleTime: 30_000,
  });

  return {
    count,
    hasNotifications: Boolean(
      role && (role === "student" || role === "teacher" || isStaffAdmin(role))
    ),
    isLoading,
  };
}
