import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  GripVertical,
  Lightbulb,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  useAdminPricingPackage,
  useCreatePricingPackage,
  useUpdatePricingPackage,
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
import { AdminPricingFormSection } from "@/features/admin/components/pricing/AdminPricingFormSection";
import { AdminPricingLivePreview } from "@/features/admin/components/pricing/AdminPricingLivePreview";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

const PERIOD_OPTIONS = ["Monthly", "Quarterly", "Yearly", "One Time"];

const DEFAULT_FEATURES = [
  "One-to-one class benefits",
  "Classes 3 days a week",
  "12 days of classes per month",
];

export function AdminPricingFormPage() {
  const { t } = usePortalTranslation();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminPricingPackage(
    isEdit ? id! : ""
  );
  const createPackage = useCreatePricingPackage();
  const updatePackage = useUpdatePricingPackage(id ?? "");

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [priceBdt, setPriceBdt] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [features, setFeatures] = useState<string[]>([...DEFAULT_FEATURES]);
  const [popular, setPopular] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!existing) return;
    setSlug(existing.slug);
    setName(existing.name);
    setPriceBdt(String(existing.priceBdt));
    setPriceUsd(String(existing.priceUsd));
    setPeriod(existing.period || "Monthly");
    setFeatures(
      existing.features.length > 0 ? [...existing.features] : [""]
    );
    setPopular(existing.popular);
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (isEdit || slugTouched || !name.trim()) return;
    setSlug(slugify(name));
  }, [isEdit, name, slugTouched]);

  function updateFeature(index: number, value: string): void {
    setFeatures((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addFeature(): void {
    setFeatures((prev) => [...prev, ""]);
  }

  function removeFeature(index: number): void {
    setFeatures((prev) => {
      if (prev.length <= 1) return [""];
      return prev.filter((_, i) => i !== index);
    });
  }

  function moveFeature(from: number, to: number): void {
    if (to < 0 || to >= features.length) return;
    setFeatures((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();

    const cleanFeatures = features.map((line) => line.trim()).filter(Boolean);
    if (!name.trim() || cleanFeatures.length === 0) return;

    const payload = {
      slug: slug.trim() || slugify(name),
      name: name.trim(),
      priceBdt: Number(priceBdt),
      priceUsd: Number(priceUsd),
      period: period.trim() || "Monthly",
      features: cleanFeatures,
      popular,
      sortOrder: Number(sortOrder) || 0,
      showOnWebsite,
    };

    if (isEdit) {
      await updatePackage.mutateAsync(payload);
    } else {
      await createPackage.mutateAsync(payload);
    }
    navigate("/admin/pricing");
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label={t("admin.common.loadingPackage")} />
      </PageContainer>
    );
  }

  const isSaving = createPackage.isPending || updatePackage.isPending;
  const canSave =
    name.trim().length > 0 &&
    priceBdt !== "" &&
    priceUsd !== "" &&
    features.some((f) => f.trim().length > 0);

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/pricing")}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to pricing
          </button>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {isEdit ? t("admin.cms.pricing.editTitle") : t("admin.cms.pricing.createTitle")}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-portal-muted">
            {isEdit
              ? "Update this learning package shown on the public pricing page."
              : "Add a new learning package that will be displayed on the public pricing page."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`${env.publicSiteUrl}/pricing`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            <Eye className="size-4" aria-hidden />
            Preview
          </a>
          <Button
            type="button"
            disabled={!canSave || isSaving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? t("admin.curriculum.saving") : t("admin.cms.pricing.savePackage")}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="flex flex-col gap-5">
          <AdminPricingFormSection number={1} title="Package Information">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px]">
              <div className="space-y-4">
                <label className="block">
                  <span className={formLabelClass}>Package Name *</span>
                  <input
                    className={cn(formControlClass, "mt-1.5")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Standard Package"
                    required
                  />
                </label>
                <label className="block">
                  <span className={formLabelClass}>Slug *</span>
                  <input
                    className={cn(formControlClass, "mt-1.5")}
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="standard-package"
                    required
                  />
                  <span className={cn(formHintClass, "mt-1 block")}>
                    URL-friendly version. Use lowercase letters, numbers and
                    hyphens.
                  </span>
                </label>
              </div>

              <label className="flex flex-col">
                <span className={formLabelClass}>Sort Order</span>
                <div className="mt-1.5 flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-portal bg-portal-muted/15 px-3 py-6 text-center">
                  <input
                    type="number"
                    className={cn(
                      formControlClass,
                      "mx-auto max-w-[100px] text-center text-lg font-bold"
                    )}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  />
                  <span className="mt-2 text-[11px] text-portal-muted">
                    Lower = first on /pricing
                  </span>
                </div>
              </label>
            </div>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={2} title="Pricing & Billing">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="block">
                <span className={formLabelClass}>Billing Period</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={
                    PERIOD_OPTIONS.includes(period) ? period : "__custom__"
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") return;
                    setPeriod(e.target.value);
                  }}
                >
                  {PERIOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  {!PERIOD_OPTIONS.includes(period) && period ? (
                    <option value="__custom__">{period}</option>
                  ) : null}
                </select>
                {!PERIOD_OPTIONS.includes(period) ? (
                  <input
                    className={cn(formControlClass, "mt-2")}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Custom period"
                  />
                ) : null}
              </label>

              <label className="block">
                <span className={formLabelClass}>Price (BDT) *</span>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-portal-muted">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={0}
                    className={cn(formControlClass, "pl-8")}
                    value={priceBdt}
                    onChange={(e) => setPriceBdt(e.target.value)}
                    placeholder="3000"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className={formLabelClass}>Price (USD) *</span>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-portal-muted">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    className={cn(formControlClass, "pl-8")}
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    placeholder="35"
                    required
                  />
                </div>
              </label>
            </div>
          </AdminPricingFormSection>

          <AdminPricingFormSection
            number={3}
            title="Features & Benefits"
            action={
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary-dark transition hover:bg-primary/20"
              >
                <Plus className="size-3.5" aria-hidden />
                Add Feature
              </button>
            }
          >
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li
                  key={`feature-${index}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex === null || dragIndex === index) return;
                    moveFeature(dragIndex, index);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-portal bg-portal-surface px-2 py-2 transition",
                    dragIndex === index && "border-primary/40 bg-primary/5"
                  )}
                >
                  <button
                    type="button"
                    className="cursor-grab touch-none p-1.5 text-portal-muted active:cursor-grabbing"
                    aria-label={`Reorder feature ${index + 1}`}
                    title="Drag to reorder"
                  >
                    <GripVertical className="size-4" aria-hidden />
                  </button>
                  <input
                    className={cn(formControlClass, "border-0 bg-transparent shadow-none")}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="shrink-0 rounded-lg p-2 text-portal-muted transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove feature ${index + 1}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={4} title="Visibility & Settings">
            <div className="grid gap-6 sm:grid-cols-2">
              <fieldset>
                <legend className={formLabelClass}>Visibility</legend>
                <div className="mt-3 space-y-2">
                  {(
                    [
                      {
                        value: true,
                        label: "Public",
                        hint: "Visible on the public pricing page",
                      },
                      {
                        value: false,
                        label: "Private",
                        hint: "Hidden as draft until published",
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
                        name="visibility"
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

              <fieldset>
                <legend className={formLabelClass}>Popular Package</legend>
                <label
                  className={cn(
                    "mt-3 flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition",
                    popular
                      ? "border-gold/40 bg-gold/10"
                      : "border-portal hover:border-gold/30"
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-portal-heading">
                      Mark as popular
                    </span>
                    <span className="text-xs text-portal-muted">
                      Shows a Popular badge on the public pricing card
                    </span>
                  </span>
                </label>
              </fieldset>
            </div>
          </AdminPricingFormSection>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">

          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary-dark">
              Additional Options
            </h2>
            <div className="mt-3 space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  checked={showOnWebsite}
                  onChange={(e) => setShowOnWebsite(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-semibold text-portal-heading">
                    Show on public website
                  </span>
                  <span className="text-xs text-portal-muted">
                    Same as Public visibility above
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-semibold text-portal-heading">
                    Mark as most popular package
                  </span>
                  <span className="text-xs text-portal-muted">
                    Highlight this plan for visitors
                  </span>
                </span>
              </label>
            </div>
          </Card>

          <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary-dark" aria-hidden />
              <h2 className="text-sm font-bold text-primary-dark">Tips</h2>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-portal-muted">
              <li>Keep your package name clear and benefit-focused.</li>
              <li>List the most valuable features first.</li>
              <li>Mark only one package as Popular for best conversion.</li>
              <li>Use Sort Order so Basic → Premium appears correctly.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </PageContainer>
  );
}
