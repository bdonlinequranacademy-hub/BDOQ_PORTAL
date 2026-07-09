import { Card } from "@/components/ui/Card";
import type { AdminBlogPost } from "@/types/models";
import {
  blogThumbnailGradient,
  formatBlogDate,
} from "@/features/admin/components/blog/adminBlogUtils";

interface IAdminBlogRecentPostsProps {
  posts: AdminBlogPost[];
  onViewAll: () => void;
  onSelect: (post: AdminBlogPost) => void;
}

export function AdminBlogRecentPosts({ posts, onViewAll, onSelect }: IAdminBlogRecentPostsProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">Recent posts</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-primary hover:underline"
        >
          View all
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {posts.length === 0 ? (
          <p className="text-sm text-portal-muted">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => onSelect(post)}
              className="flex items-center gap-3 rounded-xl border border-portal bg-portal-muted/15 p-2.5 text-left transition hover:border-primary/20 hover:bg-primary/5"
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{ background: blogThumbnailGradient(post.category) }}
                aria-hidden
              >
                {post.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-portal-heading">
                  {post.title}
                </p>
                <p className="mt-0.5 text-xs text-portal-muted">{formatBlogDate(post.pubDate)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
