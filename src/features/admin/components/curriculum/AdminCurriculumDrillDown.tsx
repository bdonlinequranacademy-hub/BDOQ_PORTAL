import { useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  FolderOpen,
  GraduationCap,
  Languages,
  Mic2,
  Moon,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formControlClass } from "@/lib/formControl";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { isSurahTopicId, normalizeProgramId } from "@/lib/curriculumCatalog";
import { AdminCurriculumDetailPanel } from "@/features/admin/components/curriculum/AdminCurriculumDetailPanel";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

const COLUMN_HEIGHT = "h-[420px]";

function programIcon(id: string) {
  const normalized = normalizeProgramId(id);
  switch (normalized) {
    case "hifz":
    case "surah-memorization":
      return Moon;
    case "tajweed":
      return Mic2;
    case "quran-education":
    case "quran-recitation":
      return BookOpen;
    case "arabic":
      return Languages;
    default:
      return GraduationCap;
  }
}

interface IAdminCurriculumDrillDownProps {
  tree: CurriculumNode[];
  programIdx: number;
  sectionIdx: number | "";
  topicIdx: number | "";
  onProgramSelect: (index: number) => void;
  onSectionSelect: (index: number) => void;
  onTopicSelect: (index: number) => void;
  onAddProgram: () => void;
  onAddSection: () => void;
  onDeleteProgram: (index: number) => void;
  onDeleteSection: (index: number) => void;
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

function ColumnShell({
  title,
  breadcrumb,
  action,
  toolbar,
  footer,
  children,
}: {
  title: string;
  breadcrumb?: string;
  action?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]",
        COLUMN_HEIGHT
      )}
    >
      <div className="shrink-0 border-b border-portal px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {breadcrumb ? (
              <p className="truncate text-[11px] font-medium text-portal-muted">{breadcrumb}</p>
            ) : null}
            <h2 className="text-sm font-bold text-portal-heading">{title}</h2>
          </div>
          {action}
        </div>
        {toolbar ? <div className="mt-2.5">{toolbar}</div> : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2">{children}</div>
      </div>
      {footer ? <div className="shrink-0 border-t border-portal p-3">{footer}</div> : null}
    </Card>
  );
}

