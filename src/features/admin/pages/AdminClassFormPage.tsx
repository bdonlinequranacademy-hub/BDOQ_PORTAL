import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useAdminClass,
  useAdminUsers,
  useCreateClass,
  useUpdateClass,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formControlClass } from "@/lib/formControl";
import { CLASS_WEEK_DAYS, toTimeInputValue } from "@/lib/utils/schedule";
import { toast } from "@/stores/uiStore";
import type { ClassSchedule } from "@/types/models";

const DURATION_OPTIONS = [30, 45, 60, 90] as const;

export function AdminClassFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useAdminClass(isEdit ? id! : "");
  const { data: teachers = [] } = useAdminUsers("teacher");
  const { data: students = [] } = useAdminUsers("student");
  const createClass = useCreateClass();
  const updateClass = useUpdateClass(id ?? "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduleDay, setScheduleDay] = useState<ClassSchedule["day"]>("Monday");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleDuration, setScheduleDuration] = useState<number>(60);
  const [scheduleRepeatDaily, setScheduleRepeatDaily] = useState(false);
  const [sessionRateBdt, setSessionRateBdt] = useState("500");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing || !isEdit) return;
    setTitle(existing.title);
    setDescription(existing.description ?? "");
    const t = existing.teacher;
    setTeacherId(typeof t === "object" ? t._id : (t as string));
    setMeetingLink(existing.meetingLink ?? "");
    setSessionRateBdt(String(existing.sessionRateBdt ?? 500));
    if (existing.schedule) {
      setScheduleDay(existing.schedule.day);
      setScheduleTime(toTimeInputValue(existing.schedule.time));
      setScheduleDuration(existing.schedule.duration || 60);
      setScheduleRepeatDaily(existing.schedule.repeatDaily === true);
    }
    const enrolled = existing.students ?? [];
    if (enrolled.length && typeof enrolled[0] === "object") {
      setSelectedStudents((enrolled as { _id: string }[]).map((s) => s._id));
    }
  }, [existing, isEdit]);

  function toggleStudent(sid: string) {
    setSelectedStudents((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  }

  async function handleSubmit() {
    setFormError(null);

    if (!title.trim()) {
      setFormError("Class title is required.");
      return;
    }
    if (!teacherId) {
      setFormError("Please select a teacher.");
      return;
    }
    if (!scheduleTime) {
      setFormError("Please pick a weekly session time.");
      return;
    }

    const schedule: ClassSchedule = {
      day: scheduleDay,
      time: scheduleTime,
      duration: scheduleDuration,
      repeatDaily: scheduleRepeatDaily,
    };
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      teacherId,
      studentIds: selectedStudents,
      schedule,
      meetingLink: meetingLink.trim() || undefined,
      sessionRateBdt: Number(sessionRateBdt) || 500,
    };

    try {
      if (isEdit) {
        await updateClass.mutateAsync(payload);
        navigate(`/admin/classes/${id}`);
      } else {
        const res = await createClass.mutateAsync(payload);
        navigate(res.data?._id ? `/admin/classes/${res.data._id}` : "/admin/classes");
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Could not save class. Check all required fields and try again.";
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <PageContainer className="flex max-w-3xl flex-col gap-6" size="narrow">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5 text-[#03214F]" />
        </button>
        <h1 className="font-display text-xl font-bold text-[#03214F]">
          {isEdit ? "Edit Class" : "Create Class"}
        </h1>
      </div>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
          <Input
            placeholder="Class title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Optional — syllabus notes, level, or goals"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-20 resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none"
          />
          <p className="-mt-2 text-xs text-zinc-500">Description is optional.</p>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Teacher</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className={formControlClass}
            >
              <option value="">Select teacher…</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-[#C4922B]/25 bg-[#FDF3E0]/40 p-4">
            <p className="text-sm font-semibold text-[#03214F]">Class schedule</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              {scheduleRepeatDaily
                ? "One session every day at the time you pick below (Bangladesh time). This appears on the Routine page for each enrolled student."
                : "One session per week on the day and time you pick below (Bangladesh time). This appears on the Routine page for each enrolled student."}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500">Day</label>
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value as ClassSchedule["day"])}
                  disabled={scheduleRepeatDaily}
                  className={`${formControlClass} disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400`}
                >
                  {CLASS_WEEK_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500">Start time (BD)</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className={formControlClass}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500">Duration</label>
                <select
                  value={scheduleDuration}
                  onChange={(e) => setScheduleDuration(Number(e.target.value))}
                  className={formControlClass}
                >
                  {DURATION_OPTIONS.map((mins) => (
                    <option key={mins} value={mins}>
                      {mins} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={scheduleRepeatDaily}
                onChange={(e) => setScheduleRepeatDaily(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300"
              />
              <span className="text-sm text-[#03214F]">
                Repeat every day at this time
                <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                  When checked, the class runs daily. When unchecked, only on the selected day.
                </span>
              </span>
            </label>
            <p className="mt-3 text-xs font-medium text-[#9A6B1A]">
              {scheduleRepeatDaily
                ? `Repeats every day at ${scheduleTime} (BD) · ${scheduleDuration} min`
                : `Repeats every ${scheduleDay} at ${scheduleTime} (BD) · ${scheduleDuration} min`}
            </p>
          </div>

          <Input
            placeholder="Meeting link (Zoom, etc.)"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
          <Input
            type="number"
            min={0}
            placeholder="Session rate (BDT)"
            value={sessionRateBdt}
            onChange={(e) => setSessionRateBdt(e.target.value)}
          />
        </Card>

        <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
          <span className="font-bold text-[#03214F] text-sm">Enroll Students</span>
          <p className="-mt-1 text-xs text-zinc-500">
            {scheduleRepeatDaily
              ? `Each student gets a routine slot every day at ${scheduleTime}.`
              : `Each student gets their own routine slot on ${scheduleDay}s at ${scheduleTime}.`}
          </p>
          <div className="max-h-48 overflow-y-auto flex flex-col gap-2">
            {students.map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-50"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                  className="rounded border-zinc-300"
                />
                <span className="text-sm text-[#03214F]">{s.name}</span>
              </label>
            ))}
          </div>
        </Card>

        {formError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        ) : null}

        <Button
          onClick={handleSubmit}
          disabled={
            !title.trim() ||
            !teacherId ||
            createClass.isPending ||
            updateClass.isPending
          }
          className="h-12 rounded-xl bg-[#03214F] text-white"
        >
          {isEdit ? "Save Changes" : "Create Class"}
        </Button>
    </PageContainer>
  );
}
