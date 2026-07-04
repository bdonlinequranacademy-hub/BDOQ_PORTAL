import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Mic, Plus, Pencil, Search, Star, Trash2, Video } from "lucide-react";
import {
  useAdminTestimonials,
  useDeleteTestimonial,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { env } from "@/config/env";
import type { TestimonialMediaType } from "@/types/models";

const mediaBadge: Record<TestimonialMediaType, { label: string; className: string }> = {
  text: { label: "Text", className: "bg-zinc-100 text-zinc-600" },
  audio: { label: "Audio", className: "bg-sky-50 text-sky-700" },
  video: { label: "Video", className: "bg-violet-50 text-violet-700" },
};

function MediaIcon({ type }: { type: TestimonialMediaType }) {
  if (type === "audio") return <Mic className="size-3.5" aria-hidden />;
  if (type === "video") return <Video className="size-3.5" aria-hidden />;
  return <Star className="size-3.5" aria-hidden />;
}

export function AdminTestimonialsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: testimonials = [], isLoading } = useAdminTestimonials();
  const deleteReview = useDeleteTestimonial();

  const filtered = testimonials.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading reviews…" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Student Reviews</h1>
          <p className="text-sm text-zinc-500">
            Manage text, audio, and video reviews shown on the public website homepage
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/testimonials/new")}
          className="gap-2 rounded-xl bg-primary-dark text-white"
        >
          <Plus className="size-4" />
          New review
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          className={`${formControlClass} py-3 pl-10`}
          placeholder="Search by name, location, or quote…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
            <p className="font-medium text-zinc-600">No reviews yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Add student testimonials to populate the homepage review section.
            </p>
          </Card>
        ) : (
          filtered.map((item) => {
            const badge = mediaBadge[item.mediaType ?? "text"];
            return (
              <Card
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                    >
                      <MediaIcon type={item.mediaType ?? "text"} />
                      {badge.label}
                    </span>
                    {!item.showOnWebsite && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Hidden
                      </span>
                    )}
                    <span className="text-xs text-zinc-400">Order {item.sortOrder}</span>
                  </div>
                  <p className="font-semibold text-primary-dark">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    {item.role} · {item.location}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <a
                    href={`${env.publicSiteUrl}/reviews`}
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
                    onClick={() => navigate(`/admin/testimonials/${item.id}/edit`)}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="gap-1 rounded-xl text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm(`Delete review from ${item.name}?`)) {
                        deleteReview.mutate(item.id);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </PageContainer>
  );
}
