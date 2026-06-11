import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types/models";

export function RoleRoute({ role }: { role: Role }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
