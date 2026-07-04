import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Role } from "@/types/models";

function profileAvatarPath(role: Role): string {
  switch (role) {
    case "teacher":
      return "/teacher/profile/avatar";
    case "student":
    case "parent":
      return "/student/profile/avatar";
    case "admin":
    case "super_admin":
    default:
      return "/admin/profile/avatar";
  }
}

export async function uploadProfileAvatar(
  role: Role,
  file: File
): Promise<string> {
  const form = new FormData();
  form.append("avatar", file);

  const res = await api.post<ApiResponse<{ avatarUrl: string }>>(
    profileAvatarPath(role),
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const avatarUrl = res.data.data?.avatarUrl;
  if (!avatarUrl) {
    throw new Error("Avatar upload failed");
  }

  return avatarUrl;
}
