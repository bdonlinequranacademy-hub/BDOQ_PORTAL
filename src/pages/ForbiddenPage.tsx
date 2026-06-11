import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function ForbiddenPage() {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="font-display text-4xl text-navy">403</h1>
      {role === "parent" ? (
        <p className="max-w-md text-navy-500">
          Parent accounts are no longer used. Please sign in with your{" "}
          <strong>student account</strong> instead, or contact admin for help.
        </p>
      ) : (
        <p className="text-navy-500">You do not have permission to view this page.</p>
      )}
      <Link to="/login" className="font-semibold text-gold-dark hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
