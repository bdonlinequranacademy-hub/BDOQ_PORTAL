import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IAdminResourcesOverviewHeaderProps {
  onAdd: () => void;
}

export function AdminResourcesOverviewHeader({
  onAdd,
}: IAdminResourcesOverviewHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary-dark sm:text-3xl">
          Resources
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-portal-muted">
          Manage and organize all learning resources for your academy — e-books,
          audio, and videos for the public website.
        </p>
      </div>
      <Button
        type="button"
        onClick={onAdd}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
      >
        <Plus className="size-4" aria-hidden />
        Add Resource
      </Button>
    </div>
  );
}
