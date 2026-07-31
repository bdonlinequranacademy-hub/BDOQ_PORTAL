import { ImageIcon, Mic, Upload, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { GalleryMediaType } from "@/types/models";
import type { IGalleryFormState } from "@/features/admin/components/gallery/adminGalleryUtils";
import { GALLERY_ALBUM_OPTIONS } from "@/features/admin/components/gallery/adminGalleryUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const MEDIA_TYPES: GalleryMediaType[] = ["photo", "video", "audio"];

const MEDIA_ICONS: Record<GalleryMediaType, typeof ImageIcon> = {
  photo: ImageIcon,
  video: Video,
  audio: Mic,
};

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
  const { t, dynamicLabel } = usePortalTranslation();

  const accept =
    form.mediaType === "photo"
      ? "image/*"
      : form.mediaType === "audio"
        ? "audio/*"
        : "video/*";

  const showFileUpload =
    form.mediaType !== "video" || form.videoSource === "upload";

  const formatHint =
    form.mediaType === "photo"
      ? t("admin.cms.gallery.photoFormats")
      : form.mediaType === "audio"
        ? t("admin.cms.gallery.audioFormats")
        : t("admin.cms.gallery.videoFormats");

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-primary-dark">
        {editing ? t("admin.cms.gallery.editTitle") : t("admin.cms.gallery.createTitle")}
      </h2>
      <p className={cn(formHintClass, "mt-1")}>{t("admin.cms.gallery.formDesc")}</p>

      <div className="mt-5">
        <span className={formLabelClass}>{t("admin.cms.gallery.mediaType")}</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {MEDIA_TYPES.map((type) => {
            const active = form.mediaType === type;
            const Icon = MEDIA_ICONS[type];
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
                {dynamicLabel(type)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <span className={formLabelClass}>{t("admin.cms.gallery.uploadMedia")}</span>

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
                {source === "youtube"
                  ? t("admin.cms.gallery.youtubeLink")
                  : t("admin.cms.gallery.uploadVideo")}
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
              placeholder={t("admin.cms.shared.youtubePlaceholder")}
            />
            <p className={cn(formHintClass, "mt-1.5")}>
              {t("admin.cms.gallery.youtubeHint")}
            </p>
          </div>
        ) : null}

        {showFileUpload ? (
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-portal bg-portal-muted/15 px-6 py-10 transition hover:border-primary/40 hover:bg-primary/5">
            <Upload className="size-8 text-primary" aria-hidden />
            <span className="mt-3 text-sm font-semibold text-portal-heading">
              {uploading
                ? t("admin.cms.shared.uploading")
                : t("admin.cms.gallery.clickUpload")}
            </span>
            <span className="mt-1 text-center text-xs text-portal-muted">
              {formatHint}
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
            {t("admin.cms.gallery.uploaded", { url: form.mediaUrl })}
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-4 border-t border-portal pt-5">
        <h3 className="text-sm font-bold text-primary-dark">
          {t("admin.cms.shared.details")}
        </h3>

        <label className="flex flex-col gap-1.5">
          <span className={formLabelClass}>{t("admin.cms.shared.titleRequired")}</span>
          <input
            className={formControlClass}
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={t("admin.cms.gallery.titlePlaceholder")}
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={formLabelClass}>{t("admin.cms.shared.description")}</span>
          <textarea
            className={cn(formControlClass, "min-h-[88px]")}
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={t("admin.cms.gallery.descriptionPlaceholder")}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={formLabelClass}>{t("admin.cms.shared.category")}</span>
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
            <span className={formLabelClass}>{t("admin.cms.shared.sortOrder")}</span>
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
            {t("admin.cms.gallery.showPublicGallery")}
          </span>
        </label>
      </div>
    </Card>
  );
}
