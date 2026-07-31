import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { useTeacherClasses } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DateInput } from "@/components/ui/DateInput";
import { Select } from "@/components/ui/Select";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function TeacherAttendancePage() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const [params] = useSearchParams();
  const { data: classes = [], isLoading } = useTeacherClasses();

  const [selectedClassId, setSelectedClassId] = useState(params.get("classId") ?? "");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const canProceed = Boolean(selectedClassId && selectedDate);

  function handleProceed() {
    navigate(`/teacher/attendance/sheet?classId=${selectedClassId}&date=${selectedDate}`);
  }

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{t("teacher.markAttendanceTitle")}</h1>
        <p className="text-sm text-zinc-500">{t("teacher.selectClassDate")}</p>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#03214F] to-[#0a3a7a] p-6 text-white">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
          <ClipboardCheck className="size-7 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold">{t("teacher.takeAttendance")}</span>
          <span className="text-sm text-white/70">{t("teacher.recordPresentAbsentLate")}</span>
        </div>
      </div>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        {isLoading ? (
          <PageLoading label={t("teacher.loadingClasses")} />
        ) : (
          <Select
            label={t("teacher.selectClass")}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">{t("teacher.chooseClass")}</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </Select>
        )}
      </Card>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        <DateInput
          label={t("teacher.selectDate")}
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Card>

      <Button
        onClick={handleProceed}
        disabled={!canProceed}
        className="h-12 w-full rounded-xl bg-primary-dark text-white disabled:opacity-50"
      >
        {t("teacher.continueToSheet")}
      </Button>
    </PageContainer>
  );
}
