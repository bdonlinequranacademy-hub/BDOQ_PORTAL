import { ExternalLink, Printer } from "lucide-react";

interface IAdminImageDocumentCardProps {
  label: string;
  url: string;
  imageUrl?: string;
  openLabel: string;
  printLabel: string;
}

function printImage(url: string, title: string): void {
  const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!popup) return;

  popup.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      html, body { margin: 0; background: #fff; }
      body { display: flex; min-height: 100vh; align-items: center; justify-content: center; }
      img { max-width: 100%; max-height: 100vh; object-fit: contain; }
    </style>
  </head>
  <body>
    <img src="${url}" alt="${title}" onload="window.focus(); window.print();" />
  </body>
</html>`);
  popup.document.close();
}

export function AdminImageDocumentCard({
  label,
  url,
  imageUrl,
  openLabel,
  printLabel,
}: IAdminImageDocumentCardProps) {
  const previewUrl = imageUrl ?? url;

  return (
    <article className="overflow-hidden rounded-2xl border border-portal bg-portal-muted/20">
      <div className="flex items-center justify-between gap-2 border-b border-portal px-3 py-2">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
          {label}
        </h5>
        <div className="flex items-center gap-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-portal-heading transition hover:bg-white hover:text-primary"
          >
            {openLabel}
            <ExternalLink className="size-3" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => printImage(previewUrl, label)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-portal-heading transition hover:bg-white hover:text-primary"
          >
            {printLabel}
            <Printer className="size-3" aria-hidden />
          </button>
        </div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-white p-2">
        <img
          src={previewUrl}
          alt={label}
          className="mx-auto max-h-64 w-full object-contain"
        />
      </a>
    </article>
  );
}
