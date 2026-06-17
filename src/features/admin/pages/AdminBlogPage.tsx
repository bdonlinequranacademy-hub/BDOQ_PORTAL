import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  useAdminBlogPosts,
  useDeleteBlogPost,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formControlClass } from "@/lib/formControl";
import type { BlogPostStatus } from "@/types/models";
import { env } from "@/config/env";

const statusStyle: Record<BlogPostStatus, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  published: "bg-emerald-50 text-emerald-700",
};

export function AdminBlogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | "all">("all");
  const { data: posts = [], isLoading } = useAdminBlogPosts(
    statusFilter === "all" ? undefined : statusFilter
  );
  const deletePost = useDeleteBlogPost();

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#03214F]">Blog</h1>
          <p className="text-sm text-zinc-500">
            Create and publish articles for the public website — admin only
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/blog/new")}
          className="gap-2 rounded-xl bg-[#03214F] text-white"
        >
          <Plus className="size-4" />
          New post
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className={`${formControlClass} py-3 pl-10`}
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="sm:w-44"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as BlogPostStatus | "all")
          }
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </div>

      {isLoading ? (
        <PageLoading label="Loading posts…" />
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-zinc-400">No blog posts yet. Create your first article.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[post.status]}`}
                  >
                    {post.status}
                  </span>
                  <span className="text-xs text-zinc-400">{post.category}</span>
                  {post.featured && (
                    <span className="text-xs font-semibold text-[#C4922B]">Featured</span>
                  )}
                </div>
                <h2 className="font-bold text-[#03214F]">{post.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{post.description}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  /blog/{post.slug} · {post.author.name}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {post.status === "published" && (
                  <a
                    href={`${env.publicSiteUrl}/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    <ExternalLink className="size-3.5" />
                    View
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-[#03214F] hover:bg-zinc-50"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${post.title}"?`)) {
                      deletePost.mutate(post.id);
                    }
                  }}
                  className="flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
