import { ImageIcon, Mic, Upload, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { GalleryMediaType } from "@/types/models";
import type { IGalleryFormState } from "@/features/admin/components/gallery/adminGalleryUtils";
import { GALLERY_ALBUM_OPTIONS } from "@/features/admin/components/gallery/adminGalleryUtils";

const MEDIA_OPTIONS: {
  type: GalleryMediaType;
  label: string;
  icon: typeof ImageIcon;
}[] = [
  { type: "photo", label: "Photo", icon: ImageIcon },
  { type: "video", label: "Video", icon: Video },
  { type: "audio", label: "Audio", icon: Mic },
];

interface IAdminGalleryMediaFormProps {
  form: IGalleryFormState;
  editing: boolean;
  uploading: boolean;
  onChange: (patch: Partial<IGalleryFormState>) => void;
  onUpload: (file: File) => void;
}

export function AdminGalleryMediaForm({
  form,
  editing,
  uploading,
  onChange,
  onUpload,
}: IAdminGalleryMediaFormProps) {
  const accept =
    form.mediaType === "photo"
      ? "image/*"
      : form.mediaType === "audio"
        ? "audio/*"
        : "video/*";

  const showFileUpload =
    form.mediaType !== "video" || form.videoSource === "upload";

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-primary-dark">
        {editing ? "Edit Gallery Item" : "Add New Gallery Item"}
      </h2>
      <p className={cn(formHintClass, "mt-1")}>
        Choose media type, upload the file, then fill in the details.
      </p>

      <div className="mt-5">
        <span className={formLabelClass}>Media Type</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {MEDIA_OPTIONS.map(({ type, label, icon: Icon }) => {
            const active = form.mediaType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ mediaType: type })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-semibold transition",
                  active
                    ? "border-primary bg-primary/10 text-primary-dark shadow-sm"
                    : "border-portal text-portal-muted hover:border-primary/30 hover:bg-portal-muted/20"
                )}
              >
                <Icon
                  className={cn("size-6", active ? "text-primary" : "text-portal-muted")}
                  aria-hidden
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <span className={formLabelClass}>Upload Media</span>

        {form.mediaType === "video" ? (
          <div className="mt-2 mb-3 flex flex-wrap gap-2">
            {(["youtube", "upload"] as const).map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => onChange({ videoSource: source })}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  form.videoSource === source
                    ? "bg-primary-dark text-white"
                    : "bg-portal-muted/40 text-portal-muted hover:bg-portal-muted/60"
                )}
              >
                {source === "youtube" ? "YouTube link" : "Upload video"}
              </button>
            ))}
          </div>
        ) : null}

        {form.mediaType === "video" && form.videoSource === "youtube" ? (
          <div className="mt-2">
            <input
              className={formControlClass}
              value={form.youtubeId}
              onChange={(e) => onChange({ youtubeId: e.target.value })}
              placeholder="YouTube URL or video ID"
            />
            <p className={cn(formHintClass, "mt-1.5")}>
              Paste a full YouTube URL or the 11-character video ID.
            </p>
          </div>
        ) : null}

        {showFileUpload ? (
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-portal bg-portal-muted/15 px-6 py-10 transition hover:border-primary/40 hover:bg-primary/5">
            <Upload className="size-8 text-primary" aria-hidden />
            <span className="mt-3 text-sm font-semibold text-portal-heading">
              {uploading ? "Uploading…" : "Click to upload or drag and drop"}
            </span>
            <span className="mt-1 text-center text-xs text-portal-muted">
              {form.mediaType === "photo"
                ? "JPG, PNG, WebP · Max 15 MB"
                : form.mediaType === "audio"
                  ? "MP3, WAV · Max 15 MB"
                  : "MP4, WebM · Max 15 MB"}
            </span>
            <input
              type="file"
              className="sr-only"
              accept={accept}
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
            />
          </label>
        ) : null}

        {form.mediaUrl && showFileUpload ? (
          <p className="mt-2 truncate text-xs font-medium text-primary-dark">
            Uploaded: {form.mediaUrl}
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-4 border-t border-portal pt-5">
        <h3 className="text-sm font-bold text-primary-dark">Details</h3>

        <label className="flex flex-col gap-1.5">
          <span className={formLabelClass}>Title *</span>
          <input
            className={formControlClass}
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Islamic Online Class Session"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={formLabelClass}>Description</span>
          <textarea
            className={cn(formControlClass, "min-h-[88px]")}
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Short description for the gallery card…"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={formLabelClass}>Category</span>
            <select
              className={formControlClass}
              value={form.album}
              onChange={(e) =>
                onChange({
                  album: e.target.value as IGalleryFormState["album"],
                })
              }
            >
              {GALLERY_ALBUM_OPTIONS.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={formLabelClass}>Sort Order</span>
            <input
              type="number"
              className={formControlClass}
              value={form.sortOrder}
              onChange={(e) => onChange({ sortOrder: e.target.value })}
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-portal bg-portal-muted/15 px-4 py-3">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={form.showOnWebsite}
            onChange={(e) => onChange({ showOnWebsite: e.target.checked })}
          />
          <span className="text-sm font-medium text-portal-heading">
            Show on public gallery
          </span>
        </label>
      </div>
    </Card>
  );
}
