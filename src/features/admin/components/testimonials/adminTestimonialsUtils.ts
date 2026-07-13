import type { AdminTestimonial, TestimonialMediaType } from "@/types/models";

export type AdminTestimonialsTab = "all" | "published" | "pending" | "featured";
export type TestimonialsSort = "newest" | "oldest" | "rating" | "name";

export interface IAdminTestimonialsStats {
  total: number;
  published: number;
  pending: number;
  featured: number;
  avgRating: string;
  newThisMonth: number;
}

export interface IRatingDistributionRow {
  stars: number;
  count: number;
  percentage: number;
  color: string;
}

export interface IMediaTypeRow {
  type: TestimonialMediaType;
  label: string;
  count: number;
}

const RATING_COLORS: Record<number, string> = {
  5: "#32C991",
  4: "#2DD4BF",
  3: "#D4A853",
  2: "#F59E0B",
  1: "#EF4444",
};

export function pctOfTotal(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 100)}% of total`;
}

export function mediaTypeLabel(type: TestimonialMediaType): string {
  if (type === "audio") return "Audio";
  if (type === "video") return "Video";
  return "Text";
}

export function isPublished(item: AdminTestimonial): boolean {
  return item.showOnWebsite !== false;
}

export function isFeatured(item: AdminTestimonial): boolean {
  return isPublished(item) && (item.rating ?? 0) >= 5;
}

export function computeTestimonialsStats(
  items: AdminTestimonial[]
): IAdminTestimonialsStats {
  const total = items.length;
  const published = items.filter(isPublished).length;
  const pending = items.filter((item) => !isPublished(item)).length;
  const featured = items.filter(isFeatured).length;
  const ratingSum = items.reduce((sum, item) => sum + (item.rating || 0), 0);
  const avgRating =
    total > 0 ? (ratingSum / total).toFixed(1) : "—";

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = items.filter((item) => {
    if (!item.createdAt) return false;
    return new Date(item.createdAt) >= monthStart;
  }).length;

  return { total, published, pending, featured, avgRating, newThisMonth };
}

export function getTabCounts(
  items: AdminTestimonial[]
): Record<AdminTestimonialsTab, number> {
  return {
    all: items.length,
    published: items.filter(isPublished).length,
    pending: items.filter((item) => !isPublished(item)).length,
    featured: items.filter(isFeatured).length,
  };
}

export function buildRatingDistribution(
  items: AdminTestimonial[]
): IRatingDistributionRow[] {
  const total = items.length;
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = items.filter((item) => Math.round(item.rating || 0) === stars).length;
    return {
      stars,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: RATING_COLORS[stars],
    };
  });
}

export function groupByMediaType(items: AdminTestimonial[]): IMediaTypeRow[] {
  const labels: Record<TestimonialMediaType, string> = {
    text: "Text reviews",
    audio: "Audio reviews",
    video: "Video reviews",
  };
  return (["text", "audio", "video"] as TestimonialMediaType[]).map((type) => ({
    type,
    label: labels[type],
    count: items.filter((item) => (item.mediaType ?? "text") === type).length,
  }));
}

export function getTopRatedReviews(
  items: AdminTestimonial[],
  limit = 5
): AdminTestimonial[] {
  return [...items]
    .filter(isPublished)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function filterTestimonials(
  items: AdminTestimonial[],
  options: {
    tab: AdminTestimonialsTab;
    search: string;
    mediaType: TestimonialMediaType | "";
    ratingFilter: number | "";
    statusFilter: "published" | "pending" | "";
    dateFrom: string;
    dateTo: string;
    sortBy: TestimonialsSort;
  }
): AdminTestimonial[] {
  const query = options.search.trim().toLowerCase();

  return items
    .filter((item) => {
      if (options.tab === "published" && !isPublished(item)) return false;
      if (options.tab === "pending" && isPublished(item)) return false;
      if (options.tab === "featured" && !isFeatured(item)) return false;

      if (options.mediaType && (item.mediaType ?? "text") !== options.mediaType) {
        return false;
      }
      if (options.ratingFilter && Math.round(item.rating || 0) !== options.ratingFilter) {
        return false;
      }
      if (options.statusFilter === "published" && !isPublished(item)) return false;
      if (options.statusFilter === "pending" && isPublished(item)) return false;

      if (query) {
        const haystack = `${item.name} ${item.location} ${item.role} ${item.content}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      const created = item.createdAt ? new Date(item.createdAt) : null;
      if (options.dateFrom && created && created < new Date(`${options.dateFrom}T00:00:00`)) {
        return false;
      }
      if (options.dateTo && created && created > new Date(`${options.dateTo}T23:59:59`)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (options.sortBy === "name") return a.name.localeCompare(b.name);
      if (options.sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return options.sortBy === "oldest" ? aTime - bTime : bTime - aTime;
    });
}

export function exportTestimonialsFile(items: AdminTestimonial[]): void {
  const headers = [
    "Name",
    "Role",
    "Location",
    "Rating",
    "Type",
    "Status",
    "Content",
    "Created",
  ];
  const rows = items.map((item) => [
    item.name,
    item.role,
    item.location,
    String(item.rating ?? ""),
    item.mediaType ?? "text",
    isPublished(item) ? "Published" : "Pending",
    item.content.replace(/\n/g, " "),
    item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : "",
  ]);

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bdoq-reviews-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
