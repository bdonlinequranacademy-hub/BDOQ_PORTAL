import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { forgotPasswordRequest } from "@/features/auth/api/authApi";
import { toast } from "@/stores/uiStore";
import { formControlLgClass } from "@/lib/formControl";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordRequest(email);
      setSent(true);
      toast.success("If an account exists, reset instructions were sent.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-md flex-col gap-6 py-4">
        <h1 className="font-display text-2xl font-bold text-navy">Forgot password?</h1>
        {sent ? (
          <p className="text-sm text-zinc-500">
            If an account exists for <strong>{email}</strong>, you will receive reset
            instructions. Check your inbox (and the backend console in dev without SMTP).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`h-11 ${formControlLgClass} pl-9 pr-4 bg-white`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-navy text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
        <Link to="/login" className="text-sm font-semibold text-gold hover:underline">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
