import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, LogOut, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileNavMenu } from "@/components/layout/MobileNavMenu";
import { BDOQ_BRAND, BDOQ_ROLE_PORTAL_LABEL } from "@/lib/bdoqBrand";
import { isStaffAdmin } from "@/lib/assignableRoles";
import { profilePathForRole } from "@/lib/portalNav";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils/cn";
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

const SIDEBAR_OPEN_KEY = "bdoq-portal-sidebar-open";
const SIDEBAR_EXPANDED_CLASS = "lg:pl-64";
const SIDEBAR_COLLAPSED_CLASS = "lg:pl-[4.5rem]";

function readSidebarOpenPreference(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(SIDEBAR_OPEN_KEY) !== "false";
}

function NavButton({
  item,
  active,
  onClick,
  layout,
  collapsed = false,
}: {
  item: IPortalNavItem;
  active: boolean;
  onClick: () => void;
  layout: "sidebar" | "tab";
  collapsed?: boolean;
}) {
  if (layout === "sidebar") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
        className={`relative flex w-full min-h-[44px] items-center rounded-xl text-sm transition ${
          collapsed
            ? "justify-center px-2 py-2.5"
            : "gap-3 px-3 py-2.5 text-left"
        } ${
          active
            ? collapsed
              ? "portal-nav-item--active portal-nav-item--active-collapsed"
              : "portal-nav-item--active"
            : "text-white/75 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="shrink-0 [&>svg]:size-5">{item.icon}</span>
        {!collapsed ? <span className="truncate">{item.label}</span> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "portal-mobile-tab",
        active && "portal-mobile-tab--active",
        active
          ? "lg:bg-primary/10 lg:text-primary dark:lg:bg-white/10 dark:lg:text-white"
          : "lg:text-portal-muted lg:hover:text-portal-heading"
      )}
    >
      <span
        className={cn(
          "[&>svg]:size-[22px] lg:[&>svg]:size-5",
          active && "scale-105 transition-transform"
        )}
      >
        {item.icon}
      </span>
      <span
        className={cn(
          "max-w-[4.25rem] truncate text-[10px] leading-tight lg:max-w-[4.5rem]",
          active ? "font-semibold" : "font-medium"
        )}
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
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpenPreference);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_OPEN_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

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
    <div className="portal-page-bg min-h-screen text-portal transition-colors duration-200">
      <aside
        className={`bg-portal-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col text-white transition-[width] duration-300 ease-in-out lg:flex ${
          sidebarOpen ? "w-64" : "w-[4.5rem]"
        }`}
      >
        <div className="border-b border-gold/20">
          {sidebarOpen ? (
            <div className="flex items-start gap-2 px-4 py-4">
              <div className="min-w-0 flex-1">
                <BrandLogo subtitle={portalLabel} />
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-2 py-4">
              <BrandLogo compact />
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex size-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          )}
        </div>

        <nav
          className={`portal-sidebar-nav flex flex-1 flex-col gap-1 overflow-y-auto py-4 ${
            sidebarOpen ? "px-4" : "px-2"
          }`}
        >
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
              layout="sidebar"
              collapsed={!sidebarOpen}
            />
          ))}
        </nav>

        <div
          className={`border-t border-gold/20 py-4 ${sidebarOpen ? "px-4" : "px-2"}`}
        >
          {sidebarOpen ? (
            <p className="mb-3 px-1 text-center text-[10px] leading-relaxed text-white/50">
              {BDOQ_BRAND.portalTagline}
            </p>
          ) : null}
          <button
            type="button"
            onClick={goToProfile}
            disabled={!profilePath}
            title={!sidebarOpen ? user.name : undefined}
            aria-label={!sidebarOpen ? `Profile: ${user.name}` : undefined}
            className={`flex w-full items-center rounded-xl bg-white/10 transition hover:bg-white/15 disabled:cursor-default ${
              sidebarOpen ? "gap-3 px-3 py-3 text-left" : "justify-center p-2"
            }`}
          >
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              gender={user.gender}
              size="sm"
              shape="circle"
            />
            {sidebarOpen ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-white/60">{user.email}</p>
              </div>
            ) : null}
          </button>
          <button
            type="button"
            onClick={onSignOut}
            title={!sidebarOpen ? "Sign out" : undefined}
            aria-label="Sign out"
            className={`mt-3 flex w-full min-h-[44px] items-center rounded-xl text-sm text-white/70 transition hover:bg-white/10 hover:text-white ${
              sidebarOpen ? "px-3 py-2 text-left" : "justify-center p-2"
            }`}
          >
            {sidebarOpen ? (
              "Sign out"
            ) : (
              <LogOut className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </aside>

      <div
        className={`portal-mobile-shell flex min-h-screen w-full min-w-0 flex-col transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? SIDEBAR_EXPANDED_CLASS : SIDEBAR_COLLAPSED_CLASS
        }`}
      >
        <header className="portal-mobile-header sticky top-0 z-40 lg:border-b lg:border-primary/10 lg:bg-portal-header lg:px-8 lg:py-3 lg:backdrop-blur-sm lg:shadow-none">
          {/* Mobile app bar */}
          <div className="flex items-center gap-2 px-3 sm:px-4 lg:hidden">
            <img
              src={BDOQ_BRAND.logoSrc}
              alt=""
              aria-hidden
              decoding="async"
              className="size-9 shrink-0 rounded-xl object-contain"
            />
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate font-display text-base font-bold text-portal-heading">
                {activePage}
              </p>
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-gold-dark dark:text-gold">
                {portalLabel}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("portal:open-search"))}
                className="flex size-10 items-center justify-center rounded-xl text-portal-heading active:bg-primary/10"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
              {hasNotifications ? (
                <button
                  type="button"
                  className="relative flex size-10 items-center justify-center rounded-xl active:bg-primary/10"
                  aria-label="Notifications"
                  onClick={() =>
                    navigate(
                      isStaffAdmin(user.role)
                        ? "/admin"
                        : `/${user.role}/notifications`
                    )
                  }
                >
                  <Bell className="size-5 text-portal-heading" />
                  {unreadCount > 0 ? (
                    <span className="absolute right-1 top-1 flex size-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-0.5 text-[9px] font-bold text-white ring-2 ring-[var(--portal-header)]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </button>
              ) : null}
              {profilePath ? (
                <button
                  type="button"
                  onClick={goToProfile}
                  className="flex size-10 items-center justify-center rounded-xl active:bg-primary/10"
                  aria-label="Open profile"
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
          </div>

          {/* Desktop header */}
          <div className="hidden w-full items-center justify-between px-6 lg:flex">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium uppercase tracking-wider text-gold-dark dark:text-gold">
                {BDOQ_BRAND.shortName}
              </p>
              <p className="truncate font-display text-sm font-semibold text-portal-heading">{activePage}</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <GlobalSearch role={user.role} />
              <div className="hidden sm:block">
                <ThemeToggle compact />
              </div>
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
          </div>
        </header>

        <main className="portal-mobile-content flex-1 w-full min-w-0 animate-page-in lg:pb-8">
          <Outlet />
        </main>

        <nav className="portal-mobile-tabbar fixed inset-x-0 bottom-0 z-40 lg:hidden">
          <div className="flex items-stretch justify-around gap-0.5 px-1.5 pt-1.5">
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
          </div>
        </nav>
      </div>
    </div>
  );
}
