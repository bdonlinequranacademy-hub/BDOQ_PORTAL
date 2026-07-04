import { UserAvatar } from "@/components/ui/UserAvatar";

interface UserInitialAvatarProps {
  name: string;
  avatarUrl?: string | null;
  gender?: "male" | "female";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "sm" as const,
  md: "md" as const,
  lg: "lg" as const,
};

export function UserInitialAvatar({
  name,
  avatarUrl,
  gender,
  size = "md",
  className = "",
}: UserInitialAvatarProps) {
  return (
    <UserAvatar
      name={name}
      avatarUrl={avatarUrl}
      gender={gender}
      size={sizeMap[size]}
      shape="rounded"
      className={className}
    />
  );
}
