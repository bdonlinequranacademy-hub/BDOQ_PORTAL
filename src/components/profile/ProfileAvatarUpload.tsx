import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/Button";

interface IProfileAvatarUploadProps {
  name: string;
  avatarUrl?: string | null;
  gender?: "male" | "female";
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  size?: "lg" | "xl";
}

export function ProfileAvatarUpload({
  name,
  avatarUrl,
  gender,
  onUpload,
  isUploading = false,
  size = "xl",
}: IProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    try {
      await onUpload(file);
    } finally {
      setPreviewUrl(null);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <UserAvatar
          name={name}
          avatarUrl={previewUrl ?? avatarUrl}
          gender={gender}
          size={size}
          shape="circle"
          className="ring-4 ring-white shadow-md"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-white bg-primary-dark text-white shadow-md transition hover:bg-primary disabled:opacity-60"
          aria-label="Change profile photo"
        >
          <Camera className="size-4" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void handleFileChange(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="secondary"
        className="h-9 rounded-full px-4 text-xs"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? "Uploading…" : "Upload photo"}
      </Button>
      <p className="max-w-xs text-center text-xs text-zinc-500">
        JPG, PNG or WebP · max 5 MB · stored securely on Cloudinary
      </p>
    </div>
  );
}
