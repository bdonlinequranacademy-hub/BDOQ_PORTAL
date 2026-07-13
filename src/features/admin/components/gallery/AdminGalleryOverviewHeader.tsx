import { ExternalLink, Images } from "lucide-react";
import { env } from "@/config/env";

interface IAdminGalleryOverviewHeaderProps {
  editing: boolean;
}

export function AdminGalleryOverviewHeader({
  editing,
}: IAdminGalleryOverviewHeaderProps) {
  return (
    <div className="portal-card-islamic relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-48 rounded-full bg-primary/8 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Content Management
          </p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            <Images className="size-7 text-primary" aria-hidden />
            Gallery CMS
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-portal-muted">
            {editing
              ? "Update this gallery item, then save to refresh the public gallery."
              : "Upload photos, videos, and audio for the public gallery page."}{" "}
            <a
              href={`${env.publicSiteUrl}/gallery`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              /gallery
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
