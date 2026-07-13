import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { env } from "@/config/env";

interface IAdminPricingTipBannerProps {
  draftCount: number;
}

export function AdminPricingTipBanner({ draftCount }: IAdminPricingTipBannerProps) {
  return (
    <Card className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Lightbulb className="size-4 text-amber-700" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-900">Tips & Help</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/90">
            {draftCount > 0
              ? `${draftCount} draft package${draftCount === 1 ? "" : "s"} hidden from the website. Enable "Show on website" when ready to publish.`
              : "Keep feature lists short and clear. Mark one package Popular so visitors know the recommended plan."}
          </p>
          <a
            href={`${env.publicSiteUrl}/pricing`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-xs font-bold text-amber-900 underline-offset-2 hover:underline"
          >
            Read Pricing Guide →
          </a>
        </div>
      </div>
    </Card>
  );
}
