import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useAdminPricingPackage,
  useCreatePricingPackage,
  useUpdatePricingPackage,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import { formControlClass } from "@/lib/formControl";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function AdminPricingFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminPricingPackage(isEdit ? id! : "");
  const createPackage = useCreatePricingPackage();
  const updatePackage = useUpdatePricingPackage(id ?? "");

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [priceBdt, setPriceBdt] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [featuresText, setFeaturesText] = useState("");
  const [popular, setPopular] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setSlug(existing.slug);
    setName(existing.name);
    setPriceBdt(String(existing.priceBdt));
    setPriceUsd(String(existing.priceUsd));
    setPeriod(existing.period);
    setFeaturesText(existing.features.join("\n"));
    setPopular(existing.popular);
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (isEdit || slugTouched || !name.trim()) return;
    setSlug(slugify(name));
  }, [isEdit, name, slugTouched]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const features = featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      slug: slug.trim() || slugify(name),
      name: name.trim(),
      priceBdt: Number(priceBdt),
      priceUsd: Number(priceUsd),
      period: period.trim() || "Monthly",
      features,
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
        <PageLoading label="Loading package…" />
      </PageContainer>
    );
  }

  const isSaving = createPackage.isPending || updatePackage.isPending;

  return (
    <PageContainer className="flex flex-col gap-6">
      <Button
        variant="ghost"
        className="w-fit gap-2 rounded-xl px-0"
        onClick={() => navigate("/admin/pricing")}
      >
        <ArrowLeft className="size-4" />
        Back to pricing
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-primary-dark">
          {isEdit ? "Edit pricing package" : "New pricing package"}
        </h1>
        <p className="text-sm text-zinc-500">
          Packages from CMS replace the default hardcoded cards on the public
          pricing page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5 rounded-2xl border-0 p-6 shadow-sm">
          <div>
            <label htmlFor="package-name" className="mb-1.5 block text-sm font-medium">
              Package name
            </label>
            <input
              id="package-name"
              className={formControlClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard"
              required
            />
          </div>

          <div>
            <label htmlFor="package-slug" className="mb-1.5 block text-sm font-medium">
              Slug
            </label>
            <input
              id="package-slug"
              className={formControlClass}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="standard"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price-bdt" className="mb-1.5 block text-sm font-medium">
                Price (BDT)
              </label>
              <input
                id="price-bdt"
                type="number"
                min={0}
                className={formControlClass}
                value={priceBdt}
                onChange={(e) => setPriceBdt(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="price-usd" className="mb-1.5 block text-sm font-medium">
                Price (USD)
              </label>
              <input
                id="price-usd"
                type="number"
                min={0}
                className={formControlClass}
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="package-period" className="mb-1.5 block text-sm font-medium">
              Billing period
            </label>
            <input
              id="package-period"
              className={formControlClass}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Monthly"
            />
          </div>

          <div>
            <label htmlFor="package-features" className="mb-1.5 block text-sm font-medium">
              Features (one per line)
            </label>
            <textarea
              id="package-features"
              className={`${formControlClass} min-h-[220px] resize-y`}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={"One-to-one class benefits\nClasses 3 days a week\n..."}
              required
            />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="space-y-4 rounded-2xl border-0 p-5 shadow-sm">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="size-4 rounded border-zinc-300"
              />
              Mark as most popular
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={showOnWebsite}
                onChange={(e) => setShowOnWebsite(e.target.checked)}
                className="size-4 rounded border-zinc-300"
              />
              Show on public website
            </label>

            <div>
              <label htmlFor="sort-order" className="mb-1.5 block text-sm font-medium">
                Sort order
              </label>
              <input
                id="sort-order"
                type="number"
                className={formControlClass}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </Card>

          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-primary-dark text-white"
          >
            {isSaving ? "Saving…" : isEdit ? "Save package" : "Create package"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
