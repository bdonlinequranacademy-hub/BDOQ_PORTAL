/** Left panel on auth screens — full promotional artwork */
export function AuthBrandingPanel() {
  return (
    <div className="portal-auth-panel relative hidden overflow-hidden lg:flex lg:w-[42%] xl:w-[44%]">
      <img
        src="/brand/auth-promo.png"
        alt="BDOQ Academy — Online Quran Academy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* Soft edge so panel meets form clean */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent"
        aria-hidden
      />
    </div>
  );
}
