import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import { studentKeys } from "@/features/student/hooks/useStudent";
import { teacherKeys } from "@/features/teacher/hooks/useTeacher";
import { parentKeys } from "@/features/parent/hooks/useParent";
import { adminKeys } from "@/features/admin/hooks/useAdmin";
import {
  disconnectRealtimeSocket,
  getRealtimeSocket,
} from "@/lib/realtime/socket";
import type { Role } from "@/types/models";

type SocketPayload = {
  _id: string;
  user?: string;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  createdAt: string;
};

function invalidateForRole(qc: ReturnType<typeof useQueryClient>, role: Role) {
  qc.invalidateQueries({ queryKey: ["notifications", "unread", role] });

  if (role === "student") {
    qc.invalidateQueries({ queryKey: studentKeys.notifications });
    return;
  }
  if (role === "teacher") {
    qc.invalidateQueries({ queryKey: teacherKeys.notifications });
    return;
  }
  if (role === "parent") {
    qc.invalidateQueries({ queryKey: parentKeys.notifications });
    return;
  }
  if (role === "admin") {
    qc.invalidateQueries({ queryKey: adminKeys.stats });
    qc.invalidateQueries({ queryKey: ["admin"] });
  }
}

/** Connect Socket.IO after login — portal only (not public site). */
export function useRealtimeNotifications() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const qc = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (!token || !role) {
      disconnectRealtimeSocket();
      return;
    }

    let active = true;
    let socketInstance: Awaited<ReturnType<typeof getRealtimeSocket>> = null;

    const onNotification = (payload: SocketPayload) => {
      if (!active || !role) return;

      invalidateForRole(qc, role);

      const onNotificationsPage = location.pathname.includes("/notifications");
      if (!onNotificationsPage) {
        toast.info(payload.title);
      }
    };

    const onAdminPending = () => {
      if (!active || role !== "admin") return;
      invalidateForRole(qc, "admin");
      if (!location.pathname.startsWith("/admin")) {
        toast.info("New admin activity — check your dashboard.");
      }
    };

    void getRealtimeSocket().then((socket) => {
      if (!active || !socket) return;
      socketInstance = socket;
      socket.on("notification:new", onNotification);
      socket.on("admin:pending", onAdminPending);
    });

    return () => {
      active = false;
      socketInstance?.off("notification:new", onNotification);
      socketInstance?.off("admin:pending", onAdminPending);
      disconnectRealtimeSocket();
    };
  }, [token, role, qc, location.pathname]);
}