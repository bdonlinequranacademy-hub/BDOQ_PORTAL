import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import { normalizeProgramId } from "@/lib/curriculumCatalog";

export interface CurriculumNode {
  id: string;
  label: string;
  labelBn?: string;
  children?: CurriculumNode[];
}

export interface CurriculumPath {
  programId: string;
  unitId?: string;
  topicId?: string;
}

export interface CurriculumAssignment extends CurriculumPath {
  completed?: boolean;
  completedAt?: string;
  curriculumLabels?: CurriculumLabels;
}

export interface CurriculumLabels {
  program?: string;
  unit?: string;
  topic?: string;
}

export const curriculumApi = {
  getTree: (params?: { studentId?: string; classId?: string }) =>
    apiClient
      .get<ApiResponse<CurriculumNode[]>>("/curriculum/tree", { params })
      .then((r) => r.data),
};

export function formatCurriculumPath(
  labels?: CurriculumLabels,
  path?: CurriculumPath
): string {
  if (labels?.program) {
    return [labels.program, labels.unit, labels.topic].filter(Boolean).join(" › ");
  }
  if (!path?.programId) return "";
  return [path.programId, path.unitId, path.topicId].filter(Boolean).join(" › ");
}

export function flattenPrograms(tree: CurriculumNode[]) {
  return tree.map((p) => ({ id: p.id, label: p.label }));
}

export function matchesProgramFilter(
  programId: string | undefined,
  filterProgramId: string
) {
  if (!filterProgramId) return true;
  if (!programId) return false;
  return normalizeProgramId(programId) === normalizeProgramId(filterProgramId);
}
