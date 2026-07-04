import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  useAdminPricingPackages,
  useDeletePricingPackage,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { env } from "@/config/env";

export function AdminPricingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: packages = [], isLoading } = useAdminPricingPackages();
  const deletePackage = useDeletePricingPackage();

  const filtered = packages.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading pricing packages…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Pricing CMS</h1>
          <p className="text-sm text-zinc-500">
            Manage monthly learning packages shown on the public pricing page
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/pricing/new")}
          className="gap-2 rounded-xl bg-primary-dark text-white"
        >
          <Plus className="size-4" />
          New package
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          className={`${formControlClass} py-3 pl-10`}
          placeholder="Search by name or slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
            <p className="font-medium text-zinc-600">No pricing packages yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Add packages here to replace the default hardcoded pricing on the
              public website.
            </p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {item.popular && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <BadgeCheck className="size-3.5" />
                      Popular
                    </span>
                  )}
                  {!item.showOnWebsite && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                      Hidden
                    </span>
                  )}
                  <span className="text-xs text-zinc-400">
                    Order {item.sortOrder}
                  </span>
                </div>
                <p className="font-semibold text-primary-dark">{item.name}</p>
                <p className="text-xs text-zinc-500">
                  {item.slug} · {item.period}
                </p>
                <p className="mt-2 text-sm font-medium text-primary">
                  ৳{item.priceBdt.toLocaleString("en-BD")} / ${item.priceUsd}
                </p>
                <ul className="mt-2 space-y-1">
                  {item.features.slice(0, 3).map((feature) => (
                    <li
                      key={feature}
                      className="line-clamp-1 text-sm text-zinc-600"
                    >
                      {feature}
                    </li>
                  ))}
                  {item.features.length > 3 ? (
                    <li className="text-xs text-zinc-400">
                      +{item.features.length - 3} more
                    </li>
                  ) : null}
                </ul>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href={`${env.publicSiteUrl}/pricing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  <ExternalLink className="size-3.5" />
                  Public page
                </a>
                <Button
                  variant="ghost"
                  className="gap-1 rounded-xl"
                  onClick={() => navigate(`/admin/pricing/${item.id}/edit`)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="gap-1 rounded-xl text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Delete package "${item.name}"?`)) {
                      deletePackage.mutate(item.id);
                    }
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  );
}
