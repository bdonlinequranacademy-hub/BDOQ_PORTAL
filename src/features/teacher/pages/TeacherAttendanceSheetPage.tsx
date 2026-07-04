import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, CheckCircle, GraduationCap, Clock, Users } from "lucide-react";
import {
  useTeacherClass,
  useTeacherStudents,
  useMarkAttendance,
  useClassAttendance,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { AttendanceStatus } from "@/types/models";

const AVATAR_COLORS = [
  "bg-primary-dark",
  "bg-teal-600",
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-purple-500",
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function TeacherAttendanceSheetPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const classId = params.get("classId") ?? "";
  const date = params.get("date") ?? new Date().toISOString().split("T")[0];

  const { data: cls } = useTeacherClass(classId);
  const { data: allStudents = [] } = useTeacherStudents();
  const { data: existingAttendance = [] } = useClassAttendance(classId, date);
  const markAttendance = useMarkAttendance();

  const students = allStudents.filter((s) =>
    s.classes?.some((c) => c._id === classId)
  );

  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    if (existingAttendance.length === 0) return;
    setStatuses((prev) => {
      const next = { ...prev };
      for (const entry of existingAttendance) {
        next[entry.studentId] = entry.status;
      }
      return next;
    });
  }, [existingAttendance]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = Object.values(statuses).filter((v) => v === "present").length;
  const absentCount = Object.values(statuses).filter((v) => v === "absent").length;
  const lateCount = Object.values(statuses).filter((v) => v === "late").length;
  const markedCount = presentCount + absentCount + lateCount;
  const total = students.length;
  const pct = total > 0 ? Math.round((markedCount / total) * 100) : 0;

  function toggle(studentId: string, status: AttendanceStatus) {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? undefined as unknown as AttendanceStatus : status,
    }));
  }

  async function handleSubmit() {
    const attendances = students.map((s) => ({
      studentId: s._id,
      status: statuses[s._id] ?? ("present" as AttendanceStatus),
    }));
    await markAttendance.mutateAsync({ classId, date, attendances });
    navigate(
      `/teacher/attendance/success?classId=${classId}&date=${date}&present=${presentCount}&absent=${absentCount}&late=${lateCount}`
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="size-10 rounded-full bg-zinc-100 text-primary-dark flex items-center justify-center"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="font-bold text-primary-dark text-lg">Mark Attendance</h1>
        <button
          onClick={handleSubmit}
          className="font-semibold text-gold text-sm px-2"
        >
          Save
        </button>
        </div>
      </div>

      <PageContainer className="flex flex-col gap-6 pb-16">
        {/* Class banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#03214F] to-[#0a3a7a] text-white p-6 overflow-hidden">
          <div className="size-28 rounded-full bg-white/10 absolute -right-8 -top-8" />
          <div className="relative flex flex-col gap-3">
            <span className="font-semibold rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1.5 self-start px-2.5 py-1">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live Now
            </span>
            <h2 className="font-bold text-xl leading-7">
              {cls?.name ?? "Loading…"}
            </h2>
            <div className="text-white/80 text-sm flex items-center gap-2">
              <GraduationCap className="size-4" />
              <span>{cls?.teacherName ?? "Teacher"}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <div className="text-white/80 text-sm flex items-center gap-2">
                <Clock className="size-4" />
                <span>{cls?.schedule?.[0]?.time ?? "–"}</span>
              </div>
              <span className="font-semibold rounded-full bg-white/10 text-white text-xs flex items-center gap-1.5 px-3 py-1">
                <Users className="size-3.5" />
                {total} Students
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="rounded-3xl border-0 shadow-sm p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary-dark text-sm">
              Marked: {markedCount} of {total}
            </span>
            <span className="font-bold text-teal-600 text-sm">{pct}%</span>
          </div>
          {existingAttendance.length > 0 ? (
            <p className="text-xs font-medium text-emerald-700">
              Saved attendance loaded for {date}
            </p>
          ) : null}
          <div className="rounded-full bg-zinc-100 w-full h-2.5 overflow-hidden">
            <div
              className="rounded-full bg-teal-600 h-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="rounded-xl bg-emerald-50 flex flex-col items-center py-2 gap-1">
              <span className="font-bold text-emerald-600 text-lg">{presentCount}</span>
              <span className="text-zinc-400 text-xs">Present</span>
            </div>
            <div className="rounded-xl bg-red-50 flex flex-col items-center py-2 gap-1">
              <span className="font-bold text-red-600 text-lg">{absentCount}</span>
              <span className="text-zinc-400 text-xs">Absent</span>
            </div>
            <div className="rounded-xl bg-amber-50 flex flex-col items-center py-2 gap-1">
              <span className="font-bold text-amber-600 text-lg">{lateCount}</span>
              <span className="text-zinc-400 text-xs">Late</span>
            </div>
          </div>
        </Card>

        {/* Student list */}
        <Card className="rounded-3xl border-0 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5">
            <Search className="size-4 text-zinc-400" />
            <input
              placeholder="Search students…"
              className="bg-transparent outline-none text-sm flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            {filtered.map((student, i) => {
              const current = statuses[student._id];
              return (
                <div
                  key={student._id}
                  className={`flex items-center gap-3 py-3 ${
                    i > 0 ? "border-t border-zinc-100" : ""
                  }`}
                >
                  <div
                    className={`size-11 shrink-0 font-bold rounded-full ${
                      AVATAR_COLORS[i % AVATAR_COLORS.length]
                    } text-white text-sm flex items-center justify-center`}
                  >
                    {initials(student.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-primary-dark text-sm">
                      {student.name}
                    </p>
                    <p className="text-zinc-400 text-xs">{student.email}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {(["present", "late", "absent"] as AttendanceStatus[]).map((s) => {
                      const active = current === s;
                      const colors = {
                        present: active ? "bg-teal-600 text-white" : "bg-zinc-100 text-zinc-500",
                        late: active ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-500",
                        absent: active ? "bg-red-500 text-white" : "bg-zinc-100 text-zinc-500",
                      };
                      return (
                        <button
                          key={s}
                          onClick={() => toggle(student._id, s)}
                          className={`min-h-11 font-bold rounded-lg text-sm flex items-center justify-center w-9 transition ${colors[s]}`}
                        >
                          {s === "present" ? "P" : s === "late" ? "L" : "A"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={markAttendance.isPending}
            className="rounded-xl bg-primary-dark text-white font-semibold gap-2 w-full h-12 mt-2"
          >
            <CheckCircle className="size-5" />
            {markAttendance.isPending ? "Saving…" : "Submit Attendance"}
          </Button>
        </Card>
      </PageContainer>
    </div>
  );
}
