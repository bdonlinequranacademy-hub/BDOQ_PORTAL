import { defaultPortalAvatarUrl } from "@/lib/defaultAvatars";

function initialsFromName(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

type UserAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface IUserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  gender?: "male" | "female";
  size?: UserAvatarSize;
  shape?: "circle" | "rounded";
  className?: string;
}

const sizeClasses: Record<UserAvatarSize, string> = {
  xs: "size-8 text-[10px]",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-2xl",
};

const sizePx: Record<UserAvatarSize, number> = {
  xs: 32,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
};

export function UserAvatar({
  name,
  avatarUrl,
  gender,
  size = "md",
  shape = "circle",
  className = "",
}: IUserAvatarProps) {
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";
  const sizeClass = sizeClasses[size];
  const px = sizePx[size];

  const uploaded = avatarUrl?.trim();
  if (uploaded) {
    return (
      <img
        src={uploaded}
        alt={name}
        width={px}
        height={px}
        className={`shrink-0 object-cover ${shapeClass} ${sizeClass} ${className}`}
      />
    );
  }

  if (gender === "male" || gender === "female") {
    return (
      <img
        src={defaultPortalAvatarUrl(gender)}
        alt={name}
        width={px}
        height={px}
        className={`shrink-0 object-cover ${shapeClass} ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-brand-red font-bold text-white shadow-sm ${shapeClass} ${sizeClass} ${className}`}
      aria-hidden
    >
      {initialsFromName(name)}
    </div>
  );
}

export { initialsFromName };
