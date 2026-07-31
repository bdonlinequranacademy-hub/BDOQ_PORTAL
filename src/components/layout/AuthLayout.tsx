import type { ReactNode } from "react";
import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { BISMILLAH } from "@/lib/islamicPortal";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] min-h-[webkit-fill-available]">
      <div className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 sm:right-6">
        <LanguageToggle variant="light" />
      </div>
      <AuthBrandingPanel />

      <div className="portal-auth-bg flex flex-1 flex-col">
        <p className="pt-[max(1rem,env(safe-area-inset-top))] text-center font-arabic text-lg text-primary-dark lg:hidden dark:text-gold">
          {BISMILLAH}
        </p>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-md sm:px-6 lg:max-w-lg lg:px-10 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
