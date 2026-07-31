import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
  ImagePlus,
  Save,
  Star,
  Upload,
  X,
} from "lucide-react";
import {
  useAdminResource,
  useCreateResource,
  useUpdateResource,
  useUploadResourceFile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import {
  formControlClass,
  formHintClass,
  formLabelClass,
} from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { env } from "@/config/env";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type {
  EbookCategory,
  EbookLanguage,
  ResourceSection,
  ResourceStatus,
  ResourceType,
} from "@/types/models";
import { AdminResourceFormSection } from "@/features/admin/components/resources/AdminResourceFormSection";
import { AdminResourceLivePreview } from "@/features/admin/components/resources/AdminResourceLivePreview";
import {
  AdminResourceChecklist,
  AdminResourceFormTips,
} from "@/features/admin/components/resources/AdminResourceChecklist";
import {
  EBOOK_CATEGORY_LABELS,
  publicResourcePath,
} from "@/features/admin/components/resources/adminResourcesUtils";

const EBOOK_CATEGORIES: EbookCategory[] = [
  "tajweed",
  "islamic-history",
  "religious",
];

const COVER_GRADIENTS = [
  "from-primary to-primary-dark",
  "from-teal to-primary-dark",
  "from-gold/80 to-primary-dark",
  "from-primary-dark to-teal",
  "from-primary to-teal-accent",
  "from-teal-accent/80 to-primary",
];

function sectionsForType(type: ResourceType): ResourceSection[] {
  switch (type) {
    case "ebook":
      return ["default"];
    case "audio":
      return ["featured", "verses", "recitation"];
    case "video":
      return ["featured", "gallery", "playlist"];
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function AdminResourceFormPage() {
  const { t } = usePortalTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const initialType = (searchParams.get("type") as ResourceType) || "ebook";

  const { data: existing, isLoading } = useAdminResource(isEdit ? id! : "");
  const createResource = useCreateResource();
  const updateResource = useUpdateResource(id ?? "");
  const uploadFile = useUploadResourceFile();

  const [type, setType] = useState<ResourceType>(initialType);
  const [section, setSection] = useState<ResourceSection>("default");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ResourceStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [category, setCategory] = useState<EbookCategory>("tajweed");
  const [coverGradient, setCoverGradient] = useState(COVER_GRADIENTS[0]);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfPublicId, setPdfPublicId] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [language, setLanguage] = useState<EbookLanguage>("en");
  const [author, setAuthor] = useState("BDOQ Academy");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioPublicId, setAudioPublicId] = useState("");
  const [duration, setDuration] = useState("");
  const [paraInfo, setParaInfo] = useState("");
  const [surahName, setSurahName] = useState("");
  const [progress, setProgress] = useState("0");
  const [versesJson, setVersesJson] = useState("[]");
  const [youtubeId, setYoutubeId] = useState("");
  const [startSeconds, setStartSeconds] = useState("");
  const [allowDownload, setAllowDownload] = useState(true);
  const [uploading, setUploading] = useState<"pdf" | "audio" | "cover" | null>(
    null
  );
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setType(existing.type);
    setSection(existing.section);
    setTitle(existing.title);
    setSlug(existing.slug);
    setDescription(existing.description ?? "");
    setStatus(existing.status);
    setFeatured(existing.featured);
    setSortOrder(String(existing.sortOrder));
    setCategory(existing.category ?? "tajweed");
    setCoverGradient(existing.coverGradient ?? COVER_GRADIENTS[0]);
    setCoverUrl(existing.coverUrl ?? "");
    setCoverPublicId(existing.coverPublicId ?? "");
    setPdfUrl(existing.pdfUrl ?? "");
    setPdfPublicId(existing.pdfPublicId ?? "");
    setFileSize(existing.fileSize ?? "");
    setPageCount(existing.pageCount?.toString() ?? "");
    setLanguage(existing.language ?? "en");
    setAuthor(existing.author ?? "BDOQ Academy");
    setAudioUrl(existing.audioUrl ?? "");
    setAudioPublicId(existing.audioPublicId ?? "");
    setDuration(existing.duration ?? "");
    setParaInfo(existing.paraInfo ?? "");
    setSurahName(existing.surahName ?? "");
    setProgress(String(existing.progress ?? 0));
    setVersesJson(JSON.stringify(existing.verses ?? [], null, 2));
    setYoutubeId(existing.youtubeId ?? "");
    setStartSeconds(existing.startSeconds?.toString() ?? "");
    setAllowDownload(Boolean(existing.pdfUrl) || existing.type !== "ebook");
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (!isEdit) {
      const sections = sectionsForType(type);
      if (!sections.includes(section)) setSection(sections[0]);
    }
  }, [type, isEdit, section]);

  useEffect(() => {
    if (isEdit || slugTouched || !title.trim()) return;
    setSlug(slugify(title));
  }, [isEdit, title, slugTouched]);

  async function handleUpload(
    file: File,
    target: "pdf" | "audio" | "cover"
  ): Promise<void> {
    setUploading(target);
    try {
      const purpose =
        target === "pdf" ? "pdf" : target === "audio" ? "audio" : undefined;
      const res = await uploadFile.mutateAsync({ file, purpose });
      if (res.success && res.data) {
        if (target === "pdf") {
          setPdfUrl(res.data.url);
          setPdfPublicId(res.data.publicId);
          setFileSize(res.data.fileSize);
          setAllowDownload(true);
        } else if (target === "audio") {
          setAudioUrl(res.data.url);
          setAudioPublicId(res.data.publicId);
        } else {
          setCoverUrl(res.data.url);
          setCoverPublicId(res.data.publicId);
        }
      }
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();
    if (!title.trim()) return;

    let verses: Array<{ arabic: string; translation: string }> | undefined;
    if (type === "audio" && section === "verses") {
      try {
        const parsed = JSON.parse(versesJson) as unknown;
        if (Array.isArray(parsed)) {
          verses = parsed as Array<{ arabic: string; translation: string }>;
        }
      } catch {
        verses = [];
      }
    }

    const payload: Record<string, unknown> = {
      type,
      section,
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      status,
      featured,
      sortOrder: Number(sortOrder) || 0,
      coverUrl: coverUrl || undefined,
      coverPublicId: coverPublicId || undefined,
      coverGradient: coverGradient || undefined,
    };

    if (type === "ebook") {
      Object.assign(payload, {
        category,
        pdfUrl: pdfUrl || undefined,
        pdfPublicId: pdfPublicId || undefined,
        fileSize: fileSize || undefined,
        pageCount: pageCount ? Number(pageCount) : undefined,
        language,
        author: author.trim() || undefined,
      });
    }

    if (type === "audio") {
      Object.assign(payload, {
        audioUrl: audioUrl || undefined,
        audioPublicId: audioPublicId || undefined,
        duration: duration || undefined,
        paraInfo: paraInfo || undefined,
        surahName: surahName || undefined,
        progress: Number(progress) || 0,
        verses,
      });
    }

    if (type === "video") {
      Object.assign(payload, {
        youtubeId: youtubeId || undefined,
        startSeconds: startSeconds ? Number(startSeconds) : undefined,
      });
    }

    if (isEdit) {
      const res = await updateResource.mutateAsync(payload);
      if (res.success) navigate("/admin/resources");
    } else {
      const res = await createResource.mutateAsync(payload);
      if (res.success) navigate("/admin/resources");
    }
  }

  const checklist = useMemo(() => {
    const mediaReady =
      type === "ebook"
        ? Boolean(pdfUrl)
        : type === "audio"
          ? Boolean(audioUrl)
          : Boolean(youtubeId);
    return [
      {
        id: "title",
        label: "Title and description added",
        done: title.trim().length > 0 && description.trim().length > 0,
      },
      {
        id: "media",
        label:
          type === "ebook"
            ? "PDF file uploaded"
            : type === "audio"
              ? "Audio file uploaded"
              : "YouTube ID added",
        done: mediaReady,
      },
      {
        id: "cover",
        label: "Cover image or gradient set",
        done: Boolean(coverUrl) || Boolean(coverGradient),
      },
      {
        id: "details",
        label:
          type === "ebook"
            ? "Language & author filled"
            : "Additional details filled",
        done:
          type === "ebook"
            ? Boolean(language && author.trim())
            : type === "audio"
              ? section !== "recitation" || Boolean(surahName || duration)
              : Boolean(youtubeId),
      },
      {
        id: "visibility",
        label: "Visibility reviewed",
        done: true,
      },
    ];
  }, [
    title,
    description,
    type,
    pdfUrl,
    audioUrl,
    youtubeId,
    coverUrl,
    coverGradient,
    language,
    author,
    section,
    surahName,
    duration,
  ]);

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label={t("admin.common.loadingResource")} />
      </PageContainer>
    );
  }

  const isSaving = createResource.isPending || updateResource.isPending;
  const published = status === "published";
  const descLen = description.trim().length;
  const publicUrl = `${env.publicSiteUrl}${publicResourcePath(type)}`;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/resources")}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to resources
          </button>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {isEdit ? t("admin.cms.resources.editTitle") : t("admin.cms.resources.createTitle")}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-portal-muted">
            Add a new educational resource that will be available on the public
            website.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            <Eye className="size-4" aria-hidden />
            Preview
          </a>
          <Button
            type="button"
            disabled={!title.trim() || isSaving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? t("admin.curriculum.saving") : t("admin.cms.resources.saveResource")}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div className="flex flex-col gap-5">
          <AdminResourceFormSection number={1} title="Resource Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Resource Type *</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={type}
                  disabled={isEdit}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                >
                  <option value="ebook">E-book</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </select>
              </label>

              <label className="block">
                <span className={formLabelClass}>
                  {type === "ebook" ? "Category *" : "Section *"}
                </span>
                {type === "ebook" ? (
                  <select
                    className={cn(formControlClass, "mt-1.5")}
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as EbookCategory)
                    }
                  >
                    {EBOOK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {EBOOK_CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className={cn(formControlClass, "mt-1.5")}
                    value={section}
                    onChange={(e) =>
                      setSection(e.target.value as ResourceSection)
                    }
                  >
                    {sectionsForType(type).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className={formLabelClass}>Title *</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tajweed Rules Made Easy"
                  required
                />
              </label>

              <label className="block sm:col-span-2">
                <span className={formLabelClass}>Slug</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="tajweed-rules-made-easy"
                />
                <span className={cn(formHintClass, "mt-1 block")}>
                  URL: {publicUrl}
                  {slug ? ` · /${slug}` : ""}
                </span>
              </label>

              <label className="block">
                <span className={formLabelClass}>Sort Order</span>
                <input
                  type="number"
                  className={cn(formControlClass, "mt-1.5")}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </label>

              <label className="block">
                <span className={formLabelClass}>Status</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ResourceStatus)
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className={formLabelClass}>Description</span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      descLen > 2000 ? "text-red-600" : "text-portal-muted"
                    )}
                  >
                    {descLen}/2000
                  </span>
                </div>
                <textarea
                  className={cn(formControlClass, "min-h-[120px]")}
                  value={description}
                  maxLength={2000}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown on resource cards…"
                />
              </label>
            </div>
          </AdminResourceFormSection>

          <AdminResourceFormSection number={2} title="Media & File">
            {type === "ebook" ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-portal bg-portal-muted/15 px-6 py-10 text-center transition hover:border-primary/40 hover:bg-primary/5">
                  <Upload className="size-8 text-primary" aria-hidden />
                  <span className="mt-3 text-sm font-semibold text-portal-heading">
                    {uploading === "pdf"
                      ? "Uploading…"
                      : "Drag & drop PDF or click to browse"}
                  </span>
                  <span className="mt-1 text-xs text-portal-muted">
                    PDF · Max 15 MB
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    disabled={uploading !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file, "pdf");
                      e.target.value = "";
                    }}
                  />
                  {pdfUrl ? (
                    <span className="mt-3 max-w-full truncate text-xs font-medium text-primary-dark">
                      Uploaded: {pdfUrl}
                    </span>
                  ) : null}
                </label>

                <div>
                  <span className={formLabelClass}>Cover Image</span>
                  <div className="relative mt-1.5 overflow-hidden rounded-xl border border-portal bg-portal-muted/20">
                    {coverUrl ? (
                      <>
                        <img
                          src={coverUrl}
                          alt="Cover"
                          className="aspect-[3/4] w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverUrl("");
                            setCoverPublicId("");
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
                          aria-label="Remove cover"
                        >
                          <X className="size-3.5" aria-hidden />
                        </button>
                      </>
                    ) : (
                      <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 text-portal-muted hover:bg-primary/5">
                        <ImagePlus className="size-6 text-primary" aria-hidden />
                        <span className="px-2 text-center text-[11px]">
                          {uploading === "cover" ? "Uploading…" : "Upload cover"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          disabled={uploading !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleUpload(file, "cover");
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <p className={cn(formHintClass, "mt-1")}>Recommended 600×400</p>
                </div>
              </div>
            ) : null}

            {type === "audio" ? (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-portal bg-portal-muted/15 px-6 py-10 text-center transition hover:border-primary/40 hover:bg-primary/5">
                <Upload className="size-8 text-primary" aria-hidden />
                <span className="mt-3 text-sm font-semibold text-portal-heading">
                  {uploading === "audio"
                    ? "Uploading…"
                    : "Drag & drop audio or click to browse"}
                </span>
                <span className="mt-1 text-xs text-portal-muted">
                  MP3 / WAV · Max 15 MB
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  className="sr-only"
                  disabled={uploading !== null}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUpload(file, "audio");
                    e.target.value = "";
                  }}
                />
                {audioUrl ? (
                  <span className="mt-3 max-w-full truncate text-xs font-medium text-primary-dark">
                    Uploaded: {audioUrl}
                  </span>
                ) : null}
              </label>
            ) : null}

            {type === "video" ? (
              <div className="space-y-3">
                <label className="block">
                  <span className={formLabelClass}>YouTube Video ID *</span>
                  <input
                    className={cn(formControlClass, "mt-1.5")}
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    placeholder="uu0FOZZtz_M"
                    required={type === "video"}
                  />
                </label>
                {youtubeId.length >= 11 ? (
                  <div className="overflow-hidden rounded-xl border border-portal">
                    <iframe
                      title="Video preview"
                      className="aspect-video w-full"
                      src={`https://www.youtube.com/embed/${youtubeId.slice(0, 11)}`}
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {(type === "ebook" || type === "audio") && (
              <label className="mt-4 block">
                <span className={formLabelClass}>Cover Gradient (fallback)</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={coverGradient}
                  onChange={(e) => setCoverGradient(e.target.value)}
                >
                  {COVER_GRADIENTS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </AdminResourceFormSection>

          <AdminResourceFormSection number={3} title="Additional Details">
            {type === "ebook" ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className={formLabelClass}>Language</span>
                  <select
                    className={cn(formControlClass, "mt-1.5")}
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as EbookLanguage)
                    }
                  >
                    <option value="en">English</option>
                    <option value="bn">Bangla</option>
                    <option value="both">Both</option>
                  </select>
                </label>
                <label className="block">
                  <span className={formLabelClass}>File Size</span>
                  <input
                    className={cn(formControlClass, "mt-1.5")}
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="2.4 MB"
                  />
                </label>
                <label className="block">
                  <span className={formLabelClass}>Total Pages</span>
                  <input
                    type="number"
                    className={cn(formControlClass, "mt-1.5")}
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label className="block sm:col-span-3">
                  <span className={formLabelClass}>Author</span>
                  <input
                    className={cn(formControlClass, "mt-1.5")}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </label>
              </div>
            ) : null}

            {type === "audio" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {section === "recitation" ? (
                  <>
                    <label className="block">
                      <span className={formLabelClass}>Surah name</span>
                      <input
                        className={cn(formControlClass, "mt-1.5")}
                        value={surahName}
                        onChange={(e) => setSurahName(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className={formLabelClass}>Para / Juz</span>
                      <input
                        className={cn(formControlClass, "mt-1.5")}
                        value={paraInfo}
                        onChange={(e) => setParaInfo(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className={formLabelClass}>Duration</span>
                      <input
                        className={cn(formControlClass, "mt-1.5")}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="12:45"
                      />
                    </label>
                    <label className="block">
                      <span className={formLabelClass}>Progress %</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className={cn(formControlClass, "mt-1.5")}
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                      />
                    </label>
                  </>
                ) : section === "verses" ? (
                  <label className="block sm:col-span-2">
                    <span className={formLabelClass}>Verses (JSON array)</span>
                    <textarea
                      className={cn(
                        formControlClass,
                        "mt-1.5 min-h-[160px] font-mono text-xs"
                      )}
                      value={versesJson}
                      onChange={(e) => setVersesJson(e.target.value)}
                    />
                  </label>
                ) : (
                  <label className="block sm:col-span-2">
                    <span className={formLabelClass}>Duration</span>
                    <input
                      className={cn(formControlClass, "mt-1.5")}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Optional"
                    />
                  </label>
                )}
              </div>
            ) : null}

            {type === "video" ? (
              <label className="block max-w-xs">
                <span className={formLabelClass}>Start seconds</span>
                <input
                  type="number"
                  className={cn(formControlClass, "mt-1.5")}
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(e.target.value)}
                  placeholder="0"
                />
              </label>
            ) : null}
          </AdminResourceFormSection>

          <AdminResourceFormSection number={4} title="Visibility & Settings">
            <div className="grid gap-3 sm:grid-cols-3">
              <ToggleCard
                icon={<Eye className="size-4 text-primary" />}
                title="Show on public website"
                hint="Published status on /resources pages"
                checked={published}
                onChange={(on) => setStatus(on ? "published" : "draft")}
              />
              <ToggleCard
                icon={<Star className="size-4 text-gold-dark" />}
                title="Featured resource"
                hint="Hero / featured placement"
                checked={featured}
                onChange={setFeatured}
              />
              <ToggleCard
                icon={<Download className="size-4 text-sky-600" />}
                title="Allow download"
                hint={
                  type === "ebook"
                    ? "Attach PDF for visitors to download"
                    : "Applies to e-book PDFs only"
                }
                checked={type === "ebook" ? allowDownload : false}
                disabled={type !== "ebook"}
                onChange={setAllowDownload}
              />
            </div>
          </AdminResourceFormSection>

          <div className="flex flex-wrap justify-center gap-3 pb-4">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-primary px-6 text-primary"
              onClick={() => navigate("/admin/resources")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isSaving}
              className="rounded-xl bg-primary px-6 text-white hover:bg-primary-dark"
            >
              {isSaving ? t("admin.curriculum.saving") : t("admin.cms.resources.saveResource")}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <AdminResourceLivePreview
            type={type}
            title={title}
            description={description}
            category={type === "ebook" ? category : undefined}
            coverUrl={coverUrl}
            coverGradient={coverGradient}
            pageCount={pageCount}
            fileSize={fileSize}
            language={language}
            duration={duration}
            youtubeId={youtubeId}
            featured={featured}
            published={published}
          />
          <AdminResourceChecklist items={checklist} />
          <AdminResourceFormTips />
        </aside>
      </form>
    </PageContainer>
  );
}

function ToggleCard({
  icon,
  title,
  hint,
  checked,
  disabled,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-portal p-4 shadow-sm",
        disabled && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition",
            checked ? "bg-primary" : "bg-portal-muted/60",
            disabled && "cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-white shadow transition",
              checked ? "left-5" : "left-0.5"
            )}
          />
        </button>
      </div>
      <div>
        <p className="text-sm font-semibold text-portal-heading">{title}</p>
        <p className="mt-0.5 text-xs text-portal-muted">{hint}</p>
      </div>
    </Card>
  );
}
