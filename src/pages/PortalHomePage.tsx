import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { homePathForRole, matchesAdminRoute } from "@/lib/utils/roles";
import { loginPathForPortal, type PortalIntent } from "@/lib/portalAuth";
import type { Role } from "@/types/models";

const PORTALS: { role: PortalIntent; label: string; desc: string }[] = [
  {
    role: "student",
    label: "Student",
    desc: "Classes, homework, progress, weekly summary & study plan — one account for learners and guardians",
  },
  { role: "teacher", label: "Teacher", desc: "Classes, attendance, grading & AI tools" },
  { role: "admin", label: "Admin", desc: "Users, classes & academy analytics" },
];

export function PortalHomePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = Boolean(token && user);

  return (
    <div className="min-h-screen bg-portal">
      <header className="border-b border-portal bg-portal-header px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <p className="text-xs text-zinc-500">Learning portal</p>
          </div>
          {isAuthenticated && user ? (
            <Link to={homePathForRole(user.role)}>
              <Button className="gap-2 rounded-xl bg-[#03214F] text-white">
                <LayoutDashboard className="size-4" />
                My dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="gap-2 rounded-xl bg-[#03214F] text-white">
                <LogIn className="size-4" />
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center lg:text-left">
          <h2 className="font-display text-3xl font-bold text-portal-heading lg:text-4xl">
            Welcome to your academy portal
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-600 lg:mx-0">
            Sign in with your student account to access classes, track Quran progress, and view
            weekly AI summaries. Guardians use the same student login.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PORTALS.map((p) => (
            <Card
              key={p.role}
              className="flex flex-col gap-3 rounded-2xl border-0 p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="font-display text-lg font-bold capitalize text-portal-heading">
                {p.label}
              </span>
              <p className="flex-1 text-sm text-zinc-500">{p.desc}</p>
              <Link
                to={
                  isAuthenticated && user && (p.role === "admin" ? matchesAdminRoute(user.role) : user.role === p.role)
                    ? homePathForRole(user.role as Role)
                    : loginPathForPortal(p.role)
                }
                className="text-sm font-semibold text-[#C4922B] hover:underline"
              >
                {isAuthenticated && user && (p.role === "admin" ? matchesAdminRoute(user.role) : user.role === p.role)
                  ? "Open portal →"
                  : "Sign in →"}
              </Link>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-zinc-400">
          Public marketing site (Astro) is separate · This app is the authenticated SPA
        </p>
      </main>
    </div>
  );
}
