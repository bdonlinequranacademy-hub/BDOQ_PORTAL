export function isImageUploadUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes(".pdf") || lower.includes("f_pdf")) return false;
  return (
    /\.(jpe?g|png|webp|gif|avif|bmp)(\?|#|$)/i.test(url) ||
    lower.includes("/image/upload/")
  );
}

export function toViewableUploadUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (isImageUploadUrl(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (!parsed.hostname.includes("res.cloudinary.com")) return trimmed;

    const path = parsed.pathname;
    const hasPdfExt = /\.pdf$/i.test(path);

    if (path.includes("/image/upload/") && hasPdfExt) {
      return trimmed;
    }

    if (path.includes("/raw/upload/")) {
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(trimmed)}`;
    }

    if (!/\.[a-z0-9]+$/i.test(path)) {
      parsed.pathname = `${path}.pdf`;
      return parsed.toString();
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}
