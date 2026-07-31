type TranslateFn = (key: string, params?: Record<string, string>) => string;

interface HomeworkDueLabelOptions {
  t: TranslateFn;
  formatDate: (iso: string) => string;
}

export function isHomeworkOverdue(dueDate: string, submitted?: boolean) {
  if (submitted) return false;
  return new Date(dueDate) < new Date();
}

export function formatHomeworkDueLabel(
  dueDate: string,
  submitted?: boolean,
  options?: HomeworkDueLabelOptions
) {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (submitted) {
    const dateLabel = options
      ? options.formatDate(dueDate)
      : due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return options
      ? options.t("student.homeworkDueSubmitted", { date: dateLabel })
      : `Due ${dateLabel}`;
  }

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    if (options) {
      return overdueDays <= 1
        ? options.t("student.homeworkDueOverdueYesterday")
        : options.t("student.homeworkDueOverdueDays", { days: String(overdueDays) });
    }
    return overdueDays <= 1
      ? "Overdue · due yesterday"
      : `Overdue · ${overdueDays} days late`;
  }

  if (diffDays === 0) {
    return options ? options.t("student.homeworkDueToday") : "Due today";
  }
  if (diffDays === 1) {
    return options ? options.t("student.homeworkDueTomorrow") : "Due tomorrow";
  }
  return options
    ? options.t("student.homeworkDueInDays", { days: String(diffDays) })
    : `Due in ${diffDays} days`;
}

export function defaultHomeworkDueDate(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}
