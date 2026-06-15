import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types/models";
import { matchesAdminRoute } from "@/lib/utils/roles";

export function RoleRoute({ role }: { role: Role }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed =
    role === "admin" ? matchesAdminRoute(user.role) : user.role === role;

  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
