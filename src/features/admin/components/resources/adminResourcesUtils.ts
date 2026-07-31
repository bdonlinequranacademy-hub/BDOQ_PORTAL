import type {
  AdminResource,
  EbookCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/models";

export type ResourcesTab =
  | "all"
  | "ebook"
  | "audio"
  | "video"
  | "featured"
  | "published"
  | "draft";

export type ResourcesSort =
  | "newest"
  | "oldest"
  | "title"
  | "sort-order"
  | "status";

export interface IAdminResourcesStats {
  total: number;
  ebook: number;
  audio: number;
  video: number;
  published: number;
  draft: number;
  featured: number;
  withFile: number;
  newThisMonth: number;
}

export interface IResourceCategoryRow {
  key: string;
  label: string;
  count: number;
  filter:
    | { kind: "type"; value: ResourceType }
    | { kind: "category"; value: EbookCategory }
    | { kind: "featured" };
}

export const EBOOK_CATEGORY_LABELS: Record<EbookCategory, string> = {
  tajweed: "Tajweed",
  "islamic-history": "Islamic History",
  religious: "Religious Book",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  ebook: "E-book",
  audio: "Audio",
  video: "Video",
};

export function publicResourcePath(type: ResourceType): string {
  switch (type) {
    case "ebook":
      return "/resources/ebooks";
    case "audio":
      return "/resources/audio";
    case "video":
      return "/resources/videos";
  }
}

export type PortalTranslate = (key: string, params?: Record<string, string>) => string;

export function pctOfTotal(part: number, total: number, t: PortalTranslate): string {
  if (total <= 0) return t("stats.zeroOfTotal");
  const pctValue = Math.round((part / total) * 1000) / 10;
  return t("stats.ofTotal", { pct: String(pctValue) });
}

export function computeResourcesStats(
  items: AdminResource[]
): IAdminResourcesStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return {
    total: items.length,
    ebook: items.filter((i) => i.type === "ebook").length,
    audio: items.filter((i) => i.type === "audio").length,
    video: items.filter((i) => i.type === "video").length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
    featured: items.filter((i) => i.featured).length,
    withFile: items.filter(
      (i) => Boolean(i.pdfUrl || i.audioUrl || i.coverUrl || i.youtubeId)
    ).length,
    newThisMonth: items.filter((i) => {
      if (!i.createdAt) return false;
      const d = new Date(i.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length,
  };
}

export function getTabCounts(items: AdminResource[]): Record<ResourcesTab, number> {
  return {
    all: items.length,
    ebook: items.filter((i) => i.type === "ebook").length,
    audio: items.filter((i) => i.type === "audio").length,
    video: items.filter((i) => i.type === "video").length,
    featured: items.filter((i) => i.featured).length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
  };
}

export function buildCategoryRows(items: AdminResource[]): IResourceCategoryRow[] {
  const rows: IResourceCategoryRow[] = [
    {
      key: "ebook",
      label: "E-books",
      count: items.filter((i) => i.type === "ebook").length,
      filter: { kind: "type", value: "ebook" },
    },
    {
      key: "audio",
      label: "Audio Recitation",
      count: items.filter((i) => i.type === "audio").length,
      filter: { kind: "type", value: "audio" },
    },
    {
      key: "video",
      label: "Video Lessons",
      count: items.filter((i) => i.type === "video").length,
      filter: { kind: "type", value: "video" },
    },
    {
      key: "featured",
      label: "Featured",
      count: items.filter((i) => i.featured).length,
      filter: { kind: "featured" },
    },
  ];

  (Object.keys(EBOOK_CATEGORY_LABELS) as EbookCategory[]).forEach((cat) => {
    rows.push({
      key: cat,
      label: EBOOK_CATEGORY_LABELS[cat],
      count: items.filter((i) => i.type === "ebook" && i.category === cat).length,
      filter: { kind: "category", value: cat },
    });
  });

  return rows.filter((row) => row.count > 0 || row.key === "ebook" || row.key === "audio" || row.key === "video");
}

export function filterResources(
  items: AdminResource[],
  opts: {
    tab: ResourcesTab;
    search: string;
    type: ResourceType | "";
    status: ResourceStatus | "";
    category: EbookCategory | "";
    featuredOnly: boolean;
    sortBy: ResourcesSort;
  }
): AdminResource[] {
  const q = opts.search.trim().toLowerCase();

  let list = items.filter((item) => {
    const matchesTab =
      opts.tab === "all" ||
      (opts.tab === "ebook" && item.type === "ebook") ||
      (opts.tab === "audio" && item.type === "audio") ||
      (opts.tab === "video" && item.type === "video") ||
      (opts.tab === "featured" && item.featured) ||
      (opts.tab === "published" && item.status === "published") ||
      (opts.tab === "draft" && item.status === "draft");

    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.description ?? "").toLowerCase().includes(q) ||
      (item.author ?? "").toLowerCase().includes(q);

    const matchesType = !opts.type || item.type === opts.type;
    const matchesStatus = !opts.status || item.status === opts.status;
    const matchesCategory =
      !opts.category ||
      (item.type === "ebook" && item.category === opts.category);
    const matchesFeatured = !opts.featuredOnly || item.featured;

    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesCategory &&
      matchesFeatured
    );
  });

  list = [...list].sort((a, b) => {
    switch (opts.sortBy) {
      case "oldest":
        return (
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      case "sort-order":
        return a.sortOrder - b.sortOrder;
      case "status":
        return a.status.localeCompare(b.status);
      case "newest":
      default:
        return (
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
        );
    }
  });

  return list;
}

export function formatResourceDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function resourceMetaLine(item: AdminResource): string {
  if (item.type === "ebook") {
    const parts = [
      item.fileSize ? `PDF · ${item.fileSize}` : "PDF",
      item.pageCount ? `${item.pageCount} pages` : null,
      item.language?.toUpperCase(),
    ].filter(Boolean);
    return parts.join(" · ");
  }
  if (item.type === "audio") {
    return [item.duration, item.surahName, item.paraInfo]
      .filter(Boolean)
      .join(" · ") || "Audio";
  }
  return item.youtubeId ? `YouTube · ${item.youtubeId}` : "Video";
}

export function exportResourcesFile(items: AdminResource[]): void {
  const header = [
    "Title",
    "Slug",
    "Type",
    "Section",
    "Status",
    "Featured",
    "Category",
    "Author",
    "Created",
  ];
  const rows = items.map((item) =>
    [
      item.title,
      item.slug,
      item.type,
      item.section,
      item.status,
      item.featured ? "Yes" : "No",
      item.category ?? "",
      item.author ?? "",
      item.createdAt ?? "",
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `boq-resources-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
