import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileNavMenu } from "@/components/layout/MobileNavMenu";
import { BDOQ_BRAND, BDOQ_ROLE_PORTAL_LABEL } from "@/lib/bdoqBrand";
import { isStaffAdmin } from "@/lib/assignableRoles";
import { profilePathForRole } from "@/lib/portalNav";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { Role } from "@/types/models";
import type { ReactNode } from "react";

export interface IPortalNavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

interface IPortalLayoutProps {
  user: { name: string; email: string; role: Role; avatarUrl?: string; gender?: "male" | "female" };
  navItems: IPortalNavItem[];
  mobileTabs: IPortalNavItem[];
  primaryPaths: string[];
  unreadCount: number;
  hasNotifications: boolean;
  onSignOut: () => void;
}

function NavButton({
  item,
  active,
  onClick,
  layout,
}: {
  item: IPortalNavItem;
  active: boolean;
  onClick: () => void;
  layout: "sidebar" | "tab";
}) {
  if (layout === "sidebar") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
          active
            ? "portal-nav-item--active"
            : "text-white/75 hover:bg-white/10 hover:text-white"
        }`}
      >
        {item.icon}
        {item.label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 transition sm:px-3 ${
        active
          ? "bg-brand-red/10 text-brand-red dark:bg-white/10 dark:text-white"
          : "text-portal-muted hover:text-portal-heading"
      }`}
    >
      {item.icon}
      <span
        className={`max-w-[4.5rem] truncate text-[10px] ${active ? "font-semibold" : "font-medium"}`}
      >
        {item.label}
      </span>
    </button>
  );
}

export function PortalLayout({
  user,
  navItems,
  mobileTabs,
  primaryPaths,
  unreadCount,
  hasNotifications,
  onSignOut,
}: IPortalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(path: string) {
    if (path === `/${user.role}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  }

  const portalLabel =
    BDOQ_ROLE_PORTAL_LABEL[user.role] ?? `${user.role} portal`;
  const activePage = navItems.find((n) => isActive(n.path))?.label ?? "Dashboard";
  const profilePath = profilePathForRole(user.role);

  function goToProfile() {
    if (profilePath) navigate(profilePath);
  }

  return (
    <div className="min-h-screen bg-portal text-portal transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-portal-sidebar text-white lg:flex">
        <div className="flex flex-col items-center border-b border-white/10 px-5 py-6">
          <BrandLogo subtitle={portalLabel} />
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
          <button
            type="button"
            onClick={goToProfile}
            disabled={!profilePath}
            className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-left transition hover:bg-white/15 disabled:cursor-default"
          >
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              gender={user.gender}
              size="sm"
              shape="circle"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-3 w-full min-h-[44px] rounded-xl px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-portal bg-portal-header px-5 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wider text-portal-muted">
              {BDOQ_BRAND.shortName}
            </p>
            <p className="truncate text-sm font-semibold text-portal-heading">{activePage}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalSearch role={user.role} />
            <div className="hidden sm:block">
              <ThemeToggle compact />
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("portal:open-search"))}
              className="rounded-lg p-1.5 text-portal-heading hover:bg-portal-surface-muted/30 sm:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
            {hasNotifications && (
              <button
                type="button"
                className="relative min-h-[44px] min-w-[44px] rounded-lg p-1 hover:bg-portal-surface-muted/30"
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

            {profilePath ? (
              <button
                type="button"
                onClick={goToProfile}
                className="hidden cursor-pointer sm:flex"
                aria-label="Open profile"
                title="My profile"
              >
                <UserAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  gender={user.gender}
                  size="sm"
                  shape="circle"
                />
              </button>
            ) : null}
          </div>
        </header>

        <main className="flex-1 animate-page-in pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8">
          <Outlet />
        </main>

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
            onSignOut={onSignOut}
          />
        </nav>
      </div>
    </div>
  );
}
