import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { isSurahTopicId } from "@/lib/curriculumCatalog";

export type CurriculumRowType = "program" | "section" | "topic" | "surah";
export type CurriculumTab = "all" | "programs" | "sections" | "topics" | "surahs";

export interface ICurriculumRow {
  id: string;
  type: CurriculumRowType;
  label: string;
  labelBn?: string;
  programLabel: string;
  sectionLabel?: string;
  childCount: number;
  path: number[];
}

export interface ICurriculumStats {
  programs: number;
  sections: number;
  topics: number;
  surahs: number;
  withBengali: number;
}

export function cloneTree(nodes: CurriculumNode[]): CurriculumNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

export function newNodeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function deleteNodeAtPath(
  nodes: CurriculumNode[],
  path: number[]
): CurriculumNode[] {
  if (path.length === 0) return nodes;
  if (path.length === 1) {
    return nodes.filter((_, index) => index !== path[0]);
  }
  const [index, ...rest] = path;
  return nodes.map((node, nodeIndex) => {
    if (nodeIndex !== index) return node;
    return {
      ...node,
      children: deleteNodeAtPath(node.children ?? [], rest),
    };
  });
}

export function updateNodeAtPath(
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

export function computeCurriculumStats(tree: CurriculumNode[]): ICurriculumStats {
  let sections = 0;
  let topics = 0;
  let surahs = 0;
  let withBengali = 0;

  for (const program of tree) {
    if (program.labelBn) withBengali += 1;
    for (const section of program.children ?? []) {
      sections += 1;
      if (section.labelBn) withBengali += 1;
      for (const child of section.children ?? []) {
        if (isSurahTopicId(child.id)) {
          surahs += 1;
        } else {
          topics += 1;
        }
        if (child.labelBn) withBengali += 1;
      }
    }
  }

  return {
    programs: tree.length,
    sections,
    topics,
    surahs,
    withBengali,
  };
}

export function flattenCurriculumTree(tree: CurriculumNode[]): ICurriculumRow[] {
  const rows: ICurriculumRow[] = [];

  tree.forEach((program, programIdx) => {
    rows.push({
      id: program.id,
      type: "program",
      label: program.label,
      labelBn: program.labelBn,
      programLabel: program.label,
      childCount: program.children?.length ?? 0,
      path: [programIdx],
    });

    (program.children ?? []).forEach((section, sectionIdx) => {
      rows.push({
        id: section.id,
        type: "section",
        label: section.label,
        labelBn: section.labelBn,
        programLabel: program.label,
        sectionLabel: section.label,
        childCount: section.children?.length ?? 0,
        path: [programIdx, sectionIdx],
      });

      (section.children ?? []).forEach((topic, topicIdx) => {
        rows.push({
          id: topic.id,
          type: isSurahTopicId(topic.id) ? "surah" : "topic",
          label: topic.label,
          labelBn: topic.labelBn,
          programLabel: program.label,
          sectionLabel: section.label,
          childCount: 0,
          path: [programIdx, sectionIdx, topicIdx],
        });
      });
    });
  });

  return rows;
}

export function rowTypeLabel(type: CurriculumRowType): string {
  switch (type) {
    case "program":
      return "Program";
    case "section":
      return "Section";
    case "topic":
      return "Topic";
    case "surah":
      return "Surah";
  }
}

export function rowTypeStyles(type: CurriculumRowType): string {
  switch (type) {
    case "program":
      return "bg-primary/10 text-primary-dark";
    case "section":
      return "bg-teal/10 text-teal-700";
    case "topic":
      return "bg-amber-100 text-amber-800";
    case "surah":
      return "bg-violet-100 text-violet-800";
  }
}

export function filterCurriculumRows(
  rows: ICurriculumRow[],
  options: {
    search: string;
    programFilter: string;
    tab: CurriculumTab;
  }
): ICurriculumRow[] {
  const query = options.search.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesSearch =
      !query ||
      row.label.toLowerCase().includes(query) ||
      (row.labelBn?.toLowerCase().includes(query) ?? false) ||
      row.programLabel.toLowerCase().includes(query) ||
      (row.sectionLabel?.toLowerCase().includes(query) ?? false) ||
      row.id.toLowerCase().includes(query);

    const matchesProgram =
      options.programFilter === "all" || row.programLabel === options.programFilter;

    const matchesTab =
      options.tab === "all" ||
      (options.tab === "programs" && row.type === "program") ||
      (options.tab === "sections" && row.type === "section") ||
      (options.tab === "topics" && row.type === "topic") ||
      (options.tab === "surahs" && row.type === "surah");

    return matchesSearch && matchesProgram && matchesTab;
  });
}

export function exportCurriculumFile(tree: CurriculumNode[], format: "json" | "csv"): void {
  const filename = `curriculum-${new Date().toISOString().slice(0, 10)}`;

  if (format === "json") {
    const blob = new Blob([JSON.stringify(tree, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${filename}.json`);
    return;
  }

  const rows = flattenCurriculumTree(tree);
  const header = ["Type", "Label", "Label (BN)", "Program", "Section", "ID", "Children"];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.type,
        csvEscape(row.label),
        csvEscape(row.labelBn ?? ""),
        csvEscape(row.programLabel),
        csvEscape(row.sectionLabel ?? ""),
        csvEscape(row.id),
        String(row.childCount),
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `${filename}.csv`);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
