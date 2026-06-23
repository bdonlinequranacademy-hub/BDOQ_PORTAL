import { Classroom } from "@/components/classroom/Classroom";
import { PageContainer } from "@/components/layout/PageContainer";

export function TeacherWhiteboardDemoPage() {
  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-navy">Islamic Classroom</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Live video + whiteboard + Namaz, Wudu &amp; Qaida shapes for kids.
        </p>
      </div>
      <Classroom />
    </PageContainer>
  );
}
