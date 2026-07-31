import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function TeacherHomePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, role } = usePortalTranslation();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <h1 className="text-2xl text-navy">
          {t("teacher.dashboardPlaceholder", { role: role("teacher") })}
        </h1>
        <p className="mt-2 text-sm text-navy-500">
          {t("teacher.signedInAs")}{" "}
          <span className="font-semibold text-navy">
            {user?.name ?? t("teacher.unknown")}
          </span>{" "}
          ({user?.role ? role(user.role) : "?"}).
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="danger" onClick={logout}>
            {t("teacher.logout")}
          </Button>
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-gold-dark hover:underline"
          >
            {t("teacher.devHome")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
