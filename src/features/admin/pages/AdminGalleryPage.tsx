import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAdminGalleryItems,
  useCreateGalleryItem,
  useDeleteGalleryItem,
  useUpdateGalleryItem,
  useUploadResourceFile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminGalleryOverviewHeader } from "@/features/admin/components/gallery/AdminGalleryOverviewHeader";
import { AdminGalleryStatsGrid } from "@/features/admin/components/gallery/AdminGalleryStatsGrid";
import { AdminGalleryMediaForm } from "@/features/admin/components/gallery/AdminGalleryMediaForm";
import { AdminGallerySettingsPanel } from "@/features/admin/components/gallery/AdminGallerySettingsPanel";
import { AdminGalleryPreviewCard } from "@/features/admin/components/gallery/AdminGalleryPreviewCard";
import { AdminGalleryRecentList } from "@/features/admin/components/gallery/AdminGalleryRecentList";
import { AdminSectionHeaderPanel } from "@/features/admin/components/sectionHeaders/AdminSectionHeaderPanel";
import {
  buildGalleryPayload,
  canSubmitGalleryForm,
  computeGalleryStats,
  EMPTY_GALLERY_FORM,
  formStateFromItem,
  formatGalleryDate,
  type GalleryListStyle,
  type IGalleryFormState,
} from "@/features/admin/components/gallery/adminGalleryUtils";
import type { AdminGalleryItem } from "@/types/models";

export function AdminGalleryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const { data: items = [], isLoading } = useAdminGalleryItems();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem(editId ?? "");
  const deleteItem = useDeleteGalleryItem();
  const uploadFile = useUploadResourceFile();

  const [form, setForm] = useState<IGalleryFormState>(EMPTY_GALLERY_FORM);
  const [listStyle, setListStyle] = useState<GalleryListStyle>("list");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingItem = useMemo(
    () => (editId ? items.find((item) => item.id === editId) : undefined),
    [editId, items]
  );

  useEffect(() => {
    if (editId && editingItem) {
      setForm(formStateFromItem(editingItem));
      return;
    }
    if (!editId) {
      setForm(EMPTY_GALLERY_FORM);
    }
  }, [editId, editingItem]);

  const stats = useMemo(() => computeGalleryStats(items), [items]);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }),
    [items]
  );

  const pagination = usePaginatedList(sortedItems, {
    pageSize: 10,
    resetDeps: [sortedItems.length],
  });

  const patchForm = useCallback((patch: Partial<IGalleryFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearEdit = useCallback(() => {
    setSearchParams({}, { replace: true });
    setForm(EMPTY_GALLERY_FORM);
    setError(null);
  }, [setSearchParams]);

  async function handleUpload(file: File): Promise<void> {
    setUploading(true);
    setError(null);
    try {
      const res = await uploadFile.mutateAsync({ file, purpose: "gallery" });
      if (res.success && res.data?.url) {
        const nextType: IGalleryFormState["mediaType"] = file.type.startsWith(
          "image/"
        )
          ? "photo"
          : file.type.startsWith("audio/")
            ? "audio"
            : file.type.startsWith("video/")
              ? "video"
              : form.mediaType;

        patchForm({
          mediaUrl: res.data.url,
          mediaPublicId: res.data.publicId ?? "",
          mediaType: nextType,
          videoSource: nextType === "video" ? "upload" : form.videoSource,
        });
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(): Promise<void> {
    setError(null);
    if (!canSubmitGalleryForm(form)) {
      setError("Please complete the required fields and media before saving.");
      return;
    }

    const payload = buildGalleryPayload(form);

    try {
      if (editId) {
        const res = await updateItem.mutateAsync(payload);
        if (res.success) clearEdit();
        else setError(res.message || "Failed to save gallery item.");
      } else {
        const res = await createItem.mutateAsync(payload);
        if (res.success) {
          setForm(EMPTY_GALLERY_FORM);
        } else {
          setError(res.message || "Failed to create gallery item.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  function handleEdit(item: AdminGalleryItem): void {
    setSearchParams({ edit: item.id }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(item: AdminGalleryItem): void {
    if (!window.confirm(`Delete "${item.title}" from the gallery?`)) return;
    deleteItem.mutate(item.id, {
      onSuccess: () => {
        if (editId === item.id) clearEdit();
      },
    });
  }

  if (isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading gallery…" />
      </PageContainer>
    );
  }

  const saving = createItem.isPending || updateItem.isPending;
  const publishedAtLabel = editingItem?.createdAt
    ? formatGalleryDate(editingItem.createdAt)
    : formatGalleryDate(new Date().toISOString());

  return (
    <PageContainer>
      <AdminSectionHeaderPanel sectionKey="pages.gallery" defaultOpen />
      <AdminGalleryOverviewHeader editing={Boolean(editId)} />
      <AdminGalleryStatsGrid stats={stats} />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {editId && !editingItem ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Gallery item not found.{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={clearEdit}
          >
            Start a new item
          </button>
        </p>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)_minmax(280px,0.95fr)]">
        <AdminGalleryMediaForm
          form={form}
          editing={Boolean(editId && editingItem)}
          uploading={uploading}
          onChange={patchForm}
          onUpload={(file) => void handleUpload(file)}
        />

        <AdminGallerySettingsPanel
          form={form}
          listStyle={listStyle}
          publishedAtLabel={publishedAtLabel}
          saving={saving}
          canSubmit={canSubmitGalleryForm(form)}
          onChange={patchForm}
          onListStyleChange={setListStyle}
          onCancel={() => {
            if (editId) clearEdit();
            else {
              setForm(EMPTY_GALLERY_FORM);
              setError(null);
              navigate("/admin/gallery");
            }
          }}
          onSave={() => void handleSave()}
        />

        <div className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <AdminGalleryPreviewCard form={form} />
          <AdminGalleryRecentList
            items={pagination.paginatedItems}
            listStyle={listStyle}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </PageContainer>
  );
}
