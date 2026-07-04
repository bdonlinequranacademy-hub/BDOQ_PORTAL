export function formatCertificateDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCertificateDateBn(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return formatCertificateDate(iso);
  }
}

/** Single banner line — matches main_template ("English - Bengali"). */
export function formatCertificateCourseLine(
  courseNameEn: string,
  courseNameBn?: string | null
): string {
  const en = courseNameEn.trim();
  const bn = courseNameBn?.trim() ?? "";
  if (!bn) return en;
  return `${en} - ${bn}`;
}

/** Human-readable verify link for certificate footer (matches QR target). */
export function formatVerifyUrlLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, "");
    return `${parsed.host}${path}`;
  } catch {
    return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }
}