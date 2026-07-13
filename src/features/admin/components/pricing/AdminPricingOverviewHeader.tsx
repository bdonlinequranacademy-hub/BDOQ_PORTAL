import { BookOpen } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuthStore } from "@/stores/authStore";

export function AdminPricingOverviewHeader() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="portal-card-islamic portal-card--lg relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8 sm:py-7">
      <div
        className="pointer-events-none absolute -right-10 -top-12 size-56 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-[min(100%,36rem)] -translate-x-1/2 opacity-[0.12] sm:h-36"
        style={{
          backgroundImage: "url('/brand/islamic-shape-bg.png')",
          backgroundSize: "contain",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />

      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user?.name || "Admin"}
            avatarUrl={user?.avatarUrl}
            size="lg"
            shape="circle"
          />
          <div className="min-w-0">
            <p className="text-lg font-bold text-portal-heading sm:text-xl">
              Welcome back, {name}
            </p>
            <span className="mt-1 inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
              Super Admin
            </span>
            <p className="mt-2 text-sm text-portal-muted">
              Manage learning packages for the public pricing page.
            </p>
          </div>
        </div>

        <div className="hidden text-center lg:block">
          <p className="font-display text-xl font-bold leading-relaxed text-primary-dark sm:text-2xl">
            رَبِّ زِدْنِي عِلْمًا
          </p>
          <p className="mt-1 text-xs text-portal-muted sm:text-sm">
            &ldquo;My Lord, increase me in knowledge.&rdquo; — Surah Taha 20:114
          </p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 sm:size-24">
            <BookOpen className="size-10 text-primary-dark sm:size-12" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
