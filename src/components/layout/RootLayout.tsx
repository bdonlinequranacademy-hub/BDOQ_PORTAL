import { Outlet, useLocation } from "react-router-dom";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { cn } from "@/lib/utils/cn";

/** Routes that already render LanguageToggle inside PortalLayout or AuthLayout. */
function hasEmbeddedLanguageToggle(pathname: string): boolean {
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/admin")
  ) {
    return true;
  }

  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/check-email",
    "/verify-email",
    "/auth/callback",
  ];

  return authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function RootLayout() {
  const { pathname } = useLocation();
  const showGlobalToggle = !hasEmbeddedLanguageToggle(pathname);

  return (
    <>
      <Outlet />
      {showGlobalToggle ? (
        <div
          className={cn(
            "pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[100]",
            "flex justify-end px-4 sm:px-6"
          )}
        >
          <div
            className={cn(
              "pointer-events-auto rounded-full border border-gray-200/80 bg-white/95 shadow-md backdrop-blur-sm",
              "dark:border-portal-border dark:bg-portal-surface/95"
            )}
          >
            <LanguageToggle variant="light" />
          </div>
        </div>
      ) : null}
    </>
  );
}
