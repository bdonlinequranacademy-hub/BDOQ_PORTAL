import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import {
  useAdminResource,
  useCreateResource,
  useUpdateResource,
  useUploadResourceFile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PageLoading } from "@/components/ui/PageLoading";
import type {
  EbookCategory,
  EbookLanguage,
  ResourceSection,
  ResourceStatus,
  ResourceType,
} from "@/types/models";
import { formControlClass } from "@/lib/formControl";

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

export function AdminResourceFormPage() {
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
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [language, setLanguage] = useState<EbookLanguage>("en");
  const [author, setAuthor] = useState("BDOQ Academy");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [paraInfo, setParaInfo] = useState("");
  const [surahName, setSurahName] = useState("");
  const [progress, setProgress] = useState("0");
  const [versesJson, setVersesJson] = useState("[]");
  const [youtubeId, setYoutubeId] = useState("");
  const [startSeconds, setStartSeconds] = useState("");
  const [uploading, setUploading] = useState(false);

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
    setPdfUrl(existing.pdfUrl ?? "");
    setFileSize(existing.fileSize ?? "");
    setPageCount(existing.pageCount?.toString() ?? "");
    setLanguage(existing.language ?? "en");
    setAuthor(existing.author ?? "BDOQ Academy");
    setAudioUrl(existing.audioUrl ?? "");
    setDuration(existing.duration ?? "");
    setParaInfo(existing.paraInfo ?? "");
    setSurahName(existing.surahName ?? "");
    setProgress(String(existing.progress ?? 0));
    setVersesJson(JSON.stringify(existing.verses ?? [], null, 2));
    setYoutubeId(existing.youtubeId ?? "");
    setStartSeconds(existing.startSeconds?.toString() ?? "");
  }, [existing]);

  useEffect(() => {
    if (!isEdit) {
      const sections = sectionsForType(type);
      if (!sections.includes(section)) {
        setSection(sections[0]);
      }
    }
  }, [type, isEdit, section]);

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "pdf" | "audio"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile.mutateAsync({
        file,
        purpose: target === "pdf" ? "pdf" : "audio",
      });
      if (res.success && res.data) {
        if (target === "pdf") {
          setPdfUrl(res.data.url);
          setFileSize(res.data.fileSize);
        } else {
          setAudioUrl(res.data.url);
        }
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
      title,
      slug: slug || undefined,
      description: description || undefined,
      status,
      featured,
      sortOrder: Number(sortOrder) || 0,
    };

    if (type === "ebook") {
      Object.assign(payload, {
        category,
        coverGradient,
        pdfUrl: pdfUrl || undefined,
        fileSize: fileSize || undefined,
        pageCount: pageCount ? Number(pageCount) : undefined,
        language,
        author,
      });
    }

    if (type === "audio") {
      Object.assign(payload, {
        audioUrl: audioUrl || undefined,
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
        description: description || undefined,
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

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading resource…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="mx-auto flex max-w-3xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/admin/resources")}
        className="flex w-fit items-center gap-2 text-sm text-zinc-500 hover:text-primary-dark"
      >
        <ArrowLeft className="size-4" />
        Back to resources
      </button>

      <div>
        <h1 className="text-2xl font-bold text-primary-dark">
          {isEdit ? "Edit resource" : "New resource"}
        </h1>
        <p className="text-sm text-zinc-500">
          Published items appear on the public site within ~1 hour (cached).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            {!isEdit ? (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Type</span>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                >
                  <option value="ebook">E-book</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </Select>
              </label>
            ) : null}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Section</span>
              <Select
                value={section}
                onChange={(e) => setSection(e.target.value as ResourceSection)}
              >
                {sectionsForType(type).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-zinc-700">Title</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Slug (optional)</span>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Sort order</span>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-zinc-700">Description</span>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Status</span>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as ResourceStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="size-4 rounded border-zinc-300"
                />
                <span className="font-medium text-zinc-700">Featured</span>
              </span>
              <span className="text-xs text-zinc-500">
                {type === "ebook"
                  ? "Shows in the Featured books section on the public e-books page."
                  : type === "audio"
                    ? "Uses this audio in the main player on /resources/audio (needs audio URL)."
                    : "Uses this video in the hero player on /resources/videos (needs YouTube ID)."}
              </span>
            </label>
          </div>
        </Card>

        {type === "ebook" ? (
          <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
            <h2 className="font-semibold text-primary-dark">E-book details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Category</span>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EbookCategory)}
                >
                  {EBOOK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Language</span>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as EbookLanguage)}
                >
                  <option value="en">English</option>
                  <option value="bn">Bangla</option>
                  <option value="both">Both</option>
                </Select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <span className="font-medium text-zinc-700">Cover gradient</span>
                <Select
                  value={coverGradient}
                  onChange={(e) => setCoverGradient(e.target.value)}
                >
                  {COVER_GRADIENTS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Author</span>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Pages</span>
                <Input
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <span className="font-medium text-zinc-700">PDF URL</span>
                <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">File size</span>
                <Input value={fileSize} onChange={(e) => setFileSize(e.target.value)} />
              </label>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                  <Upload className="size-4" />
                  {uploading ? "Uploading…" : "Upload PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => void handleFileUpload(e, "pdf")}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </Card>
        ) : null}

        {type === "audio" ? (
          <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
            <h2 className="font-semibold text-primary-dark">Audio details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <span className="font-medium text-zinc-700">Audio URL</span>
                <Input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />
              </label>
              <div className="flex items-end sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                  <Upload className="size-4" />
                  {uploading ? "Uploading…" : "Upload audio (MP3)"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={(e) => void handleFileUpload(e, "audio")}
                    disabled={uploading}
                  />
                </label>
              </div>
              {section === "recitation" ? (
                <>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700">Surah name</span>
                    <Input
                      value={surahName}
                      onChange={(e) => setSurahName(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700">Para / Juz</span>
                    <Input
                      value={paraInfo}
                      onChange={(e) => setParaInfo(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700">Duration</span>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="12:45"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700">Progress %</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={progress}
                      onChange={(e) => setProgress(e.target.value)}
                    />
                  </label>
                </>
              ) : null}
              {section === "verses" ? (
                <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                  <span className="font-medium text-zinc-700">
                    Verses (JSON array)
                  </span>
                  <textarea
                    className={`${formControlClass} min-h-[200px] font-mono text-xs`}
                    value={versesJson}
                    onChange={(e) => setVersesJson(e.target.value)}
                  />
                </label>
              ) : null}
            </div>
          </Card>
        ) : null}

        {type === "video" ? (
          <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
            <h2 className="font-semibold text-primary-dark">Video details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <span className="font-medium text-zinc-700">YouTube video ID</span>
                <Input
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="uu0FOZZtz_M"
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700">Start seconds</span>
                <Input
                  type="number"
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(e.target.value)}
                />
              </label>
            </div>
          </Card>
        ) : null}

        <div className="flex gap-3">
          <Button
            type="submit"
            className="rounded-xl bg-primary-dark text-white"
            disabled={createResource.isPending || updateResource.isPending}
          >
            {isEdit ? "Save changes" : "Create resource"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/resources")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
