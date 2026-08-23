import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { MobileNavMenu } from "@/components/layout/MobileNavMenu";
import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { isStaffAdmin } from "@/lib/assignableRoles";
import { profilePathForRole } from "@/lib/portalNav";
import {
  groupPortalNavItems,
  type IPortalNavItem,
} from "@/lib/portalSidebarNav";
import { hijriDateLabel } from "@/lib/islamicPortal";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils/cn";
import type { Role } from "@/types/models";

export type { IPortalNavItem };

interface IPortalLayoutProps {
  user: {
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
    gender?: "male" | "female";
  };
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
  emphasize = false,
}: {
  item: IPortalNavItem;
  active: boolean;
  onClick: () => void;
  layout: "sidebar" | "tab";
  collapsed?: boolean;
  emphasize?: boolean;
}) {
  if (layout === "sidebar") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex w-full min-h-[44px] items-center rounded text-sm transition-all duration-200",
          collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3.5 py-2.5 text-left",
          active
            ? collapsed
              ? "portal-nav-item--active portal-nav-item--active-collapsed"
              : "portal-nav-item--active"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <span className="shrink-0 text-current [&>svg]:size-[18px]">{item.icon}</span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 truncate font-medium tracking-wide">
              {item.label}
            </span>
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 transition",
                active ? "text-gold opacity-90" : "text-white/35"
              )}
              aria-hidden
            />
          </>
        ) : null}
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
  const { t, role: roleLabel, portalLabel, section, locale } = usePortalTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpenPreference);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(SIDEBAR_OPEN_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  function isActive(path: string) {
    if (path === `/${user.role}` || path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }

  const portalLabelText = portalLabel(user.role);
  const activePage =
    navItems.find((n) => isActive(n.path))?.label ?? t("layout.dashboard");
  const profilePath = profilePathForRole(user.role);
  const navSections = useMemo(
    () => groupPortalNavItems(navItems, user.role, section),
    [navItems, user.role, locale, section]
  );
  const profileActive = Boolean(profilePath && isActive(profilePath));
  const hijriLabel = useMemo(() => hijriDateLabel(), []);

  useEffect(() => {
    const activeSection = navSections.find((sec) =>
      sec.items.some((item) => isActive(item.path))
    );
    if (activeSection && activeSection.id !== "dashboard") {
      setExpandedSections((prev) => ({ ...prev, [activeSection.id]: true }));
    }
  }, [location.pathname, navSections]);

  function goToProfile() {
    if (profilePath) navigate(profilePath);
  }

  return (
    <div className="portal-page-bg min-h-screen text-portal transition-colors duration-200">
      <aside
        className={cn(
          "bg-portal-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col overflow-hidden text-white transition-[width] duration-300 ease-in-out lg:flex",
          sidebarOpen ? "w-64" : "w-[4.5rem]"
        )}
      >
        {/* Brand header — logo stacked above portal label */}
        <div className="relative z-10 border-b border-gold/25">
          {sidebarOpen ? (
            <div className="relative px-4 pb-4 pt-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded border border-white/15 text-white/70 transition hover:border-gold/40 hover:bg-white/10 hover:text-white"
                aria-label={t("layout.collapseSidebar")}
                title={t("layout.collapseSidebar")}
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <BrandLogo subtitle={portalLabelText} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-2 py-4">
              <BrandLogo compact />
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex size-8 items-center justify-center rounded border border-white/15 text-white/70 transition hover:border-gold/40 hover:bg-white/10 hover:text-white"
                aria-label={t("layout.expandSidebar")}
                title={t("layout.expandSidebar")}
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav
          className={cn(
            "portal-sidebar-nav relative z-10 flex flex-1 flex-col overflow-y-auto py-3",
            sidebarOpen ? "px-3" : "px-2"
          )}
        >
          {navSections.map((section) => {
            if (section.id === "dashboard" || !section.label) {
              return (
                <div key={section.id} className="mb-2 flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <NavButton
                      key={item.path}
                      item={item}
                      active={isActive(item.path)}
                      onClick={() => navigate(item.path)}
                      layout="sidebar"
                      collapsed={!sidebarOpen}
                      emphasize={section.id === "dashboard"}
                    />
                  ))}
                </div>
              );
            }

            const isExpanded = expandedSections[section.id] ?? false;

            return (
              <div key={section.id} className="mb-1">
                {sidebarOpen ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [section.id]: !prev[section.id],
                      }))
                    }
                    className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-portal-muted transition-colors hover:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3 shrink-0 text-gold" aria-hidden />
                      <span>{section.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "size-3.5 transition-transform",
                        isExpanded ? "rotate-90" : ""
                      )}
                    />
                  </button>
                ) : null}

                <div
                  className={cn(
                    "flex flex-col gap-0.5 overflow-hidden transition-all duration-200",
                    sidebarOpen && section.label && !isExpanded
                      ? "max-h-0"
                      : "max-h-[1000px] pb-1"
                  )}
                >
                  {section.items.map((item) => (
                    <NavButton
                      key={item.path}
                      item={item}
                      active={isActive(item.path)}
                      onClick={() => navigate(item.path)}
                      layout="sidebar"
                      collapsed={!sidebarOpen}
                      emphasize={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Profile + sign out */}
        <div
          className={cn(
            "relative z-10 mt-auto border-t border-gold/20 pb-14 pt-3",
            sidebarOpen ? "px-3" : "px-2"
          )}
        >
          {sidebarOpen ? (
            <div className="portal-sidebar-profile-card rounded-2xl p-3">
              <button
                type="button"
                onClick={goToProfile}
                disabled={!profilePath}
                aria-current={profileActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl text-left transition disabled:cursor-default",
                  profileActive ? "opacity-100" : "hover:opacity-95"
                )}
              >
                <UserAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  gender={user.gender}
                  size="sm"
                  shape="circle"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-gold">
                    {roleLabel(user.role)}
                    <BadgeCheck className="size-3.5 shrink-0 text-gold" aria-hidden />
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={onSignOut}
                aria-label={t("layout.signOut")}
                className="mt-3 flex w-full min-h-[40px] items-center gap-2 rounded-xl px-1 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                {t("layout.signOut")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={goToProfile}
                disabled={!profilePath}
                title={user.name}
                aria-label={`Profile: ${user.name}`}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border border-gold/25 bg-black/20 transition hover:border-gold/50",
                  profileActive && "portal-nav-item--active portal-nav-item--active-collapsed"
                )}
              >
                <UserAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  gender={user.gender}
                  size="sm"
                  shape="circle"
                />
              </button>
              <button
                type="button"
                onClick={onSignOut}
                title={t("layout.signOut")}
                aria-label={t("layout.signOut")}
                className="flex size-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div
        className={cn(
          "portal-mobile-shell portal-islamic-page flex min-h-screen w-full min-w-0 flex-col transition-[padding] duration-300 ease-in-out",
          sidebarOpen ? SIDEBAR_EXPANDED_CLASS : SIDEBAR_COLLAPSED_CLASS
        )}
      >
        <div className="portal-islamic-page-content flex min-h-screen flex-1 flex-col">
          <header className="portal-mobile-header sticky top-0 z-40 lg:border-b lg:border-portal/80 lg:px-8 lg:py-2 lg:shadow-sm">
          {/* Mobile app bar */}
          <div className="flex items-center gap-2 px-3 sm:px-4 lg:hidden">
            <img
              src={BDOQ_BRAND.logoSrc}
              alt=""
              aria-hidden
              decoding="async"
              className="h-14 w-14 shrink-0 rounded-xl object-contain"
            />
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate font-display text-lg font-bold text-portal-heading">
                {activePage}
              </p>
              <p className="truncate text-[11px] font-medium uppercase tracking-wider text-gold-dark dark:text-gold">
                {portalLabelText}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <LanguageToggle variant="light" />
              <GlobalSearch role={user.role} variant="host" />
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("portal:open-search"))}
                className="flex size-10 items-center justify-center rounded-xl text-portal-heading active:bg-primary/10"
                aria-label={t("layout.search")}
              >
                <Search className="size-5" />
              </button>
              {hasNotifications ? (
                <button
                  type="button"
                  className="relative flex size-10 items-center justify-center rounded-xl active:bg-primary/10"
                  aria-label={t("layout.notifications")}
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
                  aria-label={t("layout.openProfile")}
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
          <div className="hidden w-full items-center gap-4 px-6 lg:flex xl:gap-6">
            <div className="min-w-0 shrink-0 basis-[11.5rem] xl:basis-[13.5rem]">
              <p className="truncate font-display text-lg font-bold tracking-tight text-portal-heading xl:text-xl">
                {BDOQ_BRAND.shortName}
              </p>
              <p className="truncate text-sm font-semibold text-primary-dark dark:text-primary">
                {activePage}
              </p>
            </div>

            <div className="mx-auto flex min-w-0 max-w-2xl flex-1 items-center justify-center gap-3">
              <GlobalSearch
                role={user.role}
                variant="bar"
                className="w-full max-w-xl"
              />
              {hijriLabel ? (
                <span
                  className="hidden shrink-0 items-center rounded-xl border border-gold/35 bg-[linear-gradient(135deg,#fff8e7_0%,#f0fbf6_100%)] px-3 py-2 text-[11px] font-semibold text-[#0A4D3C] shadow-sm xl:inline-flex dark:border-gold/30 dark:bg-[linear-gradient(135deg,rgb(212_168_83/0.15)_0%,rgb(13_74_47/0.35)_100%)] dark:text-[#F5E6C8]"
                  title={t("layout.hijriDate")}
                >
                  <Sparkles className="mr-1.5 size-3.5 text-gold" aria-hidden />
                  {hijriLabel}
                </span>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <LanguageToggle variant="light" />
              <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-dark xl:inline-flex dark:bg-primary/20 dark:text-[#A7F3D0]">
                {roleLabel(user.role)}
              </span>
              <div className="hidden sm:block">
                <ThemeToggle compact />
              </div>
              {hasNotifications && (
                <button
                  type="button"
                  className="relative min-h-[44px] min-w-[44px] rounded-lg p-1 hover:bg-portal-surface-muted/30"
                  aria-label={t("layout.notifications")}
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
                  aria-label={t("layout.openProfile")}
                  title={t("layout.myProfile")}
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
            <div className="flex min-h-full flex-col">
              <Outlet />
            </div>
          </main>
        </div>

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
