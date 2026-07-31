import { Link } from "react-router-dom";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function NotFoundPage() {
  const { t } = usePortalTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-4xl text-navy">404</h1>
      <p className="text-navy-500">{t("pages.notFoundDesc")}</p>
      <Link to="/" className="font-semibold text-gold-dark hover:underline">
        {t("pages.goHome")}
      </Link>
    </div>
  );
}
