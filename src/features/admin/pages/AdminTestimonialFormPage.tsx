import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Globe,
  ImagePlus,
  Mic,
  Save,
  Star,
  Type,
  Upload,
  Video,
} from "lucide-react";
import {
  useAdminTestimonial,
  useCreateTestimonial,
  useUpdateTestimonial,
  useUploadResourceFile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { TestimonialMediaType } from "@/types/models";

const MEDIA_OPTIONS: {
  type: TestimonialMediaType;
  label: string;
  hint: string;
  icon: typeof Type;
}[] = [
  { type: "text", label: "Text", hint: "Quote only", icon: Type },
  { type: "audio", label: "Audio", hint: "MP3 + quote", icon: Mic },
  { type: "video", label: "Video", hint: "YouTube + quote", icon: Video },
];

const ROLE_SUGGESTIONS = [
  "Student",
  "Parent",
  "Hifz Student",
  "Tajweed Student",
  "Guardian",
];

function extractYoutubeId(input: string): string {
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
    /* plain id fallback */
  }
  return trimmed;
}

export function AdminTestimonialFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminTestimonial(isEdit ? id! : "");
  const createReview = useCreateTestimonial();
  const updateReview = useUpdateTestimonial(id ?? "");
  const uploadFile = useUploadResourceFile();

  const [name, setName] = useState("");
  const [role, setRole] = useState("Student");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");
  const [mediaType, setMediaType] = useState<TestimonialMediaType>("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setRole(existing.role);
    setLocation(existing.location);
    setContent(existing.content);
    setRating(existing.rating || 5);
    setImage(existing.image ?? "");
    setMediaType(existing.mediaType ?? "text");
    setMediaUrl(existing.mediaUrl ?? "");
    setYoutubeInput(existing.youtubeId ?? "");
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
  }, [existing]);

  const youtubeId = useMemo(() => extractYoutubeId(youtubeInput), [youtubeInput]);
  const contentLen = content.trim().length;
  const canSubmit =
    name.trim().length > 0 &&
    role.trim().length > 0 &&
    location.trim().length > 0 &&
    content.trim().length >= 20 &&
    (mediaType !== "video" || youtubeId.length === 11) &&
    (mediaType !== "audio" || mediaUrl.trim().length > 0);

  async function handleAudioUpload(file: File): Promise<void> {
    setUploadingAudio(true);
    setError(null);
    try {
      const res = await uploadFile.mutateAsync({ file, purpose: "audio" });
      if (res.success && res.data?.url) {
        setMediaUrl(res.data.url);
      } else {
        setError("Audio upload failed. Try again.");
      }
    } catch {
      setError("Audio upload failed. Try again.");
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleImageUpload(file: File): Promise<void> {
    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadFile.mutateAsync({ file, purpose: "gallery" });
      if (res.success && res.data?.url) {
        setImage(res.data.url);
      } else {
        setError("Image upload failed. Try again.");
      }
    } catch {
      setError("Image upload failed. Try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Please complete required fields before saving.");
      return;
    }

    const payload = {
      name: name.trim(),
      role: role.trim(),
      location: location.trim(),
      content: content.trim(),
      rating,
      image: image.trim() || undefined,
      mediaType,
      mediaUrl: mediaType === "audio" ? mediaUrl.trim() : undefined,
      youtubeId: mediaType === "video" ? youtubeId : undefined,
      sortOrder: Number(sortOrder) || 0,
      showOnWebsite,
    };

    try {
      if (isEdit) {
        const res = await updateReview.mutateAsync(payload);
        if (res.success) navigate("/admin/testimonials");
        else setError(res.message || "Failed to save review.");
      } else {
        const res = await createReview.mutateAsync(payload);
        if (res.success) navigate("/admin/testimonials");
        else setError(res.message || "Failed to create review.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading review…" />
      </PageContainer>
    );
  }

  const saving = createReview.isPending || updateReview.isPending;

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() => navigate("/admin/testimonials")}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-portal-muted transition hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to reviews
      </button>

      <div className="portal-card-islamic portal-card--lg relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8">
        <div
          className="pointer-events-none absolute -right-8 -top-10 size-48 rounded-full bg-primary/8 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Student Reviews
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
              {isEdit ? "Edit review" : "New student review"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-portal-muted">
              Create a polished testimonial for the homepage and /reviews page. Preview updates
              live as you type.
            </p>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              showOnWebsite
                ? "bg-primary/15 text-primary-dark"
                : "bg-amber-50 text-amber-700"
            )}
          >
            <Globe className="size-3.5" aria-hidden />
            {showOnWebsite ? "Will publish" : "Saved as pending"}
          </span>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="flex flex-col gap-5">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold text-primary-dark">Student details</h2>
            <p className={cn(formHintClass, "mt-1")}>
              Shown next to the review on the public website.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={formLabelClass}>Full name *</span>
                <input
                  className={formControlClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Rahman"
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={formLabelClass}>Role / course *</span>
                <input
                  className={formControlClass}
                  list="review-role-suggestions"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Student, Parent, Tajweed…"
                  required
                />
                <datalist id="review-role-suggestions">
                  {ROLE_SUGGESTIONS.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={formLabelClass}>Location *</span>
                <input
                  className={formControlClass}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  required
                />
              </label>
            </div>

            <div className="mt-4">
              <span className={formLabelClass}>Avatar</span>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <UserAvatar
                  name={name || "Student"}
                  avatarUrl={image}
                  size="lg"
                  shape="circle"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    className={formControlClass}
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-portal px-3 py-2 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5">
                    <ImagePlus className="size-4 text-primary" aria-hidden />
                    {uploadingImage ? "Uploading…" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-primary-dark">Review content</h2>
                <p className={cn(formHintClass, "mt-1")}>
                  Write a clear, authentic quote (min. 20 characters).
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold",
                  contentLen >= 20 ? "text-primary-dark" : "text-amber-700"
                )}
              >
                {contentLen} chars
              </span>
            </div>

            <label className="mt-4 flex flex-col gap-1.5">
              <span className={formLabelClass}>Quote *</span>
              <textarea
                className={cn(formControlClass, "min-h-[140px] leading-relaxed")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write what the student or parent shared about their experience with BOQ Academy…"
                required
              />
            </label>

            <div className="mt-5">
              <span className={formLabelClass}>Rating *</span>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-xl border transition",
                      value <= rating
                        ? "border-gold/40 bg-gold/15 text-gold-dark"
                        : "border-portal text-portal-muted hover:border-gold/30"
                    )}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  >
                    <Star
                      className={cn(
                        "size-5",
                        value <= rating && "fill-gold text-gold"
                      )}
                      aria-hidden
                    />
                  </button>
                ))}
                <span className="ml-1 text-sm font-semibold text-portal-heading">
                  {rating} / 5
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold text-primary-dark">Media type</h2>
            <p className={cn(formHintClass, "mt-1")}>
              Choose how this review appears on the website.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {MEDIA_OPTIONS.map(({ type, label, hint, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMediaType(type)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    mediaType === type
                      ? "border-primary/40 bg-primary/10 shadow-sm"
                      : "border-portal hover:border-primary/25 hover:bg-portal-muted/20"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-xl",
                      mediaType === type
                        ? "bg-primary text-white"
                        : "bg-portal-muted/40 text-primary-dark"
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-portal-heading">{label}</p>
                  <p className="mt-0.5 text-xs text-portal-muted">{hint}</p>
                </button>
              ))}
            </div>

            {mediaType === "audio" ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-portal bg-portal-muted/15 p-4">
                <label className="flex flex-col gap-1.5">
                  <span className={formLabelClass}>Audio URL *</span>
                  <input
                    className={formControlClass}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://…"
                    required={mediaType === "audio"}
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30">
                  <Upload className="size-4 text-primary" aria-hidden />
                  {uploadingAudio ? "Uploading…" : "Upload MP3 / audio file"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    disabled={uploadingAudio}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleAudioUpload(file);
                    }}
                  />
                </label>
                {mediaUrl ? (
                  <audio controls className="mt-1 w-full" src={mediaUrl}>
                    <track kind="captions" />
                  </audio>
                ) : null}
              </div>
            ) : null}

            {mediaType === "video" ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-portal bg-portal-muted/15 p-4">
                <label className="flex flex-col gap-1.5">
                  <span className={formLabelClass}>YouTube URL or video ID *</span>
                  <input
                    className={formControlClass}
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=… or 11-char ID"
                    required={mediaType === "video"}
                  />
                  <span className={formHintClass}>
                    Detected ID:{" "}
                    <span className="font-semibold text-portal-heading">
                      {youtubeId || "—"}
                    </span>
                  </span>
                </label>
                {youtubeId.length === 11 ? (
                  <div className="overflow-hidden rounded-xl border border-portal">
                    <iframe
                      title="YouTube preview"
                      className="aspect-video w-full"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </Card>

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold text-primary-dark">Publish settings</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={formLabelClass}>Sort order</span>
                <input
                  type="number"
                  className={formControlClass}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
                <span className={formHintClass}>Lower numbers appear first.</span>
              </label>
              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-portal bg-portal-muted/15 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-portal-heading">
                      Show on website
                    </span>
                    <span className="text-xs text-portal-muted">
                      Off = pending / hidden from public pages
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={showOnWebsite}
                    onChange={(e) => setShowOnWebsite(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </Card>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={!canSubmit || saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-dark px-5 text-white hover:bg-primary-dark/90"
            >
              <Save className="size-4" aria-hidden />
              {saving
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : showOnWebsite
                    ? "Publish review"
                    : "Save as pending"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-portal"
              onClick={() => navigate("/admin/testimonials")}
            >
              Cancel
            </Button>
          </div>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="size-4 text-primary" aria-hidden />
              <h2 className="text-sm font-bold text-portal-heading">Live preview</h2>
            </div>

            <div className="rounded-2xl border border-portal bg-primary-light/30 p-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={name || "Student"}
                  avatarUrl={image}
                  size="md"
                  shape="circle"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-primary-dark">
                    {name || "Student name"}
                  </p>
                  <p className="truncate text-xs text-portal-muted">
                    {role || "Role"} · {location || "Location"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < rating ? "fill-gold text-gold" : "text-portal-muted/40"
                    )}
                    aria-hidden
                  />
                ))}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-portal-heading">
                {content.trim()
                  ? `“${content.trim()}”`
                  : "“Your review quote will appear here…”"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase text-primary-dark">
                  {mediaType}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                    showOnWebsite
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {showOnWebsite ? "Published" : "Pending"}
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-portal-muted">
              <li>• Text reviews show quote + rating on homepage cards.</li>
              <li>• Audio reviews need a playable file URL.</li>
              <li>• Video reviews embed YouTube on the reviews page.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </PageContainer>
  );
}
