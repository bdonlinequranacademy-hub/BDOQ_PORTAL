export type CmsStatusFilter = "all" | "published" | "draft";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(values: string[]): string {
  return values.join("\n");
}

export function matchesCmsSearch(
  search: string,
  fields: Array<string | undefined>
): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

export function matchesCmsStatus(
  showOnWebsite: boolean,
  status: CmsStatusFilter
): boolean {
  if (status === "all") return true;
  if (status === "published") return showOnWebsite;
  return !showOnWebsite;
}
