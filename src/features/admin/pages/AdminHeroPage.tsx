import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  ImageIcon,
  LayoutTemplate,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useAdminHomeHeroSlides,
  useSaveHomeHeroSlides,
  useUploadResourceFile,
} from "@/features/admin/hooks/useAdmin";
import {
  addHeroSlide,
  buildHeroSavePayload,
  canSaveHeroSlides,
  formatObjectPosition,
  MAX_HERO_SLIDES,
  MIN_HERO_SLIDES,
  normalizeHeroSlides,
  parseObjectPosition,
  removeHeroSlideAt,
  type HeroContentLocale,
} from "@/features/admin/components/hero/adminHeroUtils";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { Card } from "@/components/ui/Card";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { AdminHomeHeroSlide, IHomeHeroLocaleContent } from "@/types/models";

function HighlightedPreview({
  title,
  highlight,
}: {
  title: string;
  highlight?: string;
}) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="text-primary">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  );
}

export function AdminHeroPage() {
  const { data: apiSlides, isLoading } = useAdminHomeHeroSlides();
  const saveHero = useSaveHomeHeroSlides();
  const uploadFile = useUploadResourceFile();

  const [slides, setSlides] = useState<AdminHomeHeroSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentLocale, setContentLocale] = useState<HeroContentLocale>("en");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSlides(normalizeHeroSlides(apiSlides));
    setDirty(false);
  }, [apiSlides]);

  const activeSlide = slides[activeIndex];

  const patchSlide = useCallback(
    (index: number, patch: Partial<AdminHomeHeroSlide>) => {
      setSlides((prev) =>
        prev.map((slide, i) => (i === index ? { ...slide, ...patch } : slide))
      );
      setDirty(true);
    },
    []
  );

  const patchLocaleContent = useCallback(
    (
      index: number,
      locale: HeroContentLocale,
      patch: Partial<IHomeHeroLocaleContent>
    ) => {
      setSlides((prev) =>
        prev.map((slide, i) => {
          if (i !== index) return slide;
          const key = locale === "bn" ? "contentBn" : "contentEn";
          return {
            ...slide,
            [key]: { ...slide[key], ...patch },
          };
        })
      );
      setDirty(true);
    },
    []
  );

  const localeContent = useMemo(() => {
    if (!activeSlide) return null;
    return contentLocale === "bn"
      ? activeSlide.contentBn
      : activeSlide.contentEn;
  }, [activeSlide, contentLocale]);

  const objectPos = useMemo(
    () =>
      parseObjectPosition(activeSlide?.imageObjectPosition ?? "50% 25%"),
    [activeSlide?.imageObjectPosition]
  );

  async function handleUpload(file: File): Promise<void> {
    setUploading(true);
    setError(null);
    try {
      const res = await uploadFile.mutateAsync({ file, purpose: "hero" });
      if (res.success && res.data?.url) {
        patchSlide(activeIndex, {
          imageUrl: res.data.url,
          imagePublicId: res.data.publicId ?? "",
        });
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(): Promise<void> {
    setError(null);
    if (!canSaveHeroSlides(slides)) {
      setError("Each slide needs an image plus EN/BN badge and title.");
      return;
    }

    try {
      const res = await saveHero.mutateAsync({
        slides: buildHeroSavePayload(slides),
      });
      if (res.success) {
        setDirty(false);
      } else {
        setError(res.message || "Failed to save home hero.");
      }
    } catch {
      setError("Something went wrong while saving.");
    }
  }

  function handleAddSlide(): void {
    if (slides.length >= MAX_HERO_SLIDES) {
      setError(`You can add up to ${MAX_HERO_SLIDES} hero slides.`);
      return;
    }

    setError(null);
    const next = addHeroSlide(slides);
    setSlides(next);
    setActiveIndex(next.length - 1);
    setDirty(true);
  }

  function handleRemoveSlide(): void {
    if (slides.length <= MIN_HERO_SLIDES) {
      setError("At least one hero slide must remain.");
      return;
    }

    const label =
      activeSlide.contentEn.title.trim() || `Slide ${activeIndex + 1}`;
    if (
      !window.confirm(
        `Remove "${label}" from the hero carousel? Save Hero to apply on the website.`
      )
    ) {
      return;
    }

    setError(null);
    const next = removeHeroSlideAt(slides, activeIndex);
    setSlides(next);
    setActiveIndex(Math.min(activeIndex, next.length - 1));
    setDirty(true);
  }

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading home hero CMS…" />
      </PageContainer>
    );
  }

  if (!activeSlide || !localeContent) {
    return (
      <PageContainer>
        <p className="text-sm text-portal-muted">No hero slides available.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Website CMS
          </p>
          <h1 className="mt-1 text-2xl font-bold text-primary-dark">
            Home Hero Section
          </h1>
          <p className={cn(formHintClass, "mt-2 max-w-2xl")}>
            Manage carousel images and headline copy for the public homepage — all
            slides on one workspace with live preview.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saveHero.isPending || !dirty}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="size-4" aria-hidden="true" />
          {saveHero.isPending ? "Saving…" : "Save Hero"}
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.slideId}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              index === activeIndex
                ? "bg-primary text-white shadow-sm"
                : "border border-portal bg-portal-surface text-portal-muted hover:border-primary/30"
            )}
          >
            Slide {index + 1}
          </button>
        ))}

        {slides.length < MAX_HERO_SLIDES ? (
          <button
            type="button"
            onClick={handleAddSlide}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Slide
          </button>
        ) : null}

        <span className="ml-auto text-xs text-portal-muted">
          {slides.length}/{MAX_HERO_SLIDES} slides
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_minmax(280px,0.85fr)]">
        <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="size-5 text-primary" aria-hidden="true" />
              <h2 className="text-base font-bold text-primary-dark">
                Headline & CTAs
              </h2>
            </div>
            <div className="inline-flex rounded-full border border-portal p-1">
              {(["en", "bn"] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setContentLocale(locale)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase transition",
                    contentLocale === locale
                      ? "bg-primary text-white"
                      : "text-portal-muted hover:text-primary-dark"
                  )}
                >
                  {locale}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className={formLabelClass}>Badge</span>
              <input
                className={formControlClass}
                value={localeContent.badge}
                onChange={(e) =>
                  patchLocaleContent(activeIndex, contentLocale, {
                    badge: e.target.value,
                  })
                }
              />
            </label>

            <label className="block">
              <span className={formLabelClass}>Title</span>
              <input
                className={formControlClass}
                value={localeContent.title}
                onChange={(e) =>
                  patchLocaleContent(activeIndex, contentLocale, {
                    title: e.target.value,
                  })
                }
              />
            </label>

            <label className="block">
              <span className={formLabelClass}>Title highlight (optional)</span>
              <input
                className={formControlClass}
                value={localeContent.titleHighlight ?? ""}
                onChange={(e) =>
                  patchLocaleContent(activeIndex, contentLocale, {
                    titleHighlight: e.target.value,
                  })
                }
              />
            </label>

            <label className="block">
              <span className={formLabelClass}>Subtitle</span>
              <textarea
                className={cn(formControlClass, "min-h-[96px]")}
                value={localeContent.subtitle}
                onChange={(e) =>
                  patchLocaleContent(activeIndex, contentLocale, {
                    subtitle: e.target.value,
                  })
                }
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Primary CTA</span>
                <input
                  className={formControlClass}
                  value={localeContent.primaryCta}
                  onChange={(e) =>
                    patchLocaleContent(activeIndex, contentLocale, {
                      primaryCta: e.target.value,
                    })
                  }
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Secondary CTA</span>
                <input
                  className={formControlClass}
                  value={localeContent.secondaryCta}
                  onChange={(e) =>
                    patchLocaleContent(activeIndex, contentLocale, {
                      secondaryCta: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Primary link</span>
                <input
                  className={formControlClass}
                  value={activeSlide.primaryHref}
                  onChange={(e) =>
                    patchSlide(activeIndex, { primaryHref: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Secondary link</span>
                <input
                  className={formControlClass}
                  value={activeSlide.secondaryHref}
                  onChange={(e) =>
                    patchSlide(activeIndex, { secondaryHref: e.target.value })
                  }
                />
              </label>
            </div>

            <label className="block">
              <span className={formLabelClass}>Image alt text</span>
              <input
                className={formControlClass}
                value={localeContent.imageAlt}
                onChange={(e) =>
                  patchLocaleContent(activeIndex, contentLocale, {
                    imageAlt: e.target.value,
                  })
                }
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark">
              <input
                type="checkbox"
                checked={activeSlide.showOnWebsite}
                onChange={(e) =>
                  patchSlide(activeIndex, { showOnWebsite: e.target.checked })
                }
              />
              Show this slide on website
            </label>
          </div>
        </Card>

        <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="text-base font-bold text-primary-dark">
                Carousel Image
              </h2>
            </div>
            {slides.length > MIN_HERO_SLIDES ? (
              <button
                type="button"
                onClick={handleRemoveSlide}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Remove slide
              </button>
            ) : null}
          </div>

          <label className="block">
            <span className={formLabelClass}>Image URL</span>
            <input
              className={formControlClass}
              value={activeSlide.imageUrl}
              onChange={(e) =>
                patchSlide(activeIndex, { imageUrl: e.target.value })
              }
              placeholder="https://… or /images/hero/…"
            />
          </label>

          <label className="mt-4 block">
            <span className={formLabelClass}>Upload image</span>
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-portal px-4 py-2 text-sm font-semibold text-primary-dark transition hover:border-primary/30">
                <Upload className="size-4" aria-hidden="true" />
                {uploading ? "Uploading…" : "Choose file"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUpload(file);
                  }}
                />
              </label>
            </div>
          </label>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className={formLabelClass}>
                Horizontal focus ({objectPos.x}%)
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={objectPos.x}
                onChange={(e) =>
                  patchSlide(activeIndex, {
                    imageObjectPosition: formatObjectPosition(
                      Number(e.target.value),
                      objectPos.y
                    ),
                  })
                }
                className="w-full"
              />
            </label>

            <label className="block">
              <span className={formLabelClass}>
                Vertical focus ({objectPos.y}%) — lower shows more head
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={objectPos.y}
                onChange={(e) =>
                  patchSlide(activeIndex, {
                    imageObjectPosition: formatObjectPosition(
                      objectPos.x,
                      Number(e.target.value)
                    ),
                  })
                }
                className="w-full"
              />
            </label>

            <label className="block">
              <span className={formLabelClass}>
                Image scale ({activeSlide.imageScale}%)
              </span>
              <input
                type="range"
                min={85}
                max={100}
                value={activeSlide.imageScale}
                onChange={(e) =>
                  patchSlide(activeIndex, {
                    imageScale: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </label>
          </div>
        </Card>

        <div className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="overflow-hidden rounded-2xl border border-portal bg-[#F7FCF9] p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary-dark">
              <Globe2 className="size-4 text-primary" aria-hidden="true" />
              Live preview — Slide {activeIndex + 1} ({contentLocale.toUpperCase()})
            </div>

            <div className="grid gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {localeContent.badge}
                </p>
                <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-primary-dark">
                  <HighlightedPreview
                    title={localeContent.title}
                    highlight={localeContent.titleHighlight}
                  />
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-portal-muted">
                  {localeContent.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
                    {localeContent.primaryCta}
                  </span>
                  <span className="rounded-full border border-primary px-3 py-1 text-[11px] font-semibold text-primary">
                    {localeContent.secondaryCta}
                  </span>
                </div>
              </div>

              <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px]">
                <div
                  className="absolute inset-0 overflow-hidden rounded-[50%_50%_1rem_1rem/34%_34%_1rem_1rem] border-[3px] border-[#d4a853] bg-white shadow-lg"
                  style={{
                    boxShadow:
                      "inset 0 0 0 5px rgba(255,255,255,0.65), 0 18px 40px -20px rgba(38,155,111,0.35)",
                  }}
                >
                  {activeSlide.imageUrl ? (
                    <div
                      className="absolute inset-2 overflow-hidden rounded-[50%_50%_0.85rem_0.85rem/32%_32%_0.85rem_0.85rem] bg-[#E8F5EF]"
                      style={{
                        transform:
                          activeSlide.imageScale !== 100
                            ? `scale(${activeSlide.imageScale / 100})`
                            : undefined,
                        transformOrigin: "center top",
                      }}
                    >
                      <img
                        src={activeSlide.imageUrl}
                        alt={localeContent.imageAlt}
                        className="h-full w-full object-cover"
                        style={{
                          objectPosition: activeSlide.imageObjectPosition,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-portal-muted">
                      No image
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Previous slide preview"
                  onClick={() =>
                    setActiveIndex((i) =>
                      i === 0 ? slides.length - 1 : i - 1
                    )
                  }
                  className="absolute left-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide preview"
                  onClick={() =>
                    setActiveIndex((i) => (i + 1) % slides.length)
                  }
                  className="absolute right-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
