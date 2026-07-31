import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ExternalLink,
  Plus,
  Settings,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { env } from "@/config/env";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminResourcesQuickActionsProps {
  onAdd: () => void;
}

const rowClass =
  "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-portal-muted/30";

export function AdminResourcesQuickActions({
  onAdd,
}: IAdminResourcesQuickActionsProps) {
  const { t } = usePortalTranslation();
  const navigate = useNavigate();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-3 text-sm font-bold text-portal-heading">
        {t("admin.cms.shared.quickActions")}
      </h2>
      <div className="flex flex-col">
        <button type="button" onClick={onAdd} className={rowClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="size-4 text-primary" aria-hidden />
          </span>
          <span className="flex-1 text-sm font-semibold text-portal-heading">
            {t("admin.cms.resources.addNewResource")}
          </span>
          <ChevronRight className="size-4 text-portal-muted" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/resources/new?type=ebook")}
          className={rowClass}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-violet-100">
            <Upload className="size-4 text-violet-600" aria-hidden />
          </span>
          <span className="flex-1 text-sm font-semibold text-portal-heading">
            {t("admin.cms.resources.uploadPdfMedia")}
          </span>
          <ChevronRight className="size-4 text-portal-muted" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/resources/new?type=audio")}
          className={rowClass}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-sky-100">
            <Settings className="size-4 text-sky-600" aria-hidden />
          </span>
          <span className="flex-1 text-sm font-semibold text-portal-heading">
            {t("admin.cms.resources.resourceSettings")}
          </span>
          <ChevronRight className="size-4 text-portal-muted" aria-hidden />
        </button>

        <a
          href={`${env.publicSiteUrl}/resources/ebooks`}
          target="_blank"
          rel="noopener noreferrer"
          className={rowClass}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-100">
            <ExternalLink className="size-4 text-emerald-700" aria-hidden />
          </span>
          <span className="flex-1 text-sm font-semibold text-portal-heading">
            {t("admin.cms.shared.viewPublicPage")}
          </span>
          <ChevronRight className="size-4 text-portal-muted" aria-hidden />
        </a>
      </div>
    </Card>
  );
}
