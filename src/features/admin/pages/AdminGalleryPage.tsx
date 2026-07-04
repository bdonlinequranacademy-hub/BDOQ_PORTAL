import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  ImageIcon,
  Mic,
  Pencil,
  Plus,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import {
  useAdminGalleryItems,
  useDeleteGalleryItem,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { env } from "@/config/env";
import type { GalleryAlbumType, GalleryMediaType } from "@/types/models";

const ALBUM_LABELS: Record<GalleryAlbumType, string> = {
  "gallery-01": "Gallery 01",
  "gallery-02": "Gallery 02",
  "gallery-03": "Gallery 03",
};

const mediaMeta: Record<
  GalleryMediaType,
  { label: string; icon: typeof ImageIcon; className: string }
> = {
  photo: {
    label: "Photo",
    icon: ImageIcon,
    className: "bg-emerald-50 text-emerald-700",
  },
  video: {
    label: "Video",
    icon: Video,
    className: "bg-violet-50 text-violet-700",
  },
  audio: {
    label: "Audio",
    icon: Mic,
    className: "bg-sky-50 text-sky-700",
  },
};

type MediaFilter = "all" | GalleryMediaType;
type AlbumFilter = "all" | GalleryAlbumType;

function GalleryPreview({
  item,
}: {
  item: {
    mediaType: GalleryMediaType;
    mediaUrl?: string;
    youtubeId?: string;
    coverGradient: string;
    title: string;
  };
}) {
  if (item.mediaType === "photo" && item.mediaUrl) {
    return (
      <img
        src={item.mediaUrl}
        alt={item.title}
        className="h-full w-full object-cover"
      />
    );
  }

  if (item.mediaType === "video" && item.youtubeId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
        alt={item.title}
        className="h-full w-full object-cover"
      />
    );
  }

  if (item.mediaType === "video" && item.mediaUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-white">
        <Video className="size-10 opacity-80" aria-hidden />
      </div>
    );
  }

  if (item.mediaType === "audio") {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${item.coverGradient} text-white`}
      >
        <Mic className="size-10 opacity-90" aria-hidden />
        <span className="mt-2 text-xs font-medium opacity-90">Audio</span>
      </div>
    );
  }

  return (
    <div
      className={`h-full w-full bg-gradient-to-br ${item.coverGradient}`}
      aria-hidden
    />
  );
}

export function AdminGalleryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [albumFilter, setAlbumFilter] = useState<AlbumFilter>("all");
  const { data: items = [], isLoading } = useAdminGalleryItems();
  const deleteItem = useDeleteGalleryItem();

  const stats = useMemo(
    () => ({
      total: items.length,
      photo: items.filter((i) => i.mediaType === "photo").length,
      video: items.filter((i) => i.mediaType === "video").length,
      audio: items.filter((i) => i.mediaType === "audio").length,
      published: items.filter((i) => i.showOnWebsite).length,
    }),
    [items]
  );

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesMedia =
      mediaFilter === "all" || item.mediaType === mediaFilter;
    const matchesAlbum =
      albumFilter === "all" || item.album === albumFilter;
    return matchesSearch && matchesMedia && matchesAlbum;
  });

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading gallery…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Gallery CMS</h1>
          <p className="text-sm text-zinc-500">
            Manage photos, videos, and audio for the public{" "}
            <a
              href={`${env.publicSiteUrl}/gallery`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              /gallery
              <ExternalLink className="size-3.5" aria-hidden />
            </a>{" "}
            page
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/gallery/new")}
          className="gap-2 rounded-xl bg-primary-dark text-white"
        >
          <Plus className="size-4" />
          Add gallery item
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total items", value: stats.total },
          { label: "Photos", value: stats.photo },
          { label: "Videos", value: stats.video },
          { label: "Audio", value: stats.audio },
          { label: "Published", value: stats.published },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="rounded-2xl border-0 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-primary-dark">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className={`${formControlClass} py-3 pl-10`}
            placeholder="Search by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "photo", "video", "audio"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMediaFilter(type)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mediaFilter === type
                  ? "bg-primary-dark text-white"
                  : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {type === "all" ? "All media" : mediaMeta[type].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "gallery-01", "gallery-02", "gallery-03"] as const).map(
          (album) => (
            <button
              key={album}
              type="button"
              onClick={() => setAlbumFilter(album)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                albumFilter === album
                  ? "bg-teal-700 text-white"
                  : "bg-teal-50 text-teal-800 hover:bg-teal-100"
              }`}
            >
              {album === "all" ? "All albums" : ALBUM_LABELS[album]}
            </button>
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-2xl border-0 p-10 text-center shadow-sm">
          <ImageIcon className="mx-auto size-10 text-zinc-300" aria-hidden />
          <p className="mt-3 font-medium text-zinc-600">No gallery items yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            Upload photos, videos, or audio clips for the public gallery page.
          </p>
          <Button
            onClick={() => navigate("/admin/gallery/new")}
            className="mt-4 gap-2 rounded-xl bg-primary-dark text-white"
          >
            <Plus className="size-4" />
            Create first item
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const meta = mediaMeta[item.mediaType];
            const Icon = meta.icon;
            return (
              <Card
                key={item.id}
                className="overflow-hidden rounded-2xl border-0 shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                  <GalleryPreview item={item} />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
                    >
                      <Icon className="size-3.5" aria-hidden />
                      {meta.label}
                    </span>
                    {!item.showOnWebsite && (
                      <span className="rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-semibold text-white">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-semibold text-primary-dark line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {ALBUM_LABELS[item.album]} · Order {item.sortOrder}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-sm text-zinc-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 gap-2 rounded-xl"
                      onClick={() => navigate(`/admin/gallery/${item.id}/edit`)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="rounded-xl px-4"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete "${item.title}" from the gallery?`
                          )
                        ) {
                          deleteItem.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
