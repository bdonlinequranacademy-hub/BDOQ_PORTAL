import { Eye, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { AdminBlogPost } from "@/types/models";
import { env } from "@/config/env";
import { BlogStatusBadge } from "@/features/admin/components/blog/BlogStatusBadge";
import {
  blogThumbnailGradient,
  categoryBadgeStyles,
  formatBlogDate,
  isUpcomingPost,
} from "@/features/admin/components/blog/adminBlogUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminBlogTableProps {
  posts: AdminBlogPost[];
  totalCount: number;
  onEdit: (post: AdminBlogPost) => void;
  onDelete: (post: AdminBlogPost) => void;
}

const actionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminBlogTable({
  posts,
  totalCount,
  onEdit,
  onDelete,
}: IAdminBlogTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Author</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Published on</th>
              <th className="px-5 py-3.5">Read</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-portal-muted">
                  No posts match your filters.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const upcoming = isUpcomingPost(post);
                return (
                  <tr
                    key={post.id}
                    className="border-b border-portal/80 transition hover:bg-portal-muted/25"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-[240px] items-center gap-3">
                        <div
                          className="flex size-12 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                          style={{ background: blogThumbnailGradient(post.category) }}
                          aria-hidden
                        >
                          {post.title.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-semibold text-portal-heading">
                            {post.title}
                          </p>
                          <p className="line-clamp-1 text-xs text-portal-muted">/blog/{post.slug}</p>
                          {post.featured ? (
                            <span className="mt-1 inline-flex text-[10px] font-semibold uppercase tracking-wide text-gold">
                              Featured
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <UserInitialAvatar name={post.author?.name ?? "?"} size="sm" />
                        <span className="text-portal-heading">{post.author?.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                          categoryBadgeStyles(post.category)
                        )}
                      >
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <BlogStatusBadge status={post.status} upcoming={upcoming} />
                    </td>
                    <td className="px-5 py-4 text-portal-muted">
                      {formatBlogDate(post.pubDate)}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-portal-heading">
                      {post.readMinutes ? `${post.readMinutes} min` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.status === "published" && !upcoming ? (
                          <a
                            href={`${env.publicSiteUrl}/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={actionClass}
                            aria-label={`View ${post.title}`}
                          >
                            <Eye className="size-4" aria-hidden />
                          </a>
                        ) : (
                          <span
                            className={cn(actionClass, "cursor-not-allowed opacity-40")}
                            title="Not live on public blog yet"
                          >
                            <Eye className="size-4" aria-hidden />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(post)}
                          className={actionClass}
                          aria-label={`Edit ${post.title}`}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(post)}
                          className={cn(
                            actionClass,
                            "hover:border-red-300 hover:text-red-600"
                          )}
                          aria-label={`Delete ${post.title}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalCount > 0 ? (
        <p className="sr-only">{totalCount} posts in filtered list</p>
      ) : null}
    </Card>
  );
}
