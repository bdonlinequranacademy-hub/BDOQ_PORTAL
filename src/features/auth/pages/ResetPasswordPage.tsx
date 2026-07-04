import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { resetPasswordRequest } from "@/features/auth/api/authApi";
import { toast } from "@/stores/uiStore";
import { formControlLgClass } from "@/lib/formControl";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordRequest(token, password);
      toast.success("Password updated. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <p className="text-sm text-zinc-500">Invalid or missing reset token.</p>
        <Link to="/forgot-password" className="text-sm font-semibold text-gold">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-md flex-col gap-6 py-4">
        <h1 className="text-2xl font-bold text-navy">Set a new password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className={`h-11 ${formControlLgClass} pl-9 pr-4 bg-white`}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className={`h-11 ${formControlLgClass} pl-9 pr-4 bg-white`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-brand-red text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
