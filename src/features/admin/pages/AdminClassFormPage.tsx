import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useAdminClass,
  useAdminUsers,
  useCreateClass,
  useUpdateClass,
  useAdminUserProfile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formControlClass } from "@/lib/formControl";
import { CLASS_WEEK_DAYS, toTimeInputValue } from "@/lib/utils/schedule";
import { toast } from "@/stores/uiStore";
import type { ClassSchedule } from "@/types/models";
import type { CurriculumPath } from "@/lib/api/curriculumApi";
import { NestedCurriculumSelect, useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const DURATION_OPTIONS = [30, 45, 60, 90] as const;

export function AdminClassFormPage() {
  const { t } = usePortalTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useAdminClass(isEdit ? id! : "");
  const { data: teachers = [] } = useAdminUsers("teacher");
  const { data: students = [] } = useAdminUsers("student");
  const activeTeachers = teachers.filter((user) => user.isActive !== false);
  const createClass = useCreateClass();
  const updateClass = useUpdateClass(id ?? "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduleDay, setScheduleDay] = useState<ClassSchedule["day"]>("Monday");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleDuration, setScheduleDuration] = useState<number>(60);
  const [scheduleRepeatWeekly, setScheduleRepeatWeekly] = useState(true);
  const [sessionRateBdt, setSessionRateBdt] = useState("500");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumPath>({ programId: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const { data: curriculumTree = [], isLoading: treeLoading } = useCurriculumTree();

  const { data: selectedStudentProfile } = useAdminUserProfile(
    !isEdit && selectedStudents.length === 1 ? selectedStudents[0] : ""
  );

  const lastAutoFilledStudentId = useRef<string>("");

  useEffect(() => {
    if (!isEdit && selectedStudentProfile?.kind === "student" && (selectedStudentProfile.enrollment || selectedStudentProfile.applicationData)) {
      if (selectedStudentProfile.user.id === lastAutoFilledStudentId.current) {
        return; // Already auto-filled for this student
      }
      
      // Wait for reference data to load so we can match dropdowns correctly
      if (teachers.length === 0 || treeLoading) {
        return;
      }

      lastAutoFilledStudentId.current = selectedStudentProfile.user.id;
      
      const enr = selectedStudentProfile.enrollment;
      const appData = selectedStudentProfile.applicationData as any;
      
      const teacherName = enr?.assignedTeacherName || appData?.assignedTeacherName || appData?.assignedTeacherSlug;
      if (teacherName) {
        const match = teachers.find(t => 
          t.name.toLowerCase() === teacherName.toLowerCase() || 
          t.name.toLowerCase().includes(teacherName.toLowerCase()) || 
          teacherName.toLowerCase().includes(t.name.toLowerCase())
        );
        if (match) setTeacherId(match.id);
      }
      
      if (enr?.meetingLink || appData?.meetingLink) {
        setMeetingLink(enr?.meetingLink || appData?.meetingLink || "");
      }
      if (enr?.classDays && enr.classDays.length > 0) {
        setScheduleDay(enr.classDays[0] as ClassSchedule["day"]);
      }
      if (enr?.classDurationMinutes) {
        setScheduleDuration(enr.classDurationMinutes);
      }
      if (enr?.classTime) {
        const [hourRaw, minuteRaw] = enr.classTime.split(":");
        const hour = hourRaw?.padStart(2, "0");
        const minute = minuteRaw?.split(" ")[0]?.padStart(2, "0"); 
        if (hour && minute) {
           setScheduleTime(`${hour}:${minute}`);
        }
      }
      if (enr?.monthlyFeeAmount) {
        setSessionRateBdt(String(enr.monthlyFeeAmount));
      }

      const topicName = appData?.program || appData?.topics || enr?.packagePlan;
      if (topicName && curriculumTree.length > 0) {
        const progMatch = curriculumTree.find(
          p => p.label.toLowerCase() === String(topicName).toLowerCase() || 
               String(topicName).toLowerCase().includes(p.label.toLowerCase()) ||
               p.label.toLowerCase().includes(String(topicName).toLowerCase())
        );
        if (progMatch) setCurriculum({ programId: progMatch.id });
      }
    }
  }, [selectedStudentProfile, isEdit, teachers, curriculumTree, treeLoading]);

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
      setScheduleRepeatWeekly(existing.schedule.repeatWeekly !== false);
    }
    if (existing.curriculum) {
      setCurriculum({
        programId: existing.curriculum.programId,
        unitId: existing.curriculum.unitId,
        topicId: existing.curriculum.topicId,
      });
    }
    const enrolled = existing.students ?? [];
    if (enrolled.length && typeof enrolled[0] === "object") {
      setSelectedStudents((enrolled as { _id: string }[]).map((s) => s._id));
    }
  }, [existing, isEdit]);

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
      repeatWeekly: scheduleRepeatWeekly,
    };
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      teacherId,
      studentIds: selectedStudents,
      schedule,
      curriculum: curriculum.programId ? curriculum : undefined,
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

  const isStudentProfile = selectedStudentProfile?.kind === "student";
  const stEnrollment = isStudentProfile ? selectedStudentProfile.enrollment : null;
  const stAppData = isStudentProfile ? (selectedStudentProfile.applicationData as any) : null;
  const hasProfileData = isStudentProfile && (stEnrollment || stAppData);

  return (
    <PageContainer className="flex max-w-3xl flex-col gap-6" size="narrow">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5 text-primary-dark" />
        </button>
        <h1 className="text-xl font-bold text-primary-dark">
          {isEdit ? t("admin.classForm.editTitle") : t("admin.classForm.createTitle")}
        </h1>
      </div>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-primary-dark text-sm">Auto-fill from Admission Application</span>
          <select
            value={selectedStudents[0] || ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedStudents(val ? [val] : []);
            }}
            className={formControlClass}
          >
            <option value="">Select a student...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.email ? `(${s.email})` : ""}
              </option>
            ))}
          </select>
        </div>

        {hasProfileData && (
          <div className="flex flex-col gap-3 rounded-xl border border-[#C4922B]/30 bg-[#C4922B]/10 p-4 text-sm">
            <p className="font-semibold text-[#C4922B]">Student Preferences:</p>
            <ul className="list-inside list-disc flex flex-col gap-1">
              <li>
                <span className="font-medium text-portal-contrast">Topics:</span>{" "}
                {String(stAppData?.program || stAppData?.topics || stEnrollment?.packagePlan || "N/A")}
              </li>
              <li>
                <span className="font-medium text-portal-contrast">Preferred Days:</span>{" "}
                {stEnrollment?.classDays?.join(", ") || "N/A"}
              </li>
            </ul>
            <p className="text-xs text-zinc-500 mt-1">
              Note: A class can only be scheduled for one recurring day. If the student requested multiple days, you will need to create separate classes for each day.
            </p>
            
            {(stEnrollment?.classesPerWeek ?? 0) > 1 && (
              <div className="mt-2 flex gap-2 rounded-lg bg-[#C4922B]/10 p-3 text-xs font-medium text-[#9A6B1A]">
                <span>⚠️</span>
                <span>
                  This student requested {stEnrollment?.classesPerWeek} classes per week. You will need to create {stEnrollment?.classesPerWeek} separate class routines.
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

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
            className={`${formControlClass} min-h-20 resize-none`}
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
              {(teacherId && !activeTeachers.some((user) => user.id === teacherId)
                ? teachers.filter((user) => user.id === teacherId || user.isActive !== false)
                : activeTeachers
              ).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Curriculum (Study Plan)</label>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              {treeLoading ? (
                <PageLoading compact label="Loading study plan..." />
              ) : (
                <NestedCurriculumSelect
                  tree={curriculumTree}
                  value={curriculum}
                  onChange={setCurriculum}
                />
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#C4922B]/25 bg-[#C4922B]/10 p-4">
            <p className="text-sm font-semibold text-primary-dark">Class schedule</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              Pick the day and time for this class (Bangladesh time). This appears on the
              Routine page for each enrolled student.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-500">Day</label>
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value as ClassSchedule["day"])}
                  className={formControlClass}
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
                checked={scheduleRepeatWeekly}
                onChange={(e) => setScheduleRepeatWeekly(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300"
              />
              <span className="text-sm text-primary-dark">
                Repeat every {scheduleDay}
                <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                  When checked, the class runs every week on this day. When unchecked, only
                  once on the next upcoming {scheduleDay}.
                </span>
              </span>
            </label>
            <p className="mt-3 text-xs font-medium text-[#9A6B1A]">
              {scheduleRepeatWeekly
                ? `Repeats every ${scheduleDay} at ${scheduleTime} (BD) · ${scheduleDuration} min`
                : `One session on ${scheduleDay} at ${scheduleTime} (BD) · ${scheduleDuration} min`}
            </p>
          </div>

          <Input
            placeholder="https://meet.google.com/abc-defg-hij"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
          <p className="text-xs text-zinc-500">
            Use a full URL starting with https:// (Zoom, Google Meet, etc.). Links without https://
            may open incorrectly inside the portal.
          </p>
          <Input
            type="number"
            min={0}
            placeholder="Session rate (BDT)"
            value={sessionRateBdt}
            onChange={(e) => setSessionRateBdt(e.target.value)}
          />
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
          className="h-12 rounded-xl bg-primary-dark text-white"
        >
          {isEdit ? t("admin.classForm.saveChanges") : t("admin.classForm.createClass")}
        </Button>
    </PageContainer>
  );
}
