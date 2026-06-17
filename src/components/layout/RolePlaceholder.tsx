import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";

export function RolePlaceholder({ role }: { role: string }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <h1 className="text-2xl text-navy">{role} Dashboard</h1>
        <p className="mt-2 text-sm text-navy-500">
          Protected placeholder. Signed in as{" "}
          <span className="font-semibold text-navy">
            {user?.name ?? "unknown"}
          </span>{" "}
          ({user?.role ?? "?"}).
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-gold-dark hover:underline"
          >
            Dev home
          </Link>
        </div>
      </Card>
    </div>
  );
}
