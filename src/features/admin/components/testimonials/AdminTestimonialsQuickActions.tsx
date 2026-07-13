import { useNavigate } from "react-router-dom";
import {
  Download,
  ExternalLink,
  Plus,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { env } from "@/config/env";

const actionTileClass =
  "flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 p-3.5 text-left transition hover:border-primary/25 hover:bg-primary/5";

interface IAdminTestimonialsQuickActionsProps {
  onExport: () => void;
}

export function AdminTestimonialsQuickActions({ onExport }: IAdminTestimonialsQuickActionsProps) {
  const navigate = useNavigate();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">Quick actions</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/admin/testimonials/new")}
          className={actionTileClass}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="size-4 text-primary" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">New review</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/testimonials/new")}
          className={actionTileClass}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-amber-100">
            <Settings className="size-4 text-amber-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">Review settings</span>
        </button>
        <button type="button" onClick={onExport} className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-violet-100">
            <Download className="size-4 text-violet-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">Export reviews</span>
        </button>
        <a
          href={`${env.publicSiteUrl}/reviews`}
          target="_blank"
          rel="noopener noreferrer"
          className={actionTileClass}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-100">
            <ExternalLink className="size-4 text-blue-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">View on website</span>
        </a>
      </div>
    </Card>
  );
}
