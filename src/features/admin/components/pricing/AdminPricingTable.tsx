import { Check, CreditCard, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { env } from "@/config/env";
import { cn } from "@/lib/utils/cn";
import type { AdminPricingPackage } from "@/types/models";
import {
  packageIconClass,
  periodBadgeClass,
} from "@/features/admin/components/pricing/adminPricingUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminPricingTableProps {
  items: AdminPricingPackage[];
  totalCount: number;
  onEdit: (item: AdminPricingPackage) => void;
  onDelete: (item: AdminPricingPackage) => void;
}

export function AdminPricingTable({
  items,
  totalCount,
  onEdit,
  onDelete,
}: IAdminPricingTableProps) {
  const { t, formatBdt, formatUsd } = usePortalTranslation();

  if (items.length === 0) {
    return (
      <Card className="rounded-2xl border border-portal p-8 text-center shadow-sm">
        <p className="font-semibold text-portal-heading">No packages match filters</p>
        <p className="mt-1 text-sm text-portal-muted">
          Try clearing search or status filters.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal px-5 py-3">
        <p className="text-xs font-medium text-portal-muted">
          Showing {items.length} of {totalCount} package
          {totalCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Package</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">{t("tables.status")}</th>
              <th className="px-5 py-3.5">Features</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal/80">
            {items.map((item, index) => (
              <tr key={item.id} className="align-top transition hover:bg-portal-muted/20">
                <td className="px-5 py-4">
                  <PackageCell item={item} index={index} />
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      periodBadgeClass(item.period)
                    )}
                  >
                    {item.period || "Monthly"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-portal-heading">
                    {formatBdt(item.priceBdt)}
                  </p>
                  <p className="text-xs text-portal-muted">
                    {formatUsd(item.priceUsd)} / {item.period || "month"}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm text-portal-heading">
                  {item.period || "—"}
                </td>
                <td className="px-5 py-4">
                  <StatusChip published={item.showOnWebsite} />
                </td>
                <td className="px-5 py-4">
                  <FeaturesList features={item.features} />
                </td>
                <td className="px-5 py-4">
                  <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-portal xl:hidden">
        {items.map((item, index) => (
          <li key={item.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <PackageCell item={item} index={index} />
              <StatusChip published={item.showOnWebsite} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  periodBadgeClass(item.period)
                )}
              >
                {item.period || "Monthly"}
              </span>
              <span className="text-sm font-bold text-portal-heading">
                {formatBdt(item.priceBdt)}
              </span>
              <span className="text-xs text-portal-muted">
                {formatUsd(item.priceUsd)}
              </span>
            </div>
            <FeaturesList features={item.features} />
            <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PackageCell({
  item,
  index,
}: {
  item: AdminPricingPackage;
  index: number;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          packageIconClass(index, item.popular)
        )}
      >
        <CreditCard className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-portal-heading">{item.name}</p>
          {item.popular ? (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-dark">
              Popular
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-portal-muted">
          Order {item.sortOrder} · {item.features.length} feature
          {item.features.length === 1 ? "" : "s"}
        </p>
        <p className="mt-1 truncate text-xs font-medium text-primary">
          /{item.slug}
        </p>
      </div>
    </div>
  );
}

function StatusChip({ published }: { published: boolean }) {
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        published
          ? "bg-primary/15 text-primary-dark"
          : "bg-portal-muted/50 text-portal-muted"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-primary" : "bg-portal-muted"
        )}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function FeaturesList({ features }: { features: string[] }) {
  const visible = features.slice(0, 4);
  return (
    <ul className="space-y-1">
      {visible.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-1.5 text-xs text-portal-heading"
        >
          <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="line-clamp-1">{feature}</span>
        </li>
      ))}
      {features.length > 4 ? (
        <li className="pl-5 text-[11px] text-portal-muted">
          +{features.length - 4} more
        </li>
      ) : null}
    </ul>
  );
}

function RowActions({
  item,
  onEdit,
  onDelete,
}: {
  item: AdminPricingPackage;
  onEdit: (item: AdminPricingPackage) => void;
  onDelete: (item: AdminPricingPackage) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-end gap-1">
      <a
        href={`${env.publicSiteUrl}/pricing`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`View ${item.name} on website`}
        title="View public page"
      >
        <Eye className="size-4" aria-hidden />
      </a>
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`Edit ${item.name}`}
        title="Edit"
      >
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-portal-heading"
        aria-label={`More actions for ${item.name}`}
        aria-expanded={open}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>
      {open ? (
        <div className="absolute right-0 top-9 z-20 min-w-[140px] rounded-xl border border-portal bg-portal-surface p-1 shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              onDelete(item);
            }}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
