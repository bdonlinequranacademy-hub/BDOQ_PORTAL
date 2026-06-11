import { BookOpenCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function StudentHomeworkEmptyPane() {
  return (
    <div className="hidden items-center justify-center p-8 lg:flex lg:min-h-[400px]">
      <EmptyState
        icon={BookOpenCheck}
        title="Select an assignment"
        description="Choose homework from the list to view details or submit your work."
      />
    </div>
  );
}
