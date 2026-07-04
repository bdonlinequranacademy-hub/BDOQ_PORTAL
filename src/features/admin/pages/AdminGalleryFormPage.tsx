import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageIcon, Mic, Upload, Video } from "lucide-react";
import {
  useAdminGalleryItem,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useUploadResourceFile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import { formControlClass } from "@/lib/formControl";
import type { GalleryAlbumType, GalleryMediaType } from "@/types/models";

const MEDIA_TYPES: GalleryMediaType[] = ["photo", "video", "audio"];

const ALBUMS: { id: GalleryAlbumType; label: string }[] = [
  { id: "gallery-01", label: "Gallery 01" },
  { id: "gallery-02", label: "Gallery 02" },
  { id: "gallery-03", label: "Gallery 03" },
];

const GRADIENT_PRESETS = [
  { label: "Green Teal", value: "from-primary to-teal" },
  { label: "Deep Green", value: "from-primary-dark to-primary" },
  { label: "Teal Night", value: "from-teal to-primary-dark" },
  { label: "Gold Green", value: "from-gold/70 to-primary-dark" },
  { label: "Green Gold", value: "from-primary to-gold/60" },
  { label: "Teal Accent", value: "from-teal-accent/60 to-primary" },
];

const HEIGHT_OPTIONS = [
  { label: "Short", value: "h-48" },
  { label: "Medium", value: "h-56" },
  { label: "Tall", value: "h-64" },
  { label: "Extra tall", value: "h-72" },
];

export function AdminGalleryFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminGalleryItem(isEdit ? id! : "");
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem(id ?? "");
  const uploadFile = useUploadResourceFile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [album, setAlbum] = useState<GalleryAlbumType>("gallery-01");
  const [mediaType, setMediaType] = useState<GalleryMediaType>("photo");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaPublicId, setMediaPublicId] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [videoSource, setVideoSource] = useState<"upload" | "youtube">(
    "youtube"
  );
  const [coverGradient, setCoverGradient] = useState("from-primary to-teal");
  const [heightClass, setHeightClass] = useState("h-56");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setDescription(existing.description ?? "");
    setAlbum(existing.album);
    setMediaType(existing.mediaType);
    setMediaUrl(existing.mediaUrl ?? "");
    setMediaPublicId(existing.mediaPublicId ?? "");
    setYoutubeId(existing.youtubeId ?? "");
    setVideoSource(existing.youtubeId ? "youtube" : "upload");
    setCoverGradient(existing.coverGradient);
    setHeightClass(existing.heightClass);
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
  }, [existing]);

  async function handleFileUpload(file: File): Promise<void> {
    setUploading(true);
    try {
      const res = await uploadFile.mutateAsync({ file, purpose: "gallery" });
      if (res.success && res.data?.url) {
        setMediaUrl(res.data.url);
        setMediaPublicId(res.data.publicId ?? "");
        if (file.type.startsWith("image/")) setMediaType("photo");
        else if (file.type.startsWith("audio/")) setMediaType("audio");
        else if (file.type.startsWith("video/")) setMediaType("video");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const payload = {
      title,
      description: description || undefined,
      album,
      mediaType,
      mediaUrl:
        mediaType === "video" && videoSource === "youtube"
          ? undefined
          : mediaUrl || undefined,
      mediaPublicId: mediaPublicId || undefined,
      youtubeId:
        mediaType === "video" && videoSource === "youtube"
          ? youtubeId || undefined
          : undefined,
      coverGradient,
      heightClass,
      sortOrder: Number(sortOrder) || 0,
      showOnWebsite,
    };

    if (isEdit) {
      await updateItem.mutateAsync(payload);
    } else {
      await createItem.mutateAsync(payload);
    }
    navigate("/admin/gallery");
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading gallery item…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-5xl">
      <button
        type="button"
        onClick={() => navigate("/admin/gallery")}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-primary-dark"
      >
        <ArrowLeft className="size-4" />
        Back to gallery
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">
          {isEdit ? "Edit gallery item" : "New gallery item"}
        </h1>
        <p className="text-sm text-zinc-500">
          Upload a photo, video, or audio clip for the public gallery page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-0 p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Media type
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {MEDIA_TYPES.map((type) => {
                const icons = {
                  photo: ImageIcon,
                  video: Video,
                  audio: Mic,
                } as const;
                const Icon = icons[type];
                const active = mediaType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMediaType(type)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-zinc-200 hover:border-primary/30"
                    }`}
                  >
                    <Icon
                      className={`size-6 ${active ? "text-primary" : "text-zinc-400"}`}
                      aria-hidden
                    />
                    <p className="mt-2 font-semibold capitalize text-primary-dark">
                      {type}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-2xl border-0 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Upload media
            </h2>

            {mediaType === "video" && (
              <div className="flex flex-wrap gap-2">
                {(["youtube", "upload"] as const).map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setVideoSource(source)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      videoSource === source
                        ? "bg-primary-dark text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {source === "youtube" ? "YouTube link" : "Upload video"}
                  </button>
                ))}
              </div>
            )}

            {mediaType === "video" && videoSource === "youtube" ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  YouTube video ID
                </label>
                <input
                  className={formControlClass}
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="uu0FOZZtz_M"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Paste the ID from youtube.com/watch?v=<strong>ID</strong>
                </p>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  {mediaType === "photo"
                    ? "Photo file"
                    : mediaType === "audio"
                      ? "Audio file (MP3)"
                      : "Video file (MP4)"}
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 transition-colors hover:border-primary/40 hover:bg-primary/5">
                  <Upload className="size-8 text-primary" aria-hidden />
                  <span className="mt-3 text-sm font-medium text-zinc-700">
                    {uploading ? "Uploading…" : "Click to upload"}
                  </span>
                  <span className="mt-1 text-xs text-zinc-500">
                    Max 15 MB · Cloudinary storage
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept={
                      mediaType === "photo"
                        ? "image/*"
                        : mediaType === "audio"
                          ? "audio/*"
                          : "video/*"
                    }
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFileUpload(file);
                    }}
                  />
                </label>
                {mediaUrl && (
                  <p className="mt-2 truncate text-xs text-emerald-700">
                    Uploaded: {mediaUrl}
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card className="rounded-2xl border-0 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Details
            </h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Title *
              </label>
              <input
                className={formControlClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Description
              </label>
              <textarea
                className={`${formControlClass} min-h-24`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Album
                </label>
                <select
                  className={formControlClass}
                  value={album}
                  onChange={(e) => setAlbum(e.target.value as GalleryAlbumType)}
                >
                  {ALBUMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Sort order
                </label>
                <input
                  type="number"
                  className={formControlClass}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={showOnWebsite}
                onChange={(e) => setShowOnWebsite(e.target.checked)}
                className="size-4 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700">
                Show on public website
              </span>
            </label>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-0 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Placeholder style
            </h2>
            <p className="text-xs text-zinc-500">
              Used when no media is uploaded yet, or as the audio card background.
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Gradient
              </label>
              <select
                className={formControlClass}
                value={coverGradient}
                onChange={(e) => setCoverGradient(e.target.value)}
              >
                {GRADIENT_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Card height
              </label>
              <select
                className={formControlClass}
                value={heightClass}
                onChange={(e) => setHeightClass(e.target.value)}
              >
                {HEIGHT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`overflow-hidden rounded-2xl bg-gradient-to-br ${coverGradient} ${heightClass}`}
              aria-hidden
            />
          </Card>

          <Card className="rounded-2xl border-0 p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Preview
            </h2>
            {mediaType === "photo" && mediaUrl ? (
              <img
                src={mediaUrl}
                alt={title || "Preview"}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            ) : mediaType === "video" && videoSource === "youtube" && youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                alt={title || "Preview"}
                className="aspect-video w-full rounded-2xl object-cover"
              />
            ) : mediaType === "audio" ? (
              <div
                className={`flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br ${coverGradient}`}
              >
                <Mic className="size-12 text-white/90" aria-hidden />
              </div>
            ) : mediaUrl ? (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-zinc-900 text-white">
                <Video className="size-12" aria-hidden />
              </div>
            ) : (
              <div
                className={`rounded-2xl bg-gradient-to-br ${coverGradient} ${heightClass}`}
              />
            )}
            <p className="mt-3 font-semibold text-primary-dark">
              {title || "Gallery item title"}
            </p>
          </Card>

          <Button
            type="submit"
            disabled={createItem.isPending || updateItem.isPending || !title.trim()}
            className="w-full rounded-xl bg-primary-dark py-3 text-white"
          >
            {isEdit ? "Save changes" : "Publish gallery item"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
