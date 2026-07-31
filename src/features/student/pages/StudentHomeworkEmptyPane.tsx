import { BookOpenCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentHomeworkEmptyPane() {
  const { t } = usePortalTranslation();

  return (
    <div className="hidden items-center justify-center p-8 lg:flex lg:min-h-[400px]">
      <EmptyState
        icon={BookOpenCheck}
        title={t("student.selectAssignment")}
        description={t("student.selectAssignmentDesc")}
      />
    </div>
  );
}
