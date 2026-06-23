import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bell,
  LayoutDashboard,
  Users,
  BookOpenCheck,
  User,
  ClipboardList,
  TrendingUp,
  Newspaper,
  MessageSquare,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  Banknote,
  UserPlus,
  CalendarCheck,
  Clock,
  Search,
  BarChart3,
  Inbox,
  Library,
  CreditCard,
  Presentation,
  Radio,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotifications";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileNavMenu, mobilePrimaryPaths } from "@/components/layout/MobileNavMenu";
import { isStaffAdmin } from "@/lib/assignableRoles";
import type { Role } from "@/types/models";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

function navItemsForRole(role: Role): NavItem[] {
  switch (role) {
    case "teacher":
      return [
        { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, path: "/teacher" },
        { label: "Today", icon: <Calendar className="size-5" />, path: "/teacher/schedule/today" },
        { label: "Routine", icon: <CalendarDays className="size-5" />, path: "/teacher/schedule/routine" },
        { label: "Class Logs", icon: <ClipboardList className="size-5" />, path: "/teacher/class-logs" },
        { label: "Earnings", icon: <Banknote className="size-5" />, path: "/teacher/earnings" },
        { label: "Availability", icon: <Clock className="size-5" />, path: "/teacher/availability" },
        { label: "Request Student", icon: <UserPlus className="size-5" />, path: "/teacher/student-requests" },
        { label: "Weekly Report", icon: <MessageSquare className="size-5" />, path: "/teacher/weekly-report" },
        { label: "Students", icon: <Users className="size-5" />, path: "/teacher/students" },
        { label: "Classes", icon: <BookOpen className="size-5" />, path: "/teacher/classes" },
        { label: "Classroom", icon: <Presentation className="size-5" />, path: "/teacher/whiteboard" },
        { label: "Attendance", icon: <ClipboardCheck className="size-5" />, path: "/teacher/attendance" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/teacher/homework" },
        { label: "Progress", icon: <TrendingUp className="size-5" />, path: "/teacher/progress" },
        { label: "Profile", icon: <User className="size-5" />, path: "/teacher/profile" },
      ];
    case "student":
      return [
        { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, path: "/student" },
        { label: "Classes", icon: <BookOpen className="size-5" />, path: "/student/classes" },
        { label: "Live Class", icon: <Presentation className="size-5" />, path: "/student/classroom" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/student/homework" },
        { label: "Attendance", icon: <ClipboardList className="size-5" />, path: "/student/attendance" },
        { label: "Progress", icon: <TrendingUp className="size-5" />, path: "/student/progress" },
        { label: "Summary", icon: <MessageSquare className="size-5" />, path: "/student/summary" },
        { label: "Payments", icon: <CreditCard className="size-5" />, path: "/student/payments" },
        { label: "Profile", icon: <User className="size-5" />, path: "/student/profile" },
      ];
    case "super_admin":
    case "admin":
      return [
        { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, path: "/admin" },
        { label: "Users", icon: <Users className="size-5" />, path: "/admin/users" },
        { label: "Payments", icon: <CreditCard className="size-5" />, path: "/admin/payments" },
        { label: "Curriculum", icon: <Library className="size-5" />, path: "/admin/curriculum" },
        { label: "Classes", icon: <BookOpen className="size-5" />, path: "/admin/classes" },
        { label: "Live Classes", icon: <Radio className="size-5" />, path: "/admin/live-classes" },
        { label: "Routine", icon: <CalendarDays className="size-5" />, path: "/admin/schedule/routine" },
        { label: "Class Logs", icon: <ClipboardCheck className="size-5" />, path: "/admin/class-logs" },
        { label: "Trial Bookings", icon: <CalendarCheck className="size-5" />, path: "/admin/trial-bookings" },
        { label: "Contact Messages", icon: <Inbox className="size-5" />, path: "/admin/contact-messages" },
        { label: "Student Requests", icon: <UserPlus className="size-5" />, path: "/admin/student-requests" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/admin/homework" },
        { label: "Earnings", icon: <Banknote className="size-5" />, path: "/admin/earnings" },
        { label: "Attendance", icon: <ClipboardList className="size-5" />, path: "/admin/attendance" },
        { label: "Progress", icon: <BarChart3 className="size-5" />, path: "/admin/progress" },
        { label: "Blog", icon: <Newspaper className="size-5" />, path: "/admin/blog" },
      ];
    case "parent":
    default:
      return [];
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function NavButton({
  item,
  active,
  onClick,
  layout,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  layout: "sidebar" | "tab";
}) {
  if (layout === "sidebar") {
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
          active
            ? "bg-white/15 font-semibold text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        {item.icon}
        {item.label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 transition sm:px-3 ${
        active
          ? "bg-navy/10 text-portal-heading dark:bg-white/10"
          : "text-portal-muted hover:text-portal-heading"
      }`}
    >
      {item.icon}
      <span className={`text-[10px] ${active ? "font-semibold text-portal-heading" : "font-medium"}`}>
        {item.label}
      </span>
    </button>
  );
}

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { count: unreadCount, hasNotifications } = useUnreadNotificationCount();
  useRealtimeNotifications();

  if (!user) return null;

  const navItems = navItemsForRole(user.role);
  const primaryPaths = mobilePrimaryPaths(user.role);
  const mobileTabs = navItems.filter((item) => primaryPaths.includes(item.path));

  function isActive(path: string) {
    if (path === `/${user!.role}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  }

  return (
    <div className="min-h-screen bg-portal text-portal transition-colors duration-200">
      {/* Desktop sidebar (≥1024px) */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-[#03214F] text-white dark:bg-[var(--portal-sidebar)] lg:flex">
        <div className="flex flex-col items-center border-b border-white/10 px-6 py-5">
          <BrandLogo
            layout="sidebar"
            subtitle={user.role === "student" ? "student portal" : `${user.role} portal`}
          />
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
              layout="sidebar"
            />
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#C4922B] text-xs font-bold text-[#03214F]">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-3 w-full rounded-xl px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-portal bg-portal-header px-5 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <BrandLogo size="sm" />
          </div>

          <div className="hidden lg:block">
            <p className="text-xs font-medium uppercase tracking-wider text-portal-muted">
              {user.role} portal
            </p>
            <p className="text-sm font-semibold text-portal-heading">
              {navItems.find((n) => isActive(n.path))?.label ?? "Dashboard"}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalSearch role={user.role} />
            <div className="hidden sm:block">
              <ThemeToggle compact />
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("portal:open-search"))}
              className="rounded-lg p-1.5 text-portal-heading hover:bg-portal-muted/30 sm:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
            {hasNotifications && (
              <button
                type="button"
                className="relative rounded-lg p-1 hover:bg-portal-muted/30"
                aria-label="Notifications"
                onClick={() =>
                  navigate(
                    isStaffAdmin(user.role)
                      ? "/admin"
                      : `/${user.role}/notifications`
                  )
                }
              >
                <Bell className="size-6 text-portal-heading" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white ring-2 ring-[var(--portal-surface)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>
            )}

            <div className="hidden size-9 cursor-pointer select-none items-center justify-center rounded-full bg-navy text-xs font-bold text-white sm:flex dark:bg-gold dark:text-navy">
              {initials(user.name)}
            </div>
          </div>
        </header>

        <main className="flex-1 animate-page-in pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom tabs (<1024px) */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-portal bg-portal-header px-1 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm lg:hidden">
          {mobileTabs.map((item) => (
            <NavButton
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
              layout="tab"
            />
          ))}
          <MobileNavMenu
            role={user.role}
            navItems={navItems}
            primaryPaths={primaryPaths}
            isActive={isActive}
            userName={user.name}
            onSignOut={() => {
              logout();
              navigate("/login");
            }}
          />
        </nav>
      </div>
    </div>
  );
}
