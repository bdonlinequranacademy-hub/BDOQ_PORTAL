import { ArrowRight, CheckCircle2, ClipboardList, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Teacher submits a request",
    detail: "With availability and course preference",
  },
  {
    icon: CheckCircle2,
    title: "Admin reviews & approves",
    detail: "Approve or reject with an optional note",
  },
  {
    icon: UserPlus,
    title: "Student is enrolled",
    detail: "Assign the student in Classes",
  },
];

export function AdminStudentRequestsHowItWorks() {
  return (
    <Card className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-portal-surface p-4 shadow-sm sm:p-5">
      <p className="text-sm font-bold text-portal-heading">How this works</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="contents">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-portal-heading">{step.title}</p>
                  <p className="mt-0.5 text-xs text-portal-muted">{step.detail}</p>
                  {index === 2 ? (
                    <Link
                      to="/admin/classes"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Go to Classes
                      <ArrowRight className="size-3" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </div>
              {index < STEPS.length - 1 ? (
                <ArrowRight
                  className={cn(
                    "hidden size-5 shrink-0 text-primary/40 lg:block",
                    index === 1 ? "justify-self-center" : ""
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
