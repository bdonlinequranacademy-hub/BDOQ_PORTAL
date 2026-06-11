import { ListDetailLayout } from "@/components/layout/ListDetailLayout";
import { StudentHomeworkListPane } from "@/features/student/pages/StudentHomeworkListPane";

export function StudentHomeworkLayout() {
  return <ListDetailLayout list={<StudentHomeworkListPane />} />;
}
