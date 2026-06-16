function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface UserInitialAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
};

export function UserInitialAvatar({ name, size = "md", className = "" }: UserInitialAvatarProps) {
  const initials = initialsFromName(name) || "?";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-[#0a3a7a] font-bold text-white shadow-sm ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
