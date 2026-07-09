import { ChevronRight, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { WhatsAppQueueItem } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface IAdminDashboardWhatsAppStripProps {
  queue: WhatsAppQueueItem[];
  actionableCount: number;
  onOpenQueue: () => void;
}

export function AdminDashboardWhatsAppStrip({
  queue,
  actionableCount,
  onOpenQueue,
}: IAdminDashboardWhatsAppStripProps) {
  const previewItems = queue
    .filter((item) => item.category !== "missing_whatsapp")
    .slice(0, 3);
  const missingCount = queue.filter((item) => item.category === "missing_whatsapp").length;

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/12 text-[#128C7E]">
            <MessageCircle className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-portal-heading">WhatsApp queue</p>
              {actionableCount > 0 ? (
                <span className="rounded-full bg-[#25D366]/15 px-2 py-0.5 text-xs font-bold text-[#128C7E]">
                  {actionableCount}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-sm text-portal-muted">
              {actionableCount > 0
                ? `${actionableCount} ready-to-send reminder${actionableCount === 1 ? "" : "s"}`
                : "No urgent WhatsApp messages right now"}
              {missingCount > 0 ? ` · ${missingCount} users need numbers` : ""}
            </p>
          </div>
        </div>

        {previewItems.length > 0 ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2 lg:max-w-xl">
            {previewItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-portal/80 bg-portal-muted/40 px-3 py-2"
              >
                <UserInitialAvatar name={item.recipientName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {item.recipientName}
                  </p>
                  <p className="truncate text-xs text-portal-muted">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onOpenQueue}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
            "bg-[#128C7E] hover:bg-[#0e6b60]"
          )}
        >
          Open queue
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </Card>
  );
}
