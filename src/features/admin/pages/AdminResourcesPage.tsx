import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, Plus, Trash2, Video, Pencil, ExternalLink } from "lucide-react";
import {
  useAdminResources,
  useDeleteResource,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type { ResourceStatus, ResourceType } from "@/types/models";
import { env } from "@/config/env";
import { cn } from "@/lib/utils/cn";

const TYPE_TABS: { id: ResourceType; label: string; icon: typeof BookOpen }[] = [
  { id: "ebook", label: "E-books", icon: BookOpen },
  { id: "audio", label: "Audio", icon: Headphones },
  { id: "video", label: "Videos", icon: Video },
];

const statusStyle: Record<ResourceStatus, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  published: "bg-emerald-50 text-emerald-700",
};

function publicPath(type: ResourceType): string {
  switch (type) {
    case "ebook":
      return "/resources/ebooks";
    case "audio":
      return "/resources/audio";
    case "video":
      return "/resources/videos";
  }
}

export function AdminResourcesPage() {
  const navigate = useNavigate();
  const [typeTab, setTypeTab] = useState<ResourceType>("ebook");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "all">("all");
  const { data: items = [], isLoading } = useAdminResources(
    typeTab,
    statusFilter === "all" ? undefined : statusFilter
  );
  const deleteResource = useDeleteResource();

  const pagination = usePaginatedList(items, {
    resetDeps: [typeTab, statusFilter],
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Resources</h1>
          <p className="text-sm text-zinc-500">
            Manage e-books, audio, and videos for the public website
          </p>
        </div>
        <Button
          onClick={() => navigate(`/admin/resources/new?type=${typeTab}`)}
          className="gap-2 rounded-xl bg-primary-dark text-white"
        >
          <Plus className="size-4" />
          Add {typeTab}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTypeTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
              typeTab === id
                ? "bg-primary-dark text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <Select
        className="sm:w-44"
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as ResourceStatus | "all")
        }
      >
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </Select>

      {isLoading ? (
        <PageLoading label="Loading resources…" />
      ) : items.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-zinc-400">No {typeTab} resources yet.</p>
        </Card>
      ) : (
        <>
        <div className="flex flex-col gap-3">
          {pagination.paginatedItems.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      statusStyle[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-zinc-400">{item.section}</span>
                  {item.featured ? (
                    <span className="text-xs font-semibold text-gold">Featured</span>
                  ) : null}
                </div>
                <h2 className="font-semibold text-primary-dark">{item.title}</h2>
                <p className="text-sm text-zinc-500">{item.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.status === "published" ? (
                  <a
                    href={`${env.publicSiteUrl}${publicPath(item.type)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    <ExternalLink className="size-3.5" />
                    View site
                  </a>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1 border border-zinc-200"
                  onClick={() => navigate(`/admin/resources/${item.id}/edit`)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1 border border-red-100 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Delete "${item.title}"?`)) {
                      deleteResource.mutate(item.id);
                    }
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <Pagination pagination={pagination} itemLabel="resources" />
        </>
      )}
    </PageContainer>
  );
}
