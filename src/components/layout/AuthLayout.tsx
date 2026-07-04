import type { ReactNode } from "react";
import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { BISMILLAH } from "@/lib/islamicPortal";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandingPanel />

      <div className="portal-auth-bg flex flex-1 flex-col">
        <p className="pt-6 text-center font-arabic text-lg text-primary-dark lg:hidden dark:text-gold">
          {BISMILLAH}
        </p>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-8 sm:max-w-md sm:px-8 lg:max-w-lg lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
