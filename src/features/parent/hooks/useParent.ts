import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parentApi } from "@/lib/api/parentApi";
import { useParentStore } from "@/stores/parentStore";

export const parentKeys = {
  children: ["parent", "children"] as const,
  classes: (childId: string) => ["parent", "classes", childId] as const,
  homework: (childId: string) => ["parent", "homework", childId] as const,
  attendance: (childId: string) => ["parent", "attendance", childId] as const,
  progress: (childId: string) => ["parent", "progress", childId] as const,
  notifications: ["parent", "notifications"] as const,
};

export function useParentChildren() {
  const setSelectedChildId = useParentStore((s) => s.setSelectedChildId);
  const selectedChildId = useParentStore((s) => s.selectedChildId);

  const query = useQuery({
    queryKey: parentKeys.children,
    queryFn: parentApi.getChildren,
    select: (r) => r.data ?? [],
  });

  useEffect(() => {
    const children = query.data ?? [];
    if (children.length > 0 && !selectedChildId) {
      const first = children[0];
      const id = typeof first === "object" && "_id" in first ? String(first._id) : "";
      if (id) setSelectedChildId(id);
    }
  }, [query.data, selectedChildId, setSelectedChildId]);

  return query;
}

export function useSelectedChildId() {
  return useParentStore((s) => s.selectedChildId);
}

export function useParentChildClasses(childId: string) {
  return useQuery({
    queryKey: parentKeys.classes(childId),
    queryFn: () => parentApi.getChildClasses(childId),
    select: (r) => r.data ?? [],
    enabled: Boolean(childId),
  });
}

export function useParentChildHomework(childId: string) {
  return useQuery({
    queryKey: parentKeys.homework(childId),
    queryFn: () => parentApi.getChildHomework(childId),
    select: (r) => r.data ?? [],
    enabled: Boolean(childId),
  });
}

export function useParentChildAttendance(childId: string) {
  return useQuery({
    queryKey: parentKeys.attendance(childId),
    queryFn: () => parentApi.getChildAttendance(childId),
    select: (r) => r.data,
    enabled: Boolean(childId),
  });
}

export function useParentChildProgress(childId: string) {
  return useQuery({
    queryKey: parentKeys.progress(childId),
    queryFn: () => parentApi.getChildProgress(childId),
    select: (r) => r.data ?? [],
    enabled: Boolean(childId),
  });
}

export function useParentNotifications() {
  return useQuery({
    queryKey: parentKeys.notifications,
    queryFn: parentApi.getNotifications,
    select: (r) => r.data ?? [],
  });
}

export function useMarkParentNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parentApi.markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.notifications });
    },
  });
}
