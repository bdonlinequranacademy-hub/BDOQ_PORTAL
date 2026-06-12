import { useParentChildren, useSelectedChildId } from "@/features/parent/hooks/useParent";
import { useParentStore } from "@/stores/parentStore";
import { Select } from "@/components/ui/Select";

import { PageLoading } from "@/components/ui/PageLoading";
export function ChildSelector() {
  const { data: children = [], isLoading } = useParentChildren();
  const selectedChildId = useSelectedChildId();
  const setSelectedChildId = useParentStore((s) => s.setSelectedChildId);

  if (isLoading) {
    return <PageLoading compact label="Loading children…" />;
  }

  if (children.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        No children linked to your account. Ask an admin to link student accounts in User
        Management.
      </div>
    );
  }

  if (children.length === 1) {
    const child = children[0];
    return (
      <p className="text-sm text-zinc-600">
        Viewing: <span className="font-semibold text-[#03214F]">{child.name}</span>
      </p>
    );
  }

  return (
    <Select
      label="Select child"
      value={selectedChildId ?? ""}
      onChange={(e) => setSelectedChildId(e.target.value || null)}
      className="sm:max-w-xs"
    >
      {children.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </Select>
  );
}
