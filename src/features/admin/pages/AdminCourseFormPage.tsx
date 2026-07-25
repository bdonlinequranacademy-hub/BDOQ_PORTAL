import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Lightbulb, Plus, Save, Trash2 } from "lucide-react";
import {
  useAdminCourse,
  useCreateCourse,
  useUpdateCourse,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { AdminPricingFormSection } from "@/features/admin/components/pricing/AdminPricingFormSection";
import { AdminCmsStatusBadge } from "@/features/admin/components/shared/AdminCmsStatusBadge";
import {
  arrayToLines,
  linesToArray,
  slugify,
} from "@/features/admin/lib/adminCmsUtils";
import {
  formControlClass,
  formHintClass,
  formLabelClass,
} from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { env } from "@/config/env";
import type {
  AdminCourseCategory,
  AdminCourseGender,
  AdminCourseDetail,
} from "@/types/models";

const CATEGORY_OPTIONS: { value: AdminCourseCategory; label: string }[] = [
  { value: "private", label: "Private (1-to-1)" },
  { value: "record", label: "Record Course" },
  { value: "live", label: "Live Course" },
  { value: "free", label: "Free Course" },
];

const GENDER_OPTIONS: { value: AdminCourseGender | ""; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "children", label: "Children" },
];

const PACKAGE_OPTIONS = ["Basic", "Standard", "Advance", "Premium"];

interface IBenefitRow {
  title: string;
  description: string;
}

