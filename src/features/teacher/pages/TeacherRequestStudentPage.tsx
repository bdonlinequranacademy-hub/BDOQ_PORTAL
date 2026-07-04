import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  useCreateStudentRequest,
  useTeacherStudentRequests,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formControlClass } from "@/lib/formControl";
import type { StudentRequestStatus } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
const COURSE_TYPES = ["Quran", "Tajweed", "Hifz", "Arabic", "Other"];

function statusStyles(status: StudentRequestStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export function TeacherRequestStudentPage() {
  const [message, setMessage] = useState("");
  const [preferredCourseType, setPreferredCourseType] = useState("Quran");
  const { data: requests = [], isLoading } = useTeacherStudentRequests();
  const create = useCreateStudentRequest();
  const pagination = usePaginatedList(requests);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    create.mutate(
      {
        message: message.trim(),
        preferredCourseType: preferredCourseType || undefined,
      },
      {
        onSuccess: () => {
          setMessage("");
        },
      }
    );
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Request a Student</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Ask admin to assign a new student when you have availability
        </p>
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <p className="text-sm font-semibold text-primary-dark">What happens next</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
          <li>Admin reviews your request (usually within 1–2 business days).</li>
          <li>If approved, admin assigns a matching student to one of your classes.</li>
          <li>You will see the new student under Students and in your class roster.</li>
        </ol>
      </Card>

      <Card className="rounded-3xl border-0 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Preferred course</span>
            <select
              value={preferredCourseType}
              onChange={(e) => setPreferredCourseType(e.target.value)}
              className={formControlClass}
            >
              {COURSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Message to admin</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe your availability, preferred age group, timezone, etc."
              className={`${formControlClass} resize-y`}
              required
            />
          </label>

          <Button
            type="submit"
            disabled={create.isPending || !message.trim()}
            className="w-full rounded-xl sm:w-auto"
          >
            {create.isPending ? "Sending…" : "Submit request"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-bold text-primary-dark">Your requests</h2>
        {isLoading ? (
          <PageLoading label="Loading requests…" />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No requests yet"
            description="Submit a request when you are ready to take on a new student."
          />
        ) : (
          <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pagination.paginatedItems.map((req) => (
              <Card
                key={req._id}
                className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles(req.status)}`}
                  >
                    {req.status}
                  </span>
                  {req.preferredCourseType ? (
                    <span className="text-xs text-zinc-400">{req.preferredCourseType}</span>
                  ) : null}
                  <span className="text-xs text-zinc-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-primary-dark">{req.message}</p>
                {req.adminNote ? (
                  <p className="rounded-xl bg-[#F8FAFF] px-3 py-2 text-xs text-zinc-600">
                    Admin: {req.adminNote}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
          <Pagination pagination={pagination} itemLabel="requests" />
          </>
        )}
      </div>
    </PageContainer>
  );
}
