import type { AdminBlogPost, BlogCategory, BlogPostStatus } from "@/types/models";
import type { PortalTranslate } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

export type AdminBlogTab = "all" | "published" | "draft" | "featured";

export type BlogSort = "newest" | "oldest" | "title_asc" | "title_desc";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Quran & Tajweed",
  "Parent Guides",
  "Learning Tips",
  "Platform & AI",
];

const PUBLIC_BLOG_CATEGORIES: BlogCategory[] = [
  "Quran & Tajweed",
  "Parent Guides",
  "Learning Tips",
];

const EXCLUDED_PUBLIC_TAGS = new Set([
  "payment",
  "bkash",
  "nagad",
  "billing",
  "invoice",
  "fees",
  "paypal",
  "wise",
  "portal",
]);

export interface IAdminBlogStats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
  upcoming: number;
  publicVisible: number;
  newThisMonth: number;
  publishedDelta: number | null;
}

export interface IBlogCategoryRow {
  category: BlogCategory;
  count: number;
  color: string;
  iconKey: "quran" | "parents" | "tips" | "platform";
}

const CATEGORY_META: Record<
  BlogCategory,
  { color: string; iconKey: IBlogCategoryRow["iconKey"] }
> = {
  "Quran & Tajweed": { color: "#32C991", iconKey: "quran" },
  "Parent Guides": { color: "#3B82F6", iconKey: "parents" },
  "Learning Tips": { color: "#F59E0B", iconKey: "tips" },
  "Platform & AI": { color: "#8B5CF6", iconKey: "platform" },
};

export function categoryBadgeStyles(category: BlogCategory): string {
  switch (category) {
    case "Quran & Tajweed":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    case "Parent Guides":
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
    case "Learning Tips":
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
    default:
      return "border-violet-500/35 bg-violet-500/10 text-violet-800";
  }
}

export function blogStatusDotClass(status: BlogPostStatus): string {
  return status === "published" ? "bg-emerald-500" : "bg-zinc-400";
}

export function isPublicVisiblePost(post: AdminBlogPost): boolean {
  if (post.status !== "published") return false;
  if (!PUBLIC_BLOG_CATEGORIES.includes(post.category)) return false;

  const tags = post.tags.map((tag) => tag.toLowerCase());
  if (tags.some((tag) => EXCLUDED_PUBLIC_TAGS.has(tag))) return false;

  const slug = post.slug.toLowerCase();
  if (slug.includes("payment") || slug.includes("bkash")) return false;

  return true;
}

export function isUpcomingPost(post: AdminBlogPost): boolean {
  const pub = new Date(post.pubDate);
  return pub.getTime() > Date.now();
}