function ItemActions({
  label,
  onEdit,
  onDelete,
}: {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = usePortalTranslation();

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        className="rounded-lg p-1.5 text-portal-muted transition hover:bg-primary/10 hover:text-primary"
        aria-label={t("admin.curriculum.editItem", { label })}
        title={t("actions.edit")}
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        className="rounded-lg p-1.5 text-portal-muted transition hover:bg-red-50 hover:text-red-600"
        aria-label={t("admin.curriculum.deleteItem", { label })}
        title={t("actions.delete")}
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

export function AdminCurriculumDrillDown({
  tree,
  programIdx,
  sectionIdx,
  topicIdx,
  onProgramSelect,
  onSectionSelect,
  onTopicSelect,
  onAddProgram,
  onAddSection,
  onDeleteProgram,
  onDeleteSection,
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
}: IAdminCurriculumDrillDownProps) {
  const { t, formatNumber } = usePortalTranslation();
  const [programSearch, setProgramSearch] = useState("");

  const program = tree[programIdx];
  const sections = program?.children ?? [];
  const section =
    sectionIdx !== "" && sections[sectionIdx] ? sections[sectionIdx] : null;
  const topics = section?.children ?? [];
  const topic = topicIdx !== "" && topics[topicIdx] ? topics[topicIdx] : null;

  const filteredPrograms = useMemo(() => {
    const query = programSearch.trim().toLowerCase();
    return tree
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        if (!query) return true;
        return (
          item.label.toLowerCase().includes(query) ||
          (item.labelBn?.toLowerCase().includes(query) ?? false)
        );
      });
  }, [tree, programSearch]);

  const visibleTopics = useMemo(() => {
    if (showSurahPicker) return topics.filter((item) => isSurahTopicId(item.id));
    if (showTajweedPicker || showGrammarPicker) return topics;
    return topics.filter((item) => !isSurahTopicId(item.id));
  }, [topics, showSurahPicker, showTajweedPicker, showGrammarPicker]);

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2 2xl:grid-cols-4">
      <ColumnShell
        title={t("admin.curriculum.programs")}
        toolbar={
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
              aria-hidden
            />
            <input
              className={`${formControlClass} py-2 pl-9 text-sm`}
              placeholder={t("admin.curriculum.searchPrograms")}
              value={programSearch}
              onChange={(event) => setProgramSearch(event.target.value)}
            />
          </div>
        }
        footer={
          <button
            type="button"
            onClick={onAddProgram}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            <Plus className="size-4" aria-hidden />
            {t("admin.curriculum.addNewProgram")}
          </button>
        }
      >
        {filteredPrograms.length === 0 ? (
          <p className="text-sm text-portal-muted">{t("admin.curriculum.noProgramsMatch")}</p>
        ) : (
          filteredPrograms.map(({ item, index }) => {
            const Icon = programIcon(item.id);
            const active = index === programIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onProgramSelect(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition",
                  active
                    ? "border-primary/30 bg-primary/10 shadow-sm"
                    : "border-transparent bg-portal-muted/20 hover:border-portal hover:bg-portal-muted/40"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    active ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-portal-heading">
                    {item.label}
                  </span>
                  <span className="text-xs text-portal-muted">
                    {t("admin.curriculum.sectionCount", {
                      count: formatNumber(item.children?.length ?? 0),
                    })}
                  </span>
                </span>
                <ItemActions
                  label={item.label}
                  onEdit={() => onProgramSelect(index)}
                  onDelete={() => onDeleteProgram(index)}
                />
              </button>
            );
          })
        )}
      </ColumnShell>

      <ColumnShell
        title={t("admin.curriculum.sectionsTitle")}
        breadcrumb={
          program
            ? t("admin.curriculum.sectionsBreadcrumb", { program: program.label })
            : undefined
        }
        action={
          program ? (
            <button
              type="button"
              onClick={onAddSection}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-white"
            >
              <Plus className="size-3" aria-hidden />
              {t("admin.curriculum.add")}
            </button>
          ) : null
        }
      >
        {!program ? (
          <p className="text-sm text-portal-muted">{t("admin.curriculum.selectProgramFirst")}</p>
        ) : sections.length === 0 ? (
          <p className="text-sm text-portal-muted">{t("admin.curriculum.noSectionsYet")}</p>
        ) : (
          sections.map((item, index) => {
            const active = sectionIdx === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionSelect(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition",
                  active
                    ? "border-teal/30 bg-teal/10"
                    : "border-transparent bg-portal-muted/20 hover:border-portal hover:bg-portal-muted/40"
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal-700">
                  <FolderOpen className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-portal-heading">
                    {item.label}
                  </span>
                  <span className="text-xs text-portal-muted">
                    {t("admin.curriculum.topicCount", {
                      count: formatNumber(item.children?.length ?? 0),
                    })}
                  </span>
                </span>
                <ItemActions
                  label={item.label}
                  onEdit={() => onSectionSelect(index)}
                  onDelete={() => onDeleteSection(index)}
                />
              </button>
            );
          })
        )}
      </ColumnShell>

      <ColumnShell
        title={
          showSurahPicker
            ? t("admin.curriculum.surahsTitle")
            : showTajweedPicker
              ? t("admin.curriculum.tajweedRulesTitle")
              : t("admin.curriculum.topicsTitle")
        }
        breadcrumb={
          program && section
            ? t("admin.curriculum.itemsBreadcrumb", { section: section.label })
            : undefined
        }
      >
        {!section ? (
          <p className="text-sm text-portal-muted">{t("admin.curriculum.selectSectionForTopics")}</p>
        ) : visibleTopics.length === 0 ? (
          <p className="text-sm text-portal-muted">
            {showSurahPicker || showTajweedPicker || showGrammarPicker
              ? t("admin.curriculum.useDetailsPanel")
              : t("admin.curriculum.noTopicsYet")}
          </p>
        ) : (
          visibleTopics.map((item) => {
            const index = topics.findIndex((topicItem) => topicItem.id === item.id);
            const active = topicIdx === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTopicSelect(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition",
                  active
                    ? "border-amber-300/60 bg-amber-50"
                    : "border-transparent bg-portal-muted/20 hover:border-portal hover:bg-portal-muted/40"
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-portal-heading">
                  {item.label}
                </span>
              </button>
            );
          })
        )}
      </ColumnShell>

      <AdminCurriculumDetailPanel
        program={program}
        section={section}
        topic={topic}
        programPath={programPath}
        sectionPath={sectionPath}
        topicPath={topicPath}
        showSurahPicker={showSurahPicker}
        showTajweedPicker={showTajweedPicker}
        showGrammarPicker={showGrammarPicker}
        selectedSurahs={selectedSurahs}
        selectedTajweedIds={selectedTajweedIds}
        selectedGrammarIds={selectedGrammarIds}
        onPatchNode={onPatchNode}
        onSurahSelection={onSurahSelection}
        onTajweedSelection={onTajweedSelection}
        onGrammarSelection={onGrammarSelection}
      />
    </div>
  );
}
