interface IEnrollmentBar {
  month: string;
  count: number;
}

interface IEnrollmentChartProps {
  data: IEnrollmentBar[];
}

export function EnrollmentChart({ data }: IEnrollmentChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex h-48 items-end justify-between gap-2 pt-4">
      {data.map((item) => (
        <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-primary transition-all hover:bg-primary-dark dark:bg-teal-accent dark:hover:bg-teal"
              style={{ height: `${(item.count / max) * 100}%`, minHeight: item.count > 0 ? "8px" : "2px" }}
              title={`${item.count} enrollments`}
              role="img"
              aria-label={`${item.month}: ${item.count} enrollments`}
            />
          </div>
          <span className="text-[10px] font-medium text-portal-muted">{item.month}</span>
        </div>
      ))}
    </div>
  );
}
