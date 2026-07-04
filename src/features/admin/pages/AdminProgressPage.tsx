import { useMemo, useState } from "react";
import { useAdminProgress } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { formatCurriculumPath, matchesProgramFilter } from "@/lib/api/curriculumApi";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";

import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
export function AdminProgressPage() {
  const [programFilter, setProgramFilter] = useState("");
  const { data: records = [], isLoading } = useAdminProgress();
  const { data: curriculumTree = [] } = useCurriculumTree();

  const missingProgramCount = useMemo(
    () => records.filter((r) => !r.curriculumProgram).length,
    [records]
  );

  const visibleRecords = useMemo(
    () => records.filter((r) => matchesProgramFilter(r.curriculumProgram, programFilter)),
    [records, programFilter]
  );

  const avgTajweed =
    visibleRecords.length > 0
      ? Math.round(
          visibleRecords.reduce((s, r) => s + (r.tajweedScore ?? 0), 0) / visibleRecords.length
        )
      : 0;

  const pagination = usePaginatedList(visibleRecords, {
    resetDeps: [programFilter],
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">
            Progress Analytics
          </h1>
          <p className="text-sm text-zinc-500">Student Quran progress across the academy</p>
        </div>
        <CurriculumProgramFilter
          tree={curriculumTree}
          value={programFilter}
          onChange={setProgramFilter}
        />
      </div>

      {missingProgramCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-800">
            {missingProgramCount} progress record{missingProgramCount === 1 ? "" : "s"} without a
            study program — teachers should re-save progress with a program selected.
          </p>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 p-4 shadow-sm">
          <span className="text-xs text-zinc-400">Records</span>
          <p className="text-2xl font-bold text-primary-dark">{visibleRecords.length}</p>
        </Card>
        <Card className="rounded-2xl border-0 p-4 shadow-sm">
          <span className="text-xs text-zinc-400">Avg. Tajweed</span>
          <p className="text-2xl font-bold text-gold">{avgTajweed}%</p>
        </Card>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : visibleRecords.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-zinc-400">
            {records.length === 0 ? "No progress records yet." : "No records for this program."}
          </p>
        </Card>
      ) : (
        <>
        <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
          <div className="hidden border-b border-zinc-100 bg-zinc-50 px-5 py-3 md:grid md:grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr] md:text-xs md:font-semibold md:uppercase md:text-zinc-500">
            <span>Student</span>
            <span>Class</span>
            <span>Program</span>
            <span>Tajweed</span>
            <span>Surahs</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {pagination.paginatedItems.map((r) => (
              <div
                key={r._id}
                className="flex flex-col gap-2 p-4 md:grid md:grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr] md:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-dark">{r.student?.name ?? "—"}</p>
                  <p className="text-xs text-zinc-400 md:hidden">{r.class?.title}</p>
                </div>
                <p className="hidden text-sm text-zinc-600 md:block">
                  {r.class?.title ?? "—"}
                </p>
                <div className="text-sm">
                  {r.curriculumLabels?.program ? (
                    <span className="text-gold">
                      {formatCurriculumPath(r.curriculumLabels)}
                    </span>
                  ) : (
                    <MissingCurriculumBadge />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 md:max-w-24">
                    <div
                      className="h-full rounded-full bg-[#C4922B]"
                      style={{ width: `${r.tajweedScore ?? 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary-dark">
                    {r.tajweedScore ?? 0}%
                  </span>
                </div>
                <span className="text-sm text-zinc-500">
                  {r.surahsMemorized?.length ?? 0} surahs
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Pagination pagination={pagination} itemLabel="records" />
        </>
      )}
    </PageContainer>
  );
}
