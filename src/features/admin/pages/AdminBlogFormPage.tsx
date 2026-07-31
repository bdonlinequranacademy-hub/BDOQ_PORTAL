import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  useAdminBlogPost,
  useCreateBlogPost,
  useUpdateBlogPost,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { BlogCategory, BlogPostStatus } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
const CATEGORIES: BlogCategory[] = [
  "Quran & Tajweed",
  "Parent Guides",
  "Learning Tips",
];

export function AdminBlogFormPage() {
  const { t } = usePortalTranslation();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: existing, isLoading } = useAdminBlogPost(isEdit ? id! : "");
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost(id ?? "");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<BlogCategory>("Parent Guides");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("BDOQ Academy Team");
  const [readMinutes, setReadMinutes] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<BlogPostStatus>("draft");
  const [pubDate, setPubDate] = useState("");

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setDescription(existing.description);
      setBody(existing.body);
      setCategory(existing.category);
      setTags(existing.tags.join(", "));
      setAuthorName(existing.author.name);
      setAuthorRole(existing.author.role ?? "");
      setReadMinutes(existing.readMinutes?.toString() ?? "");
      setFeatured(existing.featured);
      setStatus(existing.status);
      setPubDate(existing.pubDate.slice(0, 10));
    } else if (!isEdit && user) {
      setAuthorName(user.name);
    }
  }, [existing, isEdit, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      slug: slug || undefined,
      description,
      body,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author: { name: authorName, role: authorRole },
      readMinutes: readMinutes ? Number(readMinutes) : undefined,
      featured,
      status,
      pubDate: pubDate || undefined,
    };

    if (isEdit) {
      const res = await updatePost.mutateAsync(payload);
      if (res.success) navigate("/admin/blog");
    } else {
      const res = await createPost.mutateAsync(payload);
      if (res.success) navigate("/admin/blog");
    }
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label={t("admin.common.loadingPost")} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="mx-auto flex max-w-3xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/admin/blog")}
        className="flex w-fit items-center gap-2 text-sm text-zinc-500 hover:text-primary-dark"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </button>

      <div>
        <h1 className="text-2xl font-bold text-primary-dark">
          {isEdit ? t("admin.cms.blog.editTitle") : t("admin.cms.blog.createTitle")}
        </h1>
        <p className="text-sm text-zinc-500">
          Publish educational articles only — Quran, Tajweed, Hifz, parenting, and learning tips.
          Payment or portal guides do not appear on the public blog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-primary-dark">Title</span>
            <input
              required
              className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-primary-dark">URL slug (optional)</span>
            <input
              className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
              placeholder="auto-generated-from-title"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-primary-dark">Short description</span>
            <textarea
              required
              rows={2}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-primary-dark">Category</span>
              <select
                className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-primary-dark">Status</span>
              <select
                className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-primary-dark">Tags (comma-separated)</span>
            <input
              className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-primary-dark">Author name</span>
              <input
                required
                className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-primary-dark">Author role</span>
              <input
                className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-primary-dark">Publish date</span>
              <input
                type="date"
                className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-primary-dark">Read time (minutes)</span>
              <input
                type="number"
                min={1}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:border-[#03214F]"
                value={readMinutes}
                onChange={(e) => setReadMinutes(e.target.value)}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span className="font-medium text-primary-dark">Featured on homepage (future)</span>
          </label>
        </Card>

        <Card className="flex flex-col gap-2 rounded-2xl border-0 p-6 shadow-sm">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-primary-dark">Article body (Markdown)</span>
            <textarea
              required
              rows={18}
              className="font-mono rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#03214F]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="## Heading&#10;&#10;Write your article in Markdown…"
            />
          </label>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            className="rounded-xl bg-primary-dark text-white"
            disabled={createPost.isPending || updatePost.isPending}
          >
            {status === "published" ? t("admin.cms.blog.savePublish") : t("admin.cms.blog.saveDraft")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl"
            onClick={() => navigate("/admin/blog")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