export function AdminCourseFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminCourse(isEdit ? id! : "");
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse(id ?? "");

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📖");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState<AdminCourseCategory>("private");
  const [gender, setGender] = useState<AdminCourseGender | "">("");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [startingPriceBdt, setStartingPriceBdt] = useState("2000");
  const [recommendedPackage, setRecommendedPackage] = useState("Basic");
  const [audienceText, setAudienceText] = useState("");
  const [benefits, setBenefits] = useState<IBenefitRow[]>([
    { title: "", description: "" },
  ]);
  const [modulesJson, setModulesJson] = useState("[]");
  const [faqsJson, setFaqsJson] = useState("[]");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setSlug(existing.slug);
    setTitle(existing.title);
    setDescription(existing.description);
    setIcon(existing.icon || "📖");
    setTarget(existing.target ?? "");
    setCategory(existing.category);
    setGender(existing.gender ?? "");
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
    setStartingPriceBdt(String(existing.detail.startingPriceBdt));
    setRecommendedPackage(existing.detail.recommendedPackage || "Basic");
    setAudienceText(arrayToLines(existing.detail.audience));
    setBenefits(
      existing.detail.benefits.length > 0
        ? existing.detail.benefits.map((b) => ({
            title: b.title,
            description: b.description,
          }))
        : [{ title: "", description: "" }]
    );
    setModulesJson(JSON.stringify(existing.detail.modules ?? [], null, 2));
    setFaqsJson(JSON.stringify(existing.detail.faqs ?? [], null, 2));
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (isEdit || slugTouched || !title.trim()) return;
    setSlug(slugify(title));
  }, [isEdit, title, slugTouched]);

  function updateBenefit(
    index: number,
    field: keyof IBenefitRow,
    value: string
  ): void {
    setBenefits((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function addBenefit(): void {
    setBenefits((prev) => [...prev, { title: "", description: "" }]);
  }

  function removeBenefit(index: number): void {
    setBenefits((prev) => {
      if (prev.length <= 1) return [{ title: "", description: "" }];
      return prev.filter((_, i) => i !== index);
    });
  }

  function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const cleanBenefits = benefits
      .filter((b) => b.title.trim() && b.description.trim())
      .map((b, index) => ({
        id: `benefit-${index + 1}`,
        title: b.title.trim(),
        description: b.description.trim(),
        icon: "✓",
      }));

    const detail: AdminCourseDetail = {
      benefits: cleanBenefits,
      modules: parseJsonArray(modulesJson, existing?.detail.modules ?? []),
      audience: linesToArray(audienceText),
      faqs: parseJsonArray(faqsJson, existing?.detail.faqs ?? []),
      startingPriceBdt: Number(startingPriceBdt) || 2000,
      recommendedPackage: recommendedPackage.trim() || "Basic",
    };

    const payload = {
      slug: slug.trim() || slugify(title),
      title: title.trim(),
      description: description.trim(),
      icon: icon.trim() || "📖",
      target: target.trim() || undefined,
      category,
      gender: gender || undefined,
      sortOrder: Number(sortOrder) || 0,
      showOnWebsite,
      detail,
    };

    if (isEdit) {
      await updateCourse.mutateAsync(payload);
    } else {
      await createCourse.mutateAsync(payload);
    }
    navigate("/admin/courses");
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading course…" />
      </PageContainer>
    );
  }

  const isSaving = createCourse.isPending || updateCourse.isPending;
  const canSave = title.trim().length > 0 && description.trim().length > 0;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to courses
          </button>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {isEdit ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-portal-muted">
            {isEdit
              ? "Update this course on the public website."
              : "Add a new course for the public /courses page."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {slug ? (
            <a
              href={`${env.publicSiteUrl}/courses/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              <Eye className="size-4" aria-hidden />
              Preview
            </a>
          ) : null}
          <Button
            type="button"
            disabled={!canSave || isSaving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? "Saving…" : "Save Course"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div className="flex flex-col gap-5">
          <AdminPricingFormSection number={1} title="Course Information">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_120px_160px]">
              <label className="block lg:col-span-1">
                <span className={formLabelClass}>Title *</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Noorani Qaida Course"
                  required
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Icon</span>
                <input
                  className={cn(formControlClass, "mt-1.5 text-center text-xl")}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="📖"
                />
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
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Slug *</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="noorani-qaida"
                  required
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Target audience label</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. Children"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className={formLabelClass}>Description *</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[100px]")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description for course cards and SEO…"
                required
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Category *</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as AdminCourseCategory)
                  }
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={formLabelClass}>Gender filter</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as AdminCourseGender | "")
                  }
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={2} title="Pricing & Audience">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Starting price (BDT)</span>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-portal-muted">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={0}
                    className={cn(formControlClass, "pl-8")}
                    value={startingPriceBdt}
                    onChange={(e) => setStartingPriceBdt(e.target.value)}
                  />
                </div>
              </label>
              <label className="block">
                <span className={formLabelClass}>Recommended package</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={
                    PACKAGE_OPTIONS.includes(recommendedPackage)
                      ? recommendedPackage
                      : "__custom__"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "__custom__") {
                      setRecommendedPackage(e.target.value);
                    }
                  }}
                >
                  {PACKAGE_OPTIONS.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                  {!PACKAGE_OPTIONS.includes(recommendedPackage) ? (
                    <option value="__custom__">{recommendedPackage}</option>
                  ) : null}
                </select>
                {!PACKAGE_OPTIONS.includes(recommendedPackage) ? (
                  <input
                    className={cn(formControlClass, "mt-2")}
                    value={recommendedPackage}
                    onChange={(e) => setRecommendedPackage(e.target.value)}
                  />
                ) : null}
              </label>
            </div>

            <label className="mt-4 block">
              <span className={formLabelClass}>Who is this course for?</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[120px] font-mono text-sm")}
                value={audienceText}
                onChange={(e) => setAudienceText(e.target.value)}
                placeholder={"Beginners starting Quran reading\nChildren ages 6–12\nParents seeking structured learning"}
              />
              <span className={cn(formHintClass, "mt-1 block")}>
                One audience line per row — shown on the course detail page.
              </span>
            </label>
          </AdminPricingFormSection>

          <AdminPricingFormSection
            number={3}
            title="Benefits"
            action={
              <button
                type="button"
                onClick={addBenefit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary-dark transition hover:bg-primary/20"
              >
                <Plus className="size-3.5" aria-hidden />
                Add benefit
              </button>
            }
          >
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li
                  key={`benefit-${index}`}
                  className="rounded-xl border border-portal bg-portal-surface p-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        className={formControlClass}
                        value={benefit.title}
                        onChange={(e) =>
                          updateBenefit(index, "title", e.target.value)
                        }
                        placeholder="Benefit title"
                      />
                      <input
                        className={formControlClass}
                        value={benefit.description}
                        onChange={(e) =>
                          updateBenefit(index, "description", e.target.value)
                        }
                        placeholder="Short description"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="shrink-0 rounded-lg p-2 text-portal-muted transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove benefit ${index + 1}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={4} title="Advanced content (JSON)">
            <p className="mb-4 text-xs leading-relaxed text-portal-muted">
              Modules and course-specific FAQs can be edited as JSON below.
            </p>
            <label className="block">
              <span className={formLabelClass}>Modules JSON</span>
              <textarea
                className={cn(
                  formControlClass,
                  "mt-1.5 min-h-[140px] font-mono text-xs"
                )}
                value={modulesJson}
                onChange={(e) => setModulesJson(e.target.value)}
                spellCheck={false}
              />
            </label>
            <label className="mt-4 block">
              <span className={formLabelClass}>Course FAQs JSON</span>
              <textarea
                className={cn(
                  formControlClass,
                  "mt-1.5 min-h-[140px] font-mono text-xs"
                )}
                value={faqsJson}
                onChange={(e) => setFaqsJson(e.target.value)}
                spellCheck={false}
              />
            </label>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={5} title="Visibility">
            <fieldset>
              <legend className={formLabelClass}>Website visibility</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    {
                      value: true,
                      label: "Published",
                      hint: "Visible on the public website",
                    },
                    {
                      value: false,
                      label: "Draft",
                      hint: "Hidden until published",
                    },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.label}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition",
                      showOnWebsite === opt.value
                        ? "border-primary/40 bg-primary/5"
                        : "border-portal hover:border-primary/25"
                    )}
                  >
                    <input
                      type="radio"
                      name="course-visibility"
                      className="mt-1 accent-primary"
                      checked={showOnWebsite === opt.value}
                      onChange={() => setShowOnWebsite(opt.value)}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-portal-heading">
                        {opt.label}
                      </span>
                      <span className="text-xs text-portal-muted">
                        {opt.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </AdminPricingFormSection>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {icon || "📖"}
              </span>
              <div>
                <p className="font-bold text-portal-heading">
                  {title.trim() || "Course title"}
                </p>
                <p className="text-xs text-portal-muted">
                  {CATEGORY_OPTIONS.find((c) => c.value === category)?.label}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-portal-muted line-clamp-4">
              {description.trim() || "Course description preview…"}
            </p>
            <p className="mt-3 text-sm font-semibold text-primary-dark">
              From ৳{startingPriceBdt || "0"} · {recommendedPackage}
            </p>
            <div className="mt-3">
              <AdminCmsStatusBadge showOnWebsite={showOnWebsite} />
            </div>
          </Card>

          <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary-dark" aria-hidden />
              <h2 className="text-sm font-bold text-primary-dark">Tips</h2>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-portal-muted">
              <li>Match category and gender filters to the public courses page tabs.</li>
              <li>Use sort order so featured courses appear first.</li>
              <li>Benefits appear on the course detail “What you will gain” section.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </PageContainer>
  );
}
