import { formControlClass } from "@/lib/formControl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminCurriculumCatalogMultiSelectProps {
  label: string;
  hint: string;
  options: { id: string; label: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function AdminCurriculumCatalogMultiSelect({
  label,
  hint,
  options,
  selectedIds,
  onChange,
}: IAdminCurriculumCatalogMultiSelectProps) {
  const { t } = usePortalTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-portal-heading">{label}</p>
        <p className="text-xs text-portal-muted">{hint}</p>
      </div>
      <select
        multiple
        size={5}
        value={selectedIds}
        onChange={(event) => {
          const ids = Array.from(event.target.selectedOptions).map((option) => option.value);
          onChange(ids);
        }}
        className={`${formControlClass} max-h-28 text-sm`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-portal-muted">{t("admin.curriculum.multiSelectHint")}</p>
    </div>
  );
}
