import { Mic, Star, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { TestimonialMediaType } from "@/types/models";
import type { IMediaTypeRow } from "@/features/admin/components/testimonials/adminTestimonialsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsMediaTypesCardProps {
  rows: IMediaTypeRow[];
  activeType: TestimonialMediaType | "";
  onTypeSelect: (type: TestimonialMediaType | "") => void;
}

function TypeIcon({ type }: { type: TestimonialMediaType }) {
  if (type === "audio") return <Mic className="size-4 text-violet-600" aria-hidden />;
  if (type === "video") return <Video className="size-4 text-blue-600" aria-hidden />;
  return <Star className="size-4 text-emerald-600" aria-hidden />;
}

export function AdminTestimonialsMediaTypesCard({
  rows,
  activeType,
  onTypeSelect,
}: IAdminTestimonialsMediaTypesCardProps) {
  const { t } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.cms.shared.mediaTypes")}</h2>
        <button
          type="button"
          onClick={() => onTypeSelect("")}
          className="text-xs font-semibold text-primary hover:underline"
        >{t("admin.common.viewAllTeachers")}</button>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <button
            key={row.type}
            type="button"
            onClick={() => onTypeSelect(activeType === row.type ? "" : row.type)}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
              activeType === row.type
                ? "border-primary/30 bg-primary/5"
                : "border-portal bg-portal-muted/15 hover:border-primary/20"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-portal-surface">
                <TypeIcon type={row.type} />
              </span>
              <span className="truncate text-sm font-medium text-portal-heading">
                {row.label}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-portal-muted">
              {row.count}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
