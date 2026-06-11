import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-portal transition-colors duration-200">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-10 sm:max-w-md sm:px-8 lg:max-w-lg lg:px-10">
        {children}
      </div>
    </div>
  );
}
