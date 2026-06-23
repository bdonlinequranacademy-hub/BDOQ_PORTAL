import { Classroom } from "@/components/classroom/Classroom";
import { PageContainer } from "@/components/layout/PageContainer";

export function StudentClassroomDemoPage() {
  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-navy">My Class</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Join your teacher&apos;s live class — video and whiteboard.
        </p>
      </div>
      <Classroom />
    </PageContainer>
  );
}
