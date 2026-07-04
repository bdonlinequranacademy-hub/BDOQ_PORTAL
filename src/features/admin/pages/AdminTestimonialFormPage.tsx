import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
import { formControlClass } from "@/lib/formControl";
import type { TestimonialMediaType } from "@/types/models";

const MEDIA_TYPES: TestimonialMediaType[] = ["text", "audio", "video"];

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
  const [rating, setRating] = useState("5");
  const [image, setImage] = useState("");
  const [mediaType, setMediaType] = useState<TestimonialMediaType>("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setRole(existing.role);
    setLocation(existing.location);
    setContent(existing.content);
    setRating(String(existing.rating));
    setImage(existing.image ?? "");
    setMediaType(existing.mediaType ?? "text");
    setMediaUrl(existing.mediaUrl ?? "");
    setYoutubeId(existing.youtubeId ?? "");
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
  }, [existing]);

  async function handleAudioUpload(file: File): Promise<void> {
    setUploading(true);
    try {
      const res = await uploadFile.mutateAsync({ file, purpose: "audio" });
      if (res.success && res.data?.url) {
        setMediaUrl(res.data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const payload = {
      name,
      role,
      location,
      content,
      rating: Number(rating) || 5,
      image: image || undefined,
      mediaType,
      mediaUrl: mediaType === "audio" ? mediaUrl : undefined,
      youtubeId: mediaType === "video" ? youtubeId : undefined,
      sortOrder: Number(sortOrder) || 0,
      showOnWebsite,
    };

    if (isEdit) {
      const res = await updateReview.mutateAsync(payload);
      if (res.success) navigate("/admin/testimonials");
    } else {
      const res = await createReview.mutateAsync(payload);
      if (res.success) navigate("/admin/testimonials");
    }
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading review…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="mx-auto flex max-w-3xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/admin/testimonials")}
        className="flex w-fit items-center gap-2 text-sm text-zinc-500 hover:text-primary-dark"
      >
        <ArrowLeft className="size-4" />
        Back to reviews
      </button>

      <div>
        <h1 className="text-2xl font-bold text-primary-dark">
          {isEdit ? "Edit review" : "New student review"}
        </h1>
        <p className="text-sm text-zinc-500">
          Text, audio, and video reviews appear on the homepage and /reviews page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Name *</span>
              <input
                className={formControlClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Role *</span>
              <input
                className={formControlClass}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Student, Parent…"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">Location *</span>
            <input
              className={formControlClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dhaka, Bangladesh"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">Review text *</span>
            <textarea
              className={`${formControlClass} min-h-[120px]`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Rating</span>
              <select
                className={formControlClass}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Sort order</span>
              <input
                type="number"
                className={formControlClass}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 pt-7 text-sm">
              <input
                type="checkbox"
                checked={showOnWebsite}
                onChange={(e) => setShowOnWebsite(e.target.checked)}
              />
              <span className="font-medium text-zinc-700">Show on website</span>
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">Avatar image URL</span>
            <input
              className={formControlClass}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://… or /images/testimonials/student-1.webp"
            />
          </label>
        </Card>

        <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-primary-dark">Media type</h2>
          <div className="flex flex-wrap gap-2">
            {MEDIA_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  mediaType === type
                    ? "bg-primary-dark text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {mediaType === "audio" && (
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Audio URL</span>
                <input
                  className={formControlClass}
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
                {uploading ? "Uploading…" : "Upload MP3"}
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAudioUpload(file);
                  }}
                />
              </label>
            </div>
          )}

          {mediaType === "video" && (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">YouTube video ID *</span>
              <input
                className={formControlClass}
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="dQw4w9WgXcQ"
                required={mediaType === "video"}
              />
            </label>
          )}
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            className="rounded-xl bg-primary-dark text-white"
            disabled={createReview.isPending || updateReview.isPending}
          >
            {isEdit ? "Save review" : "Publish review"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl"
            onClick={() => navigate("/admin/testimonials")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
