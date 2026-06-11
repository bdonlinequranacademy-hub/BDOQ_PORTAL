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
import { formControlClass } from "@/lib/formControl";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import {
  GRAMMAR_LESSON_CATALOG,
  SELECTABLE_SURAHS,
  TAJWEED_RULE_CATALOG,
  isSurahTopicId,
  programUsesGrammarPicker,
  programUsesSurahPicker,
  programUsesTajweedPicker,
  surahNameFromTopicId,
  surahTopicId,
} from "@/lib/curriculumCatalog";

function cloneTree(nodes: CurriculumNode[]): CurriculumNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

function newNodeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function updateNodeAtPath(
  nodes: CurriculumNode[],
  path: number[],
  updater: (node: CurriculumNode) => CurriculumNode
): CurriculumNode[] {
  if (path.length === 0) return nodes;
  const [index, ...rest] = path;
  return nodes.map((node, i) => {
    if (i !== index) return node;
    if (rest.length === 0) return updater(node);
    return {
      ...node,
      children: updateNodeAtPath(node.children ?? [], rest, updater),
    };
  });
}

function CatalogMultiSelect({
  label,
  hint,
  options,
  selectedIds,
  onChange,
}: {
  label: string;
  hint: string;
  options: { id: string; label: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-[#03214F]">{label}</p>
        <p className="text-xs text-zinc-500">{hint}</p>
      </div>
      <select
        multiple
        size={8}
        value={selectedIds}
        onChange={(e) => {
          const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
          onChange(ids);
        }}
        className={`${formControlClass} min-h-[10rem]`}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-zinc-400">Hold Ctrl (Windows) or ⌘ (Mac) to select multiple.</p>
    </div>
  );
}

export function AdminCurriculumPage() {
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
  const topics = section?.children ?? [];
  const topic =
    topicIdx !== "" && topics[topicIdx] ? topics[topicIdx] : null;

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
      .map((c) => surahNameFromTopicId(c.id))
      .filter((n): n is string => Boolean(n));
  }, [section]);

  const selectedTajweedIds = useMemo(() => {
    if (!section) return [];
    return (section.children ?? []).map((c) => c.id);
  }, [section]);

  const selectedGrammarIds = useMemo(() => {
    if (!section) return [];
    return (section.children ?? []).map((c) => c.id);
  }, [section]);

  function patchNode(path: number[], updater: (node: CurriculumNode) => CurriculumNode) {
    setTree((prev) => updateNodeAtPath(prev, path, updater));
    setDirty(true);
  }

  function syncSectionChildren(path: number[], children: CurriculumNode[]) {
    patchNode(path, (node) => ({ ...node, children }));
  }

  function handleSurahSelection(names: string[]) {
    if (!sectionPath || !section) return;
    const other = (section.children ?? []).filter((c) => !isSurahTopicId(c.id));
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
      const item = TAJWEED_RULE_CATALOG.find((r) => r.id === id);
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
      const item = GRAMMAR_LESSON_CATALOG.find((r) => r.id === id);
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

  async function handleSave() {
    await updateCurriculum.mutateAsync(tree);
    setDirty(false);
  }

  async function handleReset() {
    if (!window.confirm("Reset curriculum to factory defaults? This cannot be undone.")) return;
    const res = await resetCurriculum.mutateAsync();
    if (res.data) {
      setTree(cloneTree(res.data));
      setDirty(false);
    }
  }

  const showSurahPicker =
    program && section && programUsesSurahPicker(program.id);
  const showTajweedPicker =
    program && section && programUsesTajweedPicker(program.id);
  const showGrammarPicker =
    program &&
    section &&
    programUsesGrammarPicker(program.id, section.id);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Curriculum</h1>
          <p className="text-sm text-zinc-500">
            Pick program → section → manage surahs, tajweed rules, or grammar from dropdowns.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={handleAddProgram} className="gap-2 rounded-xl">
            <Plus className="size-4" />
            Add program
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={resetCurriculum.isPending}
            className="gap-2 rounded-xl"
          >
            <RotateCcw className="size-4" />
            Reset defaults
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!dirty || updateCurriculum.isPending}
            className="gap-2 rounded-xl bg-[#03214F] text-white"
          >
            <Save className="size-4" />
            {updateCurriculum.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading curriculum…</p>
      ) : tree.length === 0 ? (
        <Card className="rounded-2xl p-6 text-sm text-zinc-500">
          No curriculum loaded. Click Reset defaults.
        </Card>
      ) : (
        <Card className="flex flex-col gap-5 rounded-2xl border-0 p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[#03214F]">Program</span>
              <select
                value={programIdx}
                onChange={(e) => {
                  setProgramIdx(Number(e.target.value));
                  setSectionIdx("");
                  setTopicIdx("");
                }}
                className={formControlClass}
              >
                {tree.map((p, i) => (
                  <option key={p.id} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[#03214F]">Section</span>
              <select
                value={sectionIdx === "" ? "" : sectionIdx}
                onChange={(e) => {
                  setSectionIdx(e.target.value === "" ? "" : Number(e.target.value));
                  setTopicIdx("");
                }}
                className={formControlClass}
              >
                <option value="">Select section…</option>
                {sections.map((s, i) => (
                  <option key={s.id} value={i}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            {!showSurahPicker && !showTajweedPicker && !showGrammarPicker ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-[#03214F]">Topic</span>
                <select
                  value={topicIdx === "" ? "" : topicIdx}
                  onChange={(e) =>
                    setTopicIdx(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className={formControlClass}
                  disabled={!section}
                >
                  <option value="">Select topic…</option>
                  {topics.map((t, i) =>
                    isSurahTopicId(t.id) ? null : (
                      <option key={t.id} value={i}>
                        {t.label}
                      </option>
                    )
                  )}
                </select>
              </label>
            ) : null}
          </div>

          {program ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
              <p className="mb-3 text-xs font-semibold uppercase text-zinc-400">Edit labels</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Program name (EN)</span>
                  <input
                    value={program.label}
                    onChange={(e) =>
                      patchNode(programPath, (n) => ({ ...n, label: e.target.value }))
                    }
                    className={formControlClass}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Program name (BN)</span>
                  <input
                    value={program.labelBn ?? ""}
                    onChange={(e) =>
                      patchNode(programPath, (n) => ({
                        ...n,
                        labelBn: e.target.value || undefined,
                      }))
                    }
                    className={formControlClass}
                  />
                </label>
              </div>
            </div>
          ) : null}

          {section && sectionPath ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Section name (EN)</span>
                  <input
                    value={section.label}
                    onChange={(e) =>
                      patchNode(sectionPath, (n) => ({ ...n, label: e.target.value }))
                    }
                    className={formControlClass}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Section name (BN)</span>
                  <input
                    value={section.labelBn ?? ""}
                    onChange={(e) =>
                      patchNode(sectionPath, (n) => ({
                        ...n,
                        labelBn: e.target.value || undefined,
                      }))
                    }
                    className={formControlClass}
                  />
                </label>
              </div>

              {showSurahPicker ? (
                <CatalogMultiSelect
                  label="Surahs in this track"
                  hint="Select surahs — students & homework will pick from this list."
                  options={SELECTABLE_SURAHS.map((s) => ({ id: s, label: s }))}
                  selectedIds={selectedSurahs}
                  onChange={(names) => handleSurahSelection(names)}
                />
              ) : null}

              {showTajweedPicker ? (
                <CatalogMultiSelect
                  label="Tajweed rules in this category"
                  hint="Select rules for this tajweed category."
                  options={TAJWEED_RULE_CATALOG}
                  selectedIds={selectedTajweedIds}
                  onChange={handleTajweedSelection}
                />
              ) : null}

              {showGrammarPicker ? (
                <CatalogMultiSelect
                  label="Grammar lessons"
                  hint="Select nahw / grammar topics for this section."
                  options={GRAMMAR_LESSON_CATALOG}
                  selectedIds={selectedGrammarIds}
                  onChange={handleGrammarSelection}
                />
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddSection}
              className="self-start text-sm font-semibold text-[#C4922B]"
            >
              + Add section to this program
            </button>
          )}

          {topic && topicPath && !isSurahTopicId(topic.id) ? (
            <div className="rounded-xl border border-dashed border-zinc-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-zinc-400">Topic detail</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Topic (EN)</span>
                  <input
                    value={topic.label}
                    onChange={(e) =>
                      patchNode(topicPath, (n) => ({ ...n, label: e.target.value }))
                    }
                    className={formControlClass}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">Topic (BN)</span>
                  <input
                    value={topic.labelBn ?? ""}
                    onChange={(e) =>
                      patchNode(topicPath, (n) => ({
                        ...n,
                        labelBn: e.target.value || undefined,
                      }))
                    }
                    className={formControlClass}
                  />
                </label>
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </PageContainer>
  );
}
