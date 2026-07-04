import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileAvatar } from "@/lib/api/avatarApi";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import type { Role } from "@/types/models";

const profileQueryKey: Partial<Record<Role, readonly string[]>> = {
  admin: ["admin", "profile"],
  super_admin: ["admin", "profile"],
  teacher: ["teacher", "profile"],
  student: ["student", "profile"],
  parent: ["student", "profile"],
};

export function useUploadProfileAvatar(role: Role) {
  const updateUser = useAuthStore((s) => s.updateUser);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfileAvatar(role, file),
    onSuccess: (avatarUrl) => {
      updateUser({ avatarUrl });
      const key = profileQueryKey[role];
      if (key) {
        void qc.invalidateQueries({ queryKey: key });
      }
      toast.success("Profile photo updated");
    },
    onError: () => {
      toast.error("Could not upload photo. Try a JPG or PNG under 5 MB.");
    },
  });
}
