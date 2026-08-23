import { useEffect, useMemo, useState } from "react";
import { Plus, RotateCcw, Save } from "lucide-react";
import {
  useAdminCurriculum,
  useResetAdminCurriculum,
  useUpdateAdminCurriculum,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import {
  GRAMMAR_LESSON_CATALOG,
  TAJWEED_RULE_CATALOG,
  isSurahTopicId,
  programUsesGrammarPicker,
  programUsesSurahPicker,
  programUsesTajweedPicker,
  surahNameFromTopicId,
  surahTopicId,
} from "@/lib/curriculumCatalog";
import { PageLoading } from "@/components/ui/PageLoading";
import { AdminCurriculumStatsGrid } from "@/features/admin/components/curriculum/AdminCurriculumStatsGrid";
import { AdminCurriculumDrillDown } from "@/features/admin/components/curriculum/AdminCurriculumDrillDown";
import {
  AdminCurriculumActivity,
  AdminCurriculumOverview,
  AdminCurriculumQuickActions,
  exportCurriculumCsv,
} from "@/features/admin/components/curriculum/AdminCurriculumInsights";
import {
  cloneTree,
  computeCurriculumStats,
  deleteNodeAtPath,
  newNodeId,
  updateNodeAtPath,
} from "@/features/admin/components/curriculum/adminCurriculumUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminCurriculumPage() {
  const { t } = usePortalTranslation();
  const { data: serverTree = [], isLoading } = useAdminCurriculum();
  const updateCurriculum = useUpdateAdminCurriculum();
  const resetCurriculum = useResetAdminCurriculum();
  const [tree, setTree] = useState<CurriculumNode[]>([]);
  const [dirty, setDirty] = useState(false);
  const [programIdx, setProgramIdx] = useState(0);
  const [sectionIdx, setSectionIdx] = useState<number | "">("");
  const [topicIdx, setTopicIdx] = useState<number | "">("");

  useEffect(() => {
    if (serverTree.length) {
      setTree(cloneTree(serverTree));
      setDirty(false);
      setProgramIdx(0);
      setSectionIdx("");
      setTopicIdx("");
    }
  }, [serverTree]);

  const program = tree[programIdx];
  const sections = program?.children ?? [];
  const section =
    sectionIdx !== "" && sections[sectionIdx] ? sections[sectionIdx] : null;

  const programPath = useMemo(() => [programIdx], [programIdx]);
  const sectionPath = useMemo(
    () => (sectionIdx !== "" ? [programIdx, sectionIdx as number] : null),
    [programIdx, sectionIdx]
  );
  const topicPath = useMemo(
    () =>
      sectionPath && topicIdx !== ""
        ? [...sectionPath, topicIdx as number]
        : null,
    [sectionPath, topicIdx]
  );

  const selectedSurahs = useMemo(() => {
    if (!section) return [];
    return (section.children ?? [])
      .map((child) => surahNameFromTopicId(child.id))
      .filter((name): name is string => Boolean(name));
  }, [section]);

  const selectedTajweedIds = useMemo(() => {
    if (!section) return [];
    return (section.children ?? []).map((child) => child.id);
  }, [section]);

  const selectedGrammarIds = useMemo(() => {
    if (!section) return [];
    return (section.children ?? []).map((child) => child.id);
  }, [section]);

  const stats = useMemo(() => computeCurriculumStats(tree), [tree]);

  function patchNode(path: number[], updater: (node: CurriculumNode) => CurriculumNode) {
    setTree((prev) => updateNodeAtPath(prev, path, updater));
    setDirty(true);
  }

  function syncSectionChildren(path: number[], children: CurriculumNode[]) {
    patchNode(path, (node) => ({ ...node, children }));
  }

  function handleSurahSelection(names: string[]) {
    if (!sectionPath || !section) return;
    const other = (section.children ?? []).filter((child) => !isSurahTopicId(child.id));
    const surahNodes: CurriculumNode[] = names.map((name) => ({
      id: surahTopicId(section.id, name),
      label: name,
      labelBn: name,
    }));
    syncSectionChildren(sectionPath, [...other, ...surahNodes]);
  }

  function handleTajweedSelection(ids: string[]) {
    if (!sectionPath) return;
    const nodes = ids.map((id) => {
      const item = TAJWEED_RULE_CATALOG.find((rule) => rule.id === id);
      return {
        id,
        label: item?.label ?? id,
        labelBn: item?.labelBn,
      };
    });
    syncSectionChildren(sectionPath, nodes);
  }

  function handleGrammarSelection(ids: string[]) {
    if (!sectionPath) return;
    const nodes = ids.map((id) => {
      const item = GRAMMAR_LESSON_CATALOG.find((lesson) => lesson.id === id);
      return {
        id,
        label: item?.label ?? id,
        labelBn: item?.labelBn,
      };
    });
    syncSectionChildren(sectionPath, nodes);
  }

  function handleAddProgram() {
    setTree((prev) => [
      ...prev,
      { id: newNodeId("program"), label: "New program", children: [] },
    ]);
    setProgramIdx(tree.length);
    setSectionIdx("");
    setTopicIdx("");
    setDirty(true);
  }

  function handleAddSection() {
    if (!programPath.length) return;
    patchNode(programPath, (node) => ({
      ...node,
      children: [
        ...(node.children ?? []),
        { id: newNodeId("section"), label: "New section", children: [] },
      ],
    }));
    setSectionIdx(sections.length);
    setTopicIdx("");
  }

  function handleDeleteProgram(index: number) {
    const target = tree[index];
    if (!target) return;
    if (
      !window.confirm(
        t("admin.curriculum.confirmDeleteNode", { label: target.label })
      )
    ) {
      return;
    }

    setTree((prev) => deleteNodeAtPath(prev, [index]));
    setDirty(true);

    if (programIdx === index) {
      setProgramIdx(Math.max(0, index - 1));
      setSectionIdx("");
      setTopicIdx("");
    } else if (programIdx > index) {
      setProgramIdx(programIdx - 1);
    }
  }

  function handleDeleteSection(index: number) {
    const target = sections[index];
    if (!target) return;
    if (
      !window.confirm(
        t("admin.curriculum.confirmDeleteNode", { label: target.label })
      )
    ) {
      return;
    }

    setTree((prev) => deleteNodeAtPath(prev, [programIdx, index]));
    setDirty(true);

    if (sectionIdx === index) {
      setSectionIdx("");
      setTopicIdx("");
    } else if (sectionIdx !== "" && sectionIdx > index) {
      setSectionIdx(sectionIdx - 1);
    }
  }

  async function handleSave() {
    await updateCurriculum.mutateAsync(tree);
    setDirty(false);
  }

  async function handleReset() {
    if (!window.confirm(t("admin.curriculum.confirmReset"))) {
      return;
    }
    const res = await resetCurriculum.mutateAsync();
    if (res.data) {
      setTree(cloneTree(res.data));
      setDirty(false);
    }
  }

  const showSurahPicker =
    Boolean(program && section && programUsesSurahPicker(program.id));
  const showTajweedPicker =
    Boolean(program && section && programUsesTajweedPicker(program.id));
  const showGrammarPicker = Boolean(
    program && section && programUsesGrammarPicker(program.id, section.id)
  );

  return (
    <PageContainer>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
            {t("admin.curriculum.title")}
          </h1>
          <p className="hidden mt-1 text-sm text-portal-muted sm:block">
            {t("admin.curriculum.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="primary"
            onClick={handleAddProgram}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-dark px-4 text-white hover:bg-primary-dark/90"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("admin.curriculum.addProgram")}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={resetCurriculum.isPending}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("admin.curriculum.resetDefaults")}</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            disabled={!dirty || updateCurriculum.isPending}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary bg-primary/10 px-4 text-primary-dark hover:bg-primary/15 disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden />
            <span className="hidden sm:inline">
              {updateCurriculum.isPending ? t("admin.curriculum.saving") : t("admin.curriculum.saveChanges")}
            </span>
          </Button>
        </div>
      </div>

      <AdminCurriculumStatsGrid stats={stats} dirty={dirty} isLoading={isLoading} />

      {isLoading ? (
        <PageLoading label={t("admin.common.loadingCurriculum")} />
      ) : tree.length === 0 ? (
        <Card className="rounded-2xl border border-portal bg-portal-surface p-6 text-sm text-portal-muted">
          {t("admin.curriculum.emptyTree")}
        </Card>
      ) : (
        <>
          <AdminCurriculumDrillDown
            tree={tree}
            programIdx={programIdx}
            sectionIdx={sectionIdx}
            topicIdx={topicIdx}
            onProgramSelect={(index) => {
              setProgramIdx(index);
              setSectionIdx("");
              setTopicIdx("");
            }}
            onSectionSelect={(index) => {
              setSectionIdx(index);
              setTopicIdx("");
            }}
            onTopicSelect={setTopicIdx}
            onAddProgram={handleAddProgram}
            onAddSection={handleAddSection}
            onDeleteProgram={handleDeleteProgram}
            onDeleteSection={handleDeleteSection}
            programPath={programPath}
            sectionPath={sectionPath}
            topicPath={topicPath}
            showSurahPicker={showSurahPicker}
            showTajweedPicker={showTajweedPicker}
            showGrammarPicker={showGrammarPicker}
            selectedSurahs={selectedSurahs}
            selectedTajweedIds={selectedTajweedIds}
            selectedGrammarIds={selectedGrammarIds}
            onPatchNode={patchNode}
            onSurahSelection={handleSurahSelection}
            onTajweedSelection={handleTajweedSelection}
            onGrammarSelection={handleGrammarSelection}
          />

          <div className="grid grid-cols-1 items-start gap-3 xl:gap-4 xl:grid-cols-3 mt-4">
            <AdminCurriculumOverview tree={tree} />
            <AdminCurriculumActivity tree={tree} dirty={dirty} />
            <AdminCurriculumQuickActions
              dirty={dirty}
              saving={updateCurriculum.isPending}
              resetting={resetCurriculum.isPending}
              onSave={handleSave}
              onReset={handleReset}
              onExportCsv={() => exportCurriculumCsv(tree)}
            />
          </div>
        </>
      )}
    </PageContainer>
  );
}
