import { Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsTipBannerProps {
  pendingCount: number;
}

export function AdminTestimonialsTipBanner({
  pendingCount,
}: IAdminTestimonialsTipBannerProps) {
  const { t } = usePortalTranslation();

  return (
    <Card className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
        <Info className="size-4 text-primary-dark" aria-hidden />
      </span>
      <div>
        <p className="text-sm font-semibold text-primary-dark">{t("admin.cms.shared.tipBanner")}</p>
        <p className="mt-1 text-sm leading-relaxed text-portal-muted">
          {pendingCount > 0
            ? `${pendingCount} review${pendingCount === 1 ? "" : "s"} awaiting approval — edit and enable Show on website to publish on the homepage.`
            : 'All reviews are published. Toggle "Show on website" when editing to hide a review without deleting it.'}
        </p>
      </div>
    </Card>
  );
}
