import type {
  AdminGalleryItem,
  GalleryAlbumType,
  GalleryMediaType,
} from "@/types/models";

export const GALLERY_ALBUM_OPTIONS: { id: GalleryAlbumType; label: string }[] = [
  { id: "gallery-01", label: "Gallery 01" },
  { id: "gallery-02", label: "Gallery 02" },
  { id: "gallery-03", label: "Gallery 03" },
];

export const GALLERY_ALBUM_LABELS: Record<GalleryAlbumType, string> = {
  "gallery-01": "Gallery 01",
  "gallery-02": "Gallery 02",
  "gallery-03": "Gallery 03",
};

export const GALLERY_GRADIENT_PRESETS = [
  { label: "Green Teal", value: "from-primary to-teal" },
  { label: "Deep Green", value: "from-primary-dark to-primary" },
  { label: "Teal Night", value: "from-teal to-primary-dark" },
  { label: "Gold Green", value: "from-gold/70 to-primary-dark" },
  { label: "Green Gold", value: "from-primary to-gold/60" },
  { label: "Teal Accent", value: "from-teal-accent/60 to-primary" },
];

export const GALLERY_HEIGHT_OPTIONS = [
  { label: "Short", value: "h-48" },
  { label: "Medium", value: "h-56" },
  { label: "Tall", value: "h-64" },
  { label: "Extra tall", value: "h-72" },
];

export type GalleryListStyle = "grid" | "list" | "carousel";

export interface IAdminGalleryStats {
  total: number;
  photo: number;
  video: number;
  audio: number;
  published: number;
  newThisMonth: number;
}

export interface IGalleryFormState {
  title: string;
  description: string;
  album: GalleryAlbumType;
  mediaType: GalleryMediaType;
  mediaUrl: string;
  mediaPublicId: string;
  youtubeId: string;
  videoSource: "upload" | "youtube";
  coverGradient: string;
  heightClass: string;
  sortOrder: string;
  showOnWebsite: boolean;
}

export const EMPTY_GALLERY_FORM: IGalleryFormState = {
  title: "",
  description: "",
  album: "gallery-01",
  mediaType: "photo",
  mediaUrl: "",
  mediaPublicId: "",
  youtubeId: "",
  videoSource: "youtube",
  coverGradient: "from-primary to-teal",
  heightClass: "h-56",
  sortOrder: "0",
  showOnWebsite: true,
};

export function formStateFromItem(item: AdminGalleryItem): IGalleryFormState {
  return {
    title: item.title,
    description: item.description ?? "",
    album: item.album,
    mediaType: item.mediaType,
    mediaUrl: item.mediaUrl ?? "",
    mediaPublicId: item.mediaPublicId ?? "",
    youtubeId: item.youtubeId ?? "",
    videoSource: item.youtubeId ? "youtube" : "upload",
    coverGradient: item.coverGradient,
    heightClass: item.heightClass,
    sortOrder: String(item.sortOrder),
    showOnWebsite: item.showOnWebsite,
  };
}

export function computeGalleryStats(items: AdminGalleryItem[]): IAdminGalleryStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return {
    total: items.length,
    photo: items.filter((i) => i.mediaType === "photo").length,
    video: items.filter((i) => i.mediaType === "video").length,
    audio: items.filter((i) => i.mediaType === "audio").length,
    published: items.filter((i) => i.showOnWebsite).length,
    newThisMonth: items.filter((i) => {
      if (!i.createdAt) return false;
      const d = new Date(i.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length,
  };
}

export function pctOfTotal(part: number, total: number): string {
  if (total <= 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

export function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }
    const v = url.searchParams.get("v");
    if (v) return v.slice(0, 11);
  } catch {
    /* plain id */
  }
  return trimmed;
}

export function formatGalleryDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function buildGalleryPayload(form: IGalleryFormState) {
  const youtubeId =
    form.mediaType === "video" && form.videoSource === "youtube"
      ? extractYoutubeId(form.youtubeId) || undefined
      : undefined;

  return {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    album: form.album,
    mediaType: form.mediaType,
    mediaUrl:
      form.mediaType === "video" && form.videoSource === "youtube"
        ? undefined
        : form.mediaUrl.trim() || undefined,
    mediaPublicId: form.mediaPublicId.trim() || undefined,
    youtubeId,
    coverGradient: form.coverGradient,
    heightClass: form.heightClass,
    sortOrder: Number(form.sortOrder) || 0,
    showOnWebsite: form.showOnWebsite,
  };
}

export function canSubmitGalleryForm(form: IGalleryFormState): boolean {
  if (!form.title.trim()) return false;
  if (form.mediaType === "video" && form.videoSource === "youtube") {
    return extractYoutubeId(form.youtubeId).length === 11;
  }
  if (form.mediaType === "photo" || form.mediaType === "audio") {
    return form.mediaUrl.trim().length > 0;
  }
  return form.mediaUrl.trim().length > 0;
}
