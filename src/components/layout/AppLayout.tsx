import { useNavigate } from "react-router-dom";
import {
  BookOpen,
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
  BarChart3,
  Inbox,
  Library,
  CreditCard,
  Briefcase,
  GraduationCap,
  Bell,
  MessageSquareQuote,
  Award,
  Radio,
  Images,
  Mail,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotifications";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { mobilePrimaryPaths } from "@/components/layout/MobileNavMenu";
import {
  PortalLayout,
  type IPortalNavItem,
} from "@/components/ui/shared/PortalLayout";
import type { Role } from "@/types/models";

function navItemsForRole(role: Role): IPortalNavItem[] {
  switch (role) {
    case "teacher":
      return [
        { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, path: "/teacher" },
        { label: "Today's Classes", icon: <Calendar className="size-5" />, path: "/teacher/schedule/today" },
        { label: "My Routine", icon: <CalendarDays className="size-5" />, path: "/teacher/schedule/routine" },
        { label: "Class Logs", icon: <ClipboardList className="size-5" />, path: "/teacher/class-logs" },
        { label: "My Students", icon: <Users className="size-5" />, path: "/teacher/students" },
        { label: "My Classes", icon: <BookOpen className="size-5" />, path: "/teacher/classes" },
        { label: "Attendance", icon: <ClipboardCheck className="size-5" />, path: "/teacher/attendance" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/teacher/homework" },
        { label: "Progress", icon: <TrendingUp className="size-5" />, path: "/teacher/progress" },
        { label: "Weekly Report", icon: <MessageSquare className="size-5" />, path: "/teacher/weekly-report" },
        { label: "Earnings", icon: <Banknote className="size-5" />, path: "/teacher/earnings" },
        { label: "Availability", icon: <Clock className="size-5" />, path: "/teacher/availability" },
        { label: "Request Student", icon: <UserPlus className="size-5" />, path: "/teacher/student-requests" },
        { label: "Notifications", icon: <Bell className="size-5" />, path: "/teacher/notifications" },
        { label: "Profile", icon: <User className="size-5" />, path: "/teacher/profile" },
      ];
    case "student":
      return [
        { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, path: "/student" },
        { label: "My Classes", icon: <BookOpen className="size-5" />, path: "/student/classes" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/student/homework" },
        { label: "Attendance", icon: <ClipboardList className="size-5" />, path: "/student/attendance" },
        { label: "Progress", icon: <TrendingUp className="size-5" />, path: "/student/progress" },
        { label: "Weekly Summary", icon: <MessageSquare className="size-5" />, path: "/student/summary" },
        { label: "Payments", icon: <CreditCard className="size-5" />, path: "/student/payments" },
        { label: "Notifications", icon: <Bell className="size-5" />, path: "/student/notifications" },
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
        { label: "Routine", icon: <CalendarDays className="size-5" />, path: "/admin/schedule/routine" },
        { label: "Live Monitor", icon: <Radio className="size-5" />, path: "/admin/live-monitor" },
        { label: "Class Logs", icon: <ClipboardCheck className="size-5" />, path: "/admin/class-logs" },
        { label: "Free Class Leads", icon: <CalendarCheck className="size-5" />, path: "/admin/trial-bookings" },
        { label: "Contact Inbox", icon: <Inbox className="size-5" />, path: "/admin/contact-messages" },
        { label: "Newsletter", icon: <Mail className="size-5" />, path: "/admin/newsletter-subscribers" },
        { label: "Student Admissions", icon: <GraduationCap className="size-5" />, path: "/admin/student-admissions" },
        { label: "Teacher Applications", icon: <Briefcase className="size-5" />, path: "/admin/teacher-applications" },
        { label: "Teacher Requests", icon: <UserPlus className="size-5" />, path: "/admin/student-requests" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/admin/homework" },
        { label: "Teacher Pay", icon: <Banknote className="size-5" />, path: "/admin/earnings" },
        { label: "Attendance", icon: <ClipboardList className="size-5" />, path: "/admin/attendance" },
        { label: "Progress", icon: <BarChart3 className="size-5" />, path: "/admin/progress" },
        { label: "Blog CMS", icon: <Newspaper className="size-5" />, path: "/admin/blog" },
        { label: "Student Reviews", icon: <MessageSquareQuote className="size-5" />, path: "/admin/testimonials" },
        { label: "Gallery CMS", icon: <Images className="size-5" />, path: "/admin/gallery" },
        { label: "Pricing CMS", icon: <CreditCard className="size-5" />, path: "/admin/pricing" },
        { label: "Resources", icon: <Library className="size-5" />, path: "/admin/resources" },
        { label: "Certificates", icon: <Award className="size-5" />, path: "/admin/certificates" },
        { label: "Profile", icon: <User className="size-5" />, path: "/admin/profile" },
      ];
    case "parent":
      return [
        { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, path: "/parent" },
        { label: "Homework", icon: <BookOpenCheck className="size-5" />, path: "/parent/homework" },
        { label: "Attendance", icon: <ClipboardList className="size-5" />, path: "/parent/attendance" },
        { label: "Progress", icon: <TrendingUp className="size-5" />, path: "/parent/progress" },
        { label: "Notifications", icon: <Bell className="size-5" />, path: "/parent/notifications" },
      ];
    default:
      return [];
  }
}

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { count: unreadCount, hasNotifications } = useUnreadNotificationCount();
  useRealtimeNotifications();

  if (!user) return null;

  const navItems = navItemsForRole(user.role);
  const primaryPaths = mobilePrimaryPaths(user.role);
  const mobileTabs = navItems.filter((item) => primaryPaths.includes(item.path));

  return (
    <PortalLayout
      user={user}
      navItems={navItems}
      mobileTabs={mobileTabs}
      primaryPaths={primaryPaths}
      unreadCount={unreadCount}
      hasNotifications={hasNotifications}
      onSignOut={() => {
        logout();
        navigate("/login");
      }}
    />
  );
}
