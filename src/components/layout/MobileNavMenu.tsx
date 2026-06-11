import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { Role } from "@/types/models";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MobileNavMenuProps {
  role: Role;
  navItems: NavItem[];
  primaryPaths: string[];
  isActive: (path: string) => boolean;
  userName: string;
  onSignOut: () => void;
}

export function MobileNavMenu({
  role,
  navItems,
  primaryPaths,
  isActive,
  userName,
  onSignOut,
}: MobileNavMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const primarySet = new Set(primaryPaths);
  const overflowItems = navItems.filter((item) => !primarySet.has(item.path));
  const hasActiveOverflow = overflowItems.some((item) => isActive(item.path));

  function go(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition ${
          hasActiveOverflow || open
            ? "bg-navy/10 text-portal-heading dark:bg-white/10"
            : "text-portal-muted hover:text-portal-heading"
        }`}
        aria-label="More navigation"
      >
        <Menu className="size-5" />
        <span
          className={`text-[10px] ${hasActiveOverflow ? "font-semibold text-portal-heading" : "font-medium"}`}
        >
          More
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[min(85vh,520px)] overflow-y-auto rounded-t-3xl border-t border-portal-border bg-portal-surface pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-portal-border bg-portal-surface px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-portal-muted">{role} menu</p>
                <p className="font-semibold text-portal-heading">{userName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-portal-muted hover:bg-portal-muted/20"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1 p-3">
              {overflowItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => go(item.path)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                    isActive(item.path)
                      ? "bg-navy/10 font-semibold text-portal-heading dark:bg-white/10"
                      : "text-portal-heading hover:bg-portal-muted/20"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => go(`/${role}/notifications`)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-portal-heading hover:bg-portal-muted/20"
              >
                Notifications
              </button>

              <div className="my-2 border-t border-portal-border pt-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-portal-muted">Appearance</span>
                  <ThemeToggle />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="mt-1 rounded-xl px-4 py-3 text-left text-sm text-red-500 hover:bg-red-500/10"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function mobilePrimaryPaths(role: Role): string[] {
  switch (role) {
    case "teacher":
      return ["/teacher", "/teacher/schedule/today", "/teacher/class-logs", "/teacher/student-care"];
    case "student":
      return ["/student", "/student/classes", "/student/homework", "/student/progress"];
    case "admin":
      return ["/admin", "/admin/class-logs", "/admin/users", "/admin/classes"];
    default:
      return [];
  }
}
