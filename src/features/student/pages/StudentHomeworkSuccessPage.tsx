import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useStudentHomework } from "@/features/student/hooks/useStudent";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function StudentHomeworkSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id") ?? "";
  const { data: homework = [] } = useStudentHomework();

  const submitted = homework.filter((h) => h.submitted);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="size-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-primary-dark">
          Homework Submitted!
        </h1>
        <p className="max-w-sm text-sm text-zinc-500">
          Your teacher will review and grade your work soon.
        </p>
      </div>

      <Card className="w-full max-w-md rounded-2xl border-0 bg-[#F8FAFF] p-5 shadow-sm">
        <span className="mb-2 block font-bold text-primary-dark">What happens next</span>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600">
          <li>Your teacher receives your submission instantly.</li>
          <li>They review your work and add a grade plus feedback.</li>
          <li>You will see the grade on this homework page and in your list.</li>
        </ol>
      </Card>

      {submitted.length > 0 && (
        <Card className="w-full max-w-md rounded-2xl border-0 p-5 shadow-sm">
          <span className="mb-3 block font-bold text-primary-dark">Submission history</span>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {submitted.map((hw) => (
              <button
                key={hw._id}
                onClick={() => navigate(`/student/homework/${hw._id}`)}
                className={`rounded-xl px-3 py-2 text-left text-sm ${
                  hw._id === id ? "bg-[#EEF2F8] font-semibold" : "hover:bg-zinc-50"
                }`}
              >
                {hw.title}
                {hw.submission?.grade && (
                  <span className="ml-2 text-emerald-600">· {hw.submission.grade}</span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="flex w-full max-w-md flex-col gap-3">
        <Button
          onClick={() => navigate("/student/homework")}
          className="h-12 rounded-xl bg-primary-dark text-white"
        >
          Back to Homework
        </Button>
        <Button
          onClick={() => navigate("/student")}
          variant="ghost"
          className="h-12 rounded-xl border border-zinc-200"
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
}
