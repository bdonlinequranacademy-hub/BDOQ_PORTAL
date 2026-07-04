import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Grid3x3, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils/cn";
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
        className={cn(
          "portal-mobile-tab",
          (hasActiveOverflow || open) && "portal-mobile-tab--active"
        )}
        aria-label="More navigation"
      >
        <Grid3x3 className="size-[22px]" />
        <span className={cn("text-[10px] leading-tight", hasActiveOverflow ? "font-semibold" : "font-medium")}>
          More
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[min(88dvh,560px)] overflow-y-auto rounded-t-[1.75rem] border-t border-primary/15 bg-portal-surface pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-portal-muted/40" />
            </div>

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-portal-border bg-portal-surface px-5 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-dark dark:text-gold">
                  {role.replace("_", " ")} menu
                </p>
                <p className="font-display text-base font-bold text-portal-heading">{userName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center rounded-xl bg-portal-surface-muted/30 text-portal-muted"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3">
              {overflowItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => go(item.path)}
                  className={cn(
                    "flex min-h-[52px] items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition active:scale-[0.98]",
                    isActive(item.path)
                      ? "bg-primary/10 font-semibold text-primary-dark dark:text-primary"
                      : "text-portal-heading active:bg-portal-surface-muted/30"
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:size-5">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => go(`/${role}/notifications`)}
                className="flex min-h-[52px] items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-portal-heading active:bg-portal-surface-muted/30"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="size-5" />
                </span>
                Notifications
              </button>

              <div className="my-2 flex items-center justify-between rounded-2xl bg-portal-surface-muted/20 px-4 py-3">
                <span className="text-sm text-portal-muted">Appearance</span>
                <ThemeToggle />
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="mt-1 min-h-[52px] rounded-2xl px-4 py-3 text-left text-sm font-medium text-brand-red active:bg-brand-red/10"
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
      return ["/teacher", "/teacher/schedule/today", "/teacher/class-logs", "/teacher/classes"];
    case "student":
      return ["/student", "/student/classes", "/student/homework", "/student/attendance"];
    case "admin":
    case "super_admin":
      return ["/admin", "/admin/live-monitor", "/admin/class-logs", "/admin/users"];
    case "parent":
      return ["/parent", "/parent/homework", "/parent/attendance", "/parent/progress"];
    default:
      return [];
  }
}
