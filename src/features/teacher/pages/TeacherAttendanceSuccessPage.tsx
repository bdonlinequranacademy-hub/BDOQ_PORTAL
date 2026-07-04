import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Users, UserCheck, UserX, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TeacherAttendanceSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const present = Number(params.get("present") ?? 0);
  const absent = Number(params.get("absent") ?? 0);
  const late = Number(params.get("late") ?? 0);
  const total = present + absent + late;
  const date = params.get("date") ?? new Date().toISOString().split("T")[0];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-12 lg:min-h-[60vh]">
      {/* Success icon */}
      <div className="flex flex-col items-center gap-4">
        <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="size-10 text-emerald-600" />
        </div>
        <div className="text-center flex flex-col gap-1">
          <h1 className="font-bold text-primary-dark text-2xl">
            Attendance Saved!
          </h1>
          <p className="text-zinc-500 text-sm">
            {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_10px_30px_-12px_rgba(3,33,79,0.15)] lg:max-w-lg">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-primary-dark" />
          <span className="font-bold text-primary-dark text-base">Session Summary</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-emerald-50 flex flex-col items-center py-4 gap-1">
            <UserCheck className="size-5 text-emerald-600 mb-1" />
            <span className="font-bold text-emerald-600 text-xl">{present}</span>
            <span className="text-zinc-400 text-xs">Present</span>
          </div>
          <div className="rounded-2xl bg-red-50 flex flex-col items-center py-4 gap-1">
            <UserX className="size-5 text-red-500 mb-1" />
            <span className="font-bold text-red-500 text-xl">{absent}</span>
            <span className="text-zinc-400 text-xs">Absent</span>
          </div>
          <div className="rounded-2xl bg-amber-50 flex flex-col items-center py-4 gap-1">
            <Clock className="size-5 text-amber-500 mb-1" />
            <span className="font-bold text-amber-500 text-xl">{late}</span>
            <span className="text-zinc-400 text-xs">Late</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#EEF2F8] flex items-center justify-between px-4 py-3">
          <span className="text-primary-dark text-sm font-medium">Attendance rate</span>
          <span className="font-bold text-primary-dark text-sm">
            {total > 0 ? Math.round((present / total) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <Button
          onClick={() => navigate("/teacher")}
          className="rounded-xl bg-primary-dark text-white font-semibold w-full h-12"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() => navigate("/teacher/attendance")}
          variant="ghost"
          className="rounded-xl border border-zinc-200 text-zinc-600 font-semibold w-full h-12"
        >
          Mark Another Class
        </Button>
      </div>
    </div>
  );
}
