export function printHtmlContent(title: string, bodyHtml: string) {
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;

  const safeTitle = title.replace(/</g, "&lt;");

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${safeTitle}</title>
        <style>
          @page { margin: 1.2cm; }
          body { font-family: "Segoe UI", system-ui, sans-serif; padding: 2rem; color: #03214F; max-width: 48rem; margin: 0 auto; }
          h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
          .meta { color: #71717a; font-size: 0.875rem; margin-bottom: 1.5rem; }
          .content { white-space: pre-wrap; line-height: 1.65; font-size: 0.9375rem; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${safeTitle}</h1>
        <p class="meta">Al Bayaan Academy · ${new Date().toLocaleString()}</p>
        <div class="content">${bodyHtml}</div>
        <p class="meta no-print" style="margin-top:2rem">Use your browser print dialog to save as PDF.</p>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
