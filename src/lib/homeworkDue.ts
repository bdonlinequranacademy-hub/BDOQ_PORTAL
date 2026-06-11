export function isHomeworkOverdue(dueDate: string, submitted?: boolean) {
  if (submitted) return false;
  return new Date(dueDate) < new Date();
}

export function formatHomeworkDueLabel(dueDate: string, submitted?: boolean) {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (submitted) {
    return `Due ${due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    return overdueDays <= 1
      ? "Overdue · due yesterday"
      : `Overdue · ${overdueDays} days late`;
  }

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days`;
}

export function defaultHomeworkDueDate(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}
