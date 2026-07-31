import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formControlClass } from "@/lib/formControl";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import {
  GRAMMAR_LESSON_CATALOG,
  SELECTABLE_SURAHS,
  TAJWEED_RULE_CATALOG,
  isSurahTopicId,
} from "@/lib/curriculumCatalog";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { AdminCurriculumCatalogMultiSelect } from "@/features/admin/components/curriculum/AdminCurriculumCatalogMultiSelect";
import { rowTypeStyles } from "@/features/admin/components/curriculum/adminCurriculumUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminCurriculumDetailPanelProps {
  program: CurriculumNode | undefined;
  section: CurriculumNode | null;
  topic: CurriculumNode | null;
  programPath: number[];
  sectionPath: number[] | null;
  topicPath: number[] | null;
  showSurahPicker: boolean;
  showTajweedPicker: boolean;
  showGrammarPicker: boolean;
  selectedSurahs: string[];
  selectedTajweedIds: string[];
  selectedGrammarIds: string[];
  onPatchNode: (path: number[], updater: (node: CurriculumNode) => CurriculumNode) => void;
  onSurahSelection: (names: string[]) => void;
  onTajweedSelection: (ids: string[]) => void;
  onGrammarSelection: (ids: string[]) => void;
}

export function AdminCurriculumDetailPanel({
  program,
  section,
  topic,
  programPath,
  sectionPath,
  topicPath,
  showSurahPicker,
  showTajweedPicker,
  showGrammarPicker,
  selectedSurahs,
  selectedTajweedIds,
  selectedGrammarIds,
  onPatchNode,
  onSurahSelection,
  onTajweedSelection,
  onGrammarSelection,
}: IAdminCurriculumDetailPanelProps) {
  const { t, dynamicLabel } = usePortalTranslation();

  if (!program) {
    return (
      <Card
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]",
          "h-[420px]"
        )}
      >
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.curriculum.details")}</h2>
        <p className="mt-4 text-sm text-portal-muted">{t("admin.curriculum.selectProgram")}</p>
      </Card>
    );
  }

  const detailType = topic ? (isSurahTopicId(topic.id) ? "surah" : "topic") : section ? "section" : "program";
  const detailLabel = topic?.label ?? section?.label ?? program.label;
  const typeLabel = dynamicLabel(detailType);

  return (
    <Card className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-portal px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.curriculum.detailsTitle", { type: typeLabel })}
          </p>
          <h2 className="truncate text-sm font-bold text-portal-heading">{detailLabel}</h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
          <Pencil className="size-3" aria-hidden />
          {t("actions.edit")}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", rowTypeStyles(detailType))}>
            {typeLabel}
          </span>
          {section ? (
            <span className="rounded-full bg-portal-muted/50 px-2.5 py-1 text-[10px] font-semibold text-portal-muted">
              {program.label} › {section.label}
            </span>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-portal-muted">{t("admin.curriculum.programNameEn")}</span>
            <input
              value={program.label}
              onChange={(event) =>
                onPatchNode(programPath, (node) => ({ ...node, label: event.target.value }))
              }
              className={`${formControlClass} py-2.5 text-sm`}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-portal-muted">{t("admin.curriculum.programNameBn")}</span>
            <input
              value={program.labelBn ?? ""}
              onChange={(event) =>
                onPatchNode(programPath, (node) => ({
                  ...node,
                  labelBn: event.target.value || undefined,
                }))
              }
              className={`${formControlClass} py-2.5 text-sm`}
            />
          </label>
        </div>

        {section && sectionPath ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-portal-muted">{t("admin.curriculum.sectionNameEn")}</span>
                <input
                  value={section.label}
                  onChange={(event) =>
                    onPatchNode(sectionPath, (node) => ({ ...node, label: event.target.value }))
                  }
                  className={`${formControlClass} py-2.5 text-sm`}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-portal-muted">{t("admin.curriculum.sectionNameBn")}</span>
                <input
                  value={section.labelBn ?? ""}
                  onChange={(event) =>
                    onPatchNode(sectionPath, (node) => ({
                      ...node,
                      labelBn: event.target.value || undefined,
                    }))
                  }
                  className={`${formControlClass} py-2.5 text-sm`}
                />
              </label>
            </div>

            {showSurahPicker ? (
              <AdminCurriculumCatalogMultiSelect
                label={t("admin.curriculum.surahsInTrack")}
                hint={t("admin.curriculum.surahsInTrackHint")}
                options={SELECTABLE_SURAHS.map((surah) => ({ id: surah, label: surah }))}
                selectedIds={selectedSurahs}
                onChange={onSurahSelection}
              />
            ) : null}

            {showTajweedPicker ? (
              <AdminCurriculumCatalogMultiSelect
                label={t("admin.curriculum.tajweedRules")}
                hint={t("admin.curriculum.tajweedRulesHint")}
                options={TAJWEED_RULE_CATALOG}
                selectedIds={selectedTajweedIds}
                onChange={onTajweedSelection}
              />
            ) : null}

            {showGrammarPicker ? (
              <AdminCurriculumCatalogMultiSelect
                label={t("admin.curriculum.grammarLessons")}
                hint={t("admin.curriculum.grammarLessonsHint")}
                options={GRAMMAR_LESSON_CATALOG}
                selectedIds={selectedGrammarIds}
                onChange={onGrammarSelection}
              />
            ) : null}
          </>
        ) : null}

        {topic && topicPath && !isSurahTopicId(topic.id) ? (
          <div className="rounded-xl border border-dashed border-portal bg-portal-muted/20 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              {t("admin.curriculum.topicLabels")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-portal-muted">{t("admin.curriculum.topicEn")}</span>
                <input
                  value={topic.label}
                  onChange={(event) =>
                    onPatchNode(topicPath, (node) => ({ ...node, label: event.target.value }))
                  }
                  className={`${formControlClass} py-2.5 text-sm`}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-portal-muted">{t("admin.curriculum.topicBn")}</span>
                <input
                  value={topic.labelBn ?? ""}
                  onChange={(event) =>
                    onPatchNode(topicPath, (node) => ({
                      ...node,
                      labelBn: event.target.value || undefined,
                    }))
                  }
                  className={`${formControlClass} py-2.5 text-sm`}
                />
              </label>
            </div>
          </div>
        ) : null}
        </div>
      </div>
    </Card>
  );
}