export function formatBlogDate(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function pctOfTotal(part: number, total: number, t: PortalTranslate): string {
  if (total <= 0) return t("stats.zeroOfTotal");
  const pctValue = Math.round((part / total) * 1000) / 10;
  return t("stats.ofTotal", { pct: String(pctValue) });
}

function isInMonth(dateIso: string | undefined, year: number, month: number): boolean {
  if (!dateIso) return false;
  const date = new Date(dateIso);
  return date.getFullYear() === year && date.getMonth() === month;
}

function isInDateRange(dateIso: string, dateFrom: string, dateTo: string): boolean {
  const time = new Date(dateIso).getTime();
  if (dateFrom && time < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
  if (dateTo && time > new Date(`${dateTo}T23:59:59`).getTime()) return false;
  return true;
}

export function computeBlogStats(posts: AdminBlogPost[]): IAdminBlogStats {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const published = posts.filter((post) => post.status === "published");
  const drafts = posts.filter((post) => post.status === "draft");
  const featured = posts.filter((post) => post.featured);
  const upcoming = posts.filter(isUpcomingPost);
  const publicVisible = posts.filter(isPublicVisiblePost);

  const thisMonthPublished = published.filter((post) =>
    isInMonth(post.pubDate, thisYear, thisMonth)
  );
  const prevMonthPublished = published.filter((post) =>
    isInMonth(post.pubDate, prevYear, prevMonth)
  );

  const newThisMonth = posts.filter(
    (post) => isInMonth(post.createdAt, thisYear, thisMonth) || isInMonth(post.updatedAt, thisYear, thisMonth)
  ).length;

  const publishedDelta =
    prevMonthPublished.length > 0
      ? Math.round(
          ((thisMonthPublished.length - prevMonthPublished.length) / prevMonthPublished.length) *
            1000
        ) / 10
      : thisMonthPublished.length > 0
        ? 100
        : null;

  return {
    total: posts.length,
    published: published.length,
    drafts: drafts.length,
    featured: featured.length,
    upcoming: upcoming.length,
    publicVisible: publicVisible.length,
    newThisMonth,
    publishedDelta,
  };
}

export function groupBlogByCategory(posts: AdminBlogPost[]): IBlogCategoryRow[] {
  return BLOG_CATEGORIES.map((category) => ({
    category,
    count: posts.filter((post) => post.category === category).length,
    color: CATEGORY_META[category].color,
    iconKey: CATEGORY_META[category].iconKey,
  }));
}

export function extractAuthorOptions(posts: AdminBlogPost[]): string[] {
  const names = new Set<string>();
  for (const post of posts) {
    if (post.author?.name) names.add(post.author.name);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export function filterBlogPosts(
  posts: AdminBlogPost[],
  options: {
    tab: AdminBlogTab;
    search: string;
    categoryFilter: BlogCategory | "";
    authorFilter: string;
    statusFilter: BlogPostStatus | "";
    dateFrom: string;
    dateTo: string;
    sortBy: BlogSort;
  }
): AdminBlogPost[] {
  const query = options.search.trim().toLowerCase();

  const filtered = posts.filter((post) => {
    if (options.tab === "published" && post.status !== "published") return false;
    if (options.tab === "draft" && post.status !== "draft") return false;
    if (options.tab === "featured" && !post.featured) return false;
    if (options.categoryFilter && post.category !== options.categoryFilter) return false;
    if (options.authorFilter && post.author?.name !== options.authorFilter) return false;
    if (options.statusFilter && post.status !== options.statusFilter) return false;
    if (!isInDateRange(post.pubDate, options.dateFrom, options.dateTo)) return false;

    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.author?.name?.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  return sortBlogPosts(filtered, options.sortBy);
}

function sortBlogPosts(posts: AdminBlogPost[], sortBy: BlogSort): AdminBlogPost[] {
  const sorted = [...posts];
  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
      );
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );
  }
}

export function getRecentPosts(posts: AdminBlogPost[], limit = 4): AdminBlogPost[] {
  return [...posts]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}

export function getTabCounts(posts: AdminBlogPost[]): Record<AdminBlogTab, number> {
  return {
    all: posts.length,
    published: posts.filter((post) => post.status === "published").length,
    draft: posts.filter((post) => post.status === "draft").length,
    featured: posts.filter((post) => post.featured).length,
  };
}

export function exportBlogFile(posts: AdminBlogPost[]): void {
  const header = [
    "Title",
    "Slug",
    "Category",
    "Status",
    "Author",
    "Published On",
    "Featured",
    "Read Minutes",
  ];

  const rows = posts.map((post) => [
    post.title,
    post.slug,
    post.category,
    post.status,
    post.author?.name ?? "",
    post.pubDate,
    post.featured ? "yes" : "no",
    String(post.readMinutes ?? ""),
  ]);

  const csv = [header, ...rows]
    .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `blog-posts-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function blogThumbnailGradient(category: BlogCategory): string {
  const color = CATEGORY_META[category].color;
  return `linear-gradient(135deg, ${color}33 0%, ${color}88 100%)`;
}
