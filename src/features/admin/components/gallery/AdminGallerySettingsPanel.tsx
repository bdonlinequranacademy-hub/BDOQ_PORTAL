import { Columns3, LayoutGrid, List } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { GalleryAlbumType } from "@/types/models";
import {
  GALLERY_ALBUM_OPTIONS,
  GALLERY_GRADIENT_PRESETS,
  GALLERY_HEIGHT_OPTIONS,
  type GalleryListStyle,
  type IGalleryFormState,
} from "@/features/admin/components/gallery/adminGalleryUtils";

interface IAdminGallerySettingsPanelProps {
  form: IGalleryFormState;
  listStyle: GalleryListStyle;
  publishedAtLabel: string;
  saving: boolean;
  canSubmit: boolean;
  onChange: (patch: Partial<IGalleryFormState>) => void;
  onListStyleChange: (style: GalleryListStyle) => void;
  onCancel: () => void;
  onSave: () => void;
}

const LIST_STYLES: {
  id: GalleryListStyle;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "list", label: "List", icon: List },
  { id: "carousel", label: "Carousel", icon: Columns3 },
];

export function AdminGallerySettingsPanel({
  form,
  listStyle,
  publishedAtLabel,
  saving,
  canSubmit,
  onChange,
  onListStyleChange,
  onCancel,
  onSave,
}: IAdminGallerySettingsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
        <h2 className="text-sm font-bold text-primary-dark">Gallery Settings</h2>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className={formLabelClass}>Folder / Album</span>
          <select
            className={formControlClass}
            value={form.album}
            onChange={(e) =>
              onChange({ album: e.target.value as GalleryAlbumType })
            }
          >
            {GALLERY_ALBUM_OPTIONS.map((album) => (
              <option key={album.id} value={album.id}>
                {album.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4">
          <span className={formLabelClass}>Display Style</span>
          <p className={cn(formHintClass, "mt-1")}>
            How recent items appear in this CMS panel.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {LIST_STYLES.map(({ id, label, icon: Icon }) => {
              const active = listStyle === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onListStyleChange(id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition",
                    active
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-portal text-portal-muted hover:border-primary/30"
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
        <h2 className="text-sm font-bold text-primary-dark">Status & Visibility</h2>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className={formLabelClass}>Status</span>
          <select
            className={formControlClass}
            value={form.showOnWebsite ? "published" : "draft"}
            onChange={(e) =>
              onChange({ showOnWebsite: e.target.value === "published" })
            }
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <div className="mt-4">
          <span className={formLabelClass}>Visibility</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                { id: true, label: "Public" },
                { id: false, label: "Private" },
              ] as const
            ).map((opt) => {
              const active = form.showOnWebsite === opt.id;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange({ showOnWebsite: opt.id })}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-portal text-portal-muted hover:border-primary/30"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className={formLabelClass}>Published Date</span>
          <input
            className={cn(formControlClass, "bg-portal-muted/20")}
            value={publishedAtLabel}
            readOnly
          />
          <span className={formHintClass}>
            Auto-set when the item is created.
          </span>
        </label>
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
        <h2 className="text-sm font-bold text-primary-dark">Cover & Layout</h2>
        <p className={cn(formHintClass, "mt-1")}>
          Used for audio cards and empty media placeholders.
        </p>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className={formLabelClass}>Cover gradient</span>
          <select
            className={formControlClass}
            value={form.coverGradient}
            onChange={(e) => onChange({ coverGradient: e.target.value })}
          >
            {GALLERY_GRADIENT_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className={formLabelClass}>Card height</span>
          <select
            className={formControlClass}
            value={form.heightClass}
            onChange={(e) => onChange({ heightClass: e.target.value })}
          >
            {GALLERY_HEIGHT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div
          className={cn(
            "mt-4 overflow-hidden rounded-xl bg-gradient-to-br",
            form.coverGradient,
            form.heightClass === "h-48"
              ? "h-20"
              : form.heightClass === "h-56"
                ? "h-24"
                : form.heightClass === "h-64"
                  ? "h-28"
                  : "h-32"
          )}
          aria-hidden
        />
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1 rounded-xl border border-portal"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!canSubmit || saving}
          className="flex-1 rounded-xl bg-primary text-white hover:bg-primary-dark"
          onClick={onSave}
        >
          {saving ? "Saving…" : "Save Item"}
        </Button>
      </div>
    </div>
  );
}
