import { Link, useSearchParams } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { resendVerificationRequest } from "@/features/auth/api/authApi";
import { toast } from "@/stores/uiStore";

export function CheckEmailPage() {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const [sending, setSending] = useState(false);

  async function handleResend() {
    if (!email) return;
    setSending(true);
    try {
      await resendVerificationRequest(email);
      toast.success("If your account is unverified, a new link was sent.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center gap-6 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#EEF2F8]">
          <Mail className="size-8 text-primary-dark" />
        </div>
        <h1 className="text-2xl font-bold text-navy">Check your email</h1>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
          We sent a verification link to{" "}
          <span className="font-semibold text-navy">{email || "your inbox"}</span>.
          Open it to activate your account, then sign in.
        </p>
        <p className="text-xs text-zinc-400">
          In development without SMTP, check the backend terminal for the verification link.
        </p>
        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="text-sm font-semibold text-gold hover:underline disabled:opacity-50"
          >
            {sending ? "Sending…" : "Resend verification email"}
          </button>
        )}
        <Link to="/login" className="text-sm font-semibold text-navy hover:underline">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
