import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { AdminTestimonial } from "@/types/models";

interface IAdminTestimonialsTopRatedProps {
  items: AdminTestimonial[];
  onSelect: (item: AdminTestimonial) => void;
}

export function AdminTestimonialsTopRated({
  items,
  onSelect,
}: IAdminTestimonialsTopRatedProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">Top rated reviews</h2>
      {items.length === 0 ? (
        <p className="text-sm text-portal-muted">No published reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="flex w-full items-center gap-3 rounded-xl border border-transparent px-1 py-1 text-left transition hover:border-portal hover:bg-portal-muted/20"
              >
                <UserAvatar
                  name={item.name}
                  avatarUrl={item.image}
                  size="sm"
                  shape="circle"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-portal-muted">{item.location}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-bold text-gold-dark">
                  <Star className="size-3.5 fill-gold text-gold" aria-hidden />
                  {(item.rating || 0).toFixed(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
