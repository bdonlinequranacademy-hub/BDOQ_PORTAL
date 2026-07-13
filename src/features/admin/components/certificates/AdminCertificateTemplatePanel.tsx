import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";
import type { CertificateFormPayload } from "@/lib/api/adminApi";
import { AdminCertFormSection } from "@/features/admin/components/certificates/AdminCertFormSection";

interface IAdminCertificateTemplatePanelProps {
  form: CertificateFormPayload;
  onChange: (next: CertificateFormPayload) => void;
}

/**
 * Template design is fixed (CertificateDocument). This panel only shows
 * official-template info + editable footer/performance notes that feed the same template.
 */
export function AdminCertificateTemplatePanel({
  form,
  onChange,
}: IAdminCertificateTemplatePanelProps) {
  const [openSeal, setOpenSeal] = useState(false);
  const [openFooter, setOpenFooter] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <AdminCertFormSection number={2} title="Design & Template">
        <p className="mb-3 text-xs text-portal-muted">
          Official BDOQ certificate template is locked. Colors, fonts, seal, and
          layout cannot be changed here.
        </p>

        <div className="rounded-xl border-2 border-primary bg-primary/5 p-3">
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gradient-to-br from-[#3C835D]/20 via-white to-[#EBC071]/30">
            <div className="text-center">
              <p className="font-['Cinzel',serif] text-lg font-bold uppercase text-[#A74B47]">
                BDOQ
              </p>
              <p className="font-['Cinzel',serif] text-lg font-bold uppercase text-[#3C835D]">
                Academy
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                Official Certificate
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-primary-dark">
              Official BDOQ Template
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary-dark">
              <Lock className="size-3" aria-hidden />
              Active
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className={cn("mb-2 text-xs font-semibold text-portal-heading")}>
            Brand colors (fixed)
          </p>
          <div className="flex flex-wrap gap-2">
            {["#3C835D", "#A74B47", "#EBC071", "#269B6F", "#1A1A2E"].map(
              (color) => (
                <span
                  key={color}
                  className="size-8 rounded-full border-2 border-white shadow ring-1 ring-portal"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              )
            )}
          </div>
          <p className="mt-2 text-[11px] text-portal-muted">
            These colors match the locked certificate artwork — display only.
          </p>
        </div>
      </AdminCertFormSection>

      <Card className="overflow-hidden rounded-2xl border border-portal p-0 shadow-sm">
        <button
          type="button"
          onClick={() => setOpenSeal((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white">
              3
            </span>
            <span className="text-sm font-bold text-primary-dark">
              Signature & Seal
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-portal-muted transition",
              openSeal && "rotate-180"
            )}
            aria-hidden
          />
        </button>
        {openSeal ? (
          <div className="space-y-2 border-t border-portal bg-portal-muted/15 px-5 py-4 text-xs text-portal-muted">
            <p>
              Founder signature, admin signature, and academy seal are part of
              the official template artwork and always appear on generated
              certificates.
            </p>
            <p className="font-medium text-portal-heading">
              No edits required — design is fixed.
            </p>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-portal p-0 shadow-sm">
        <button
          type="button"
          onClick={() => setOpenFooter((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white">
              4
            </span>
            <span className="text-sm font-bold text-primary-dark">
              Footer & Notes
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-portal-muted transition",
              openFooter && "rotate-180"
            )}
            aria-hidden
          />
        </button>
        {openFooter ? (
          <div className="space-y-3 border-t border-portal px-5 py-4">
            <p className="text-xs text-portal-muted">
              Performance notes print below the course banner on the certificate.
            </p>
            <Textarea
              label="Performance note (English)"
              value={form.performanceTextEn ?? ""}
              onChange={(e) =>
                onChange({ ...form, performanceTextEn: e.target.value })
              }
              rows={2}
              className="min-h-[4rem] text-sm"
            />
            <Textarea
              label="Performance note (Bengali)"
              value={form.performanceTextBn ?? ""}
              onChange={(e) =>
                onChange({ ...form, performanceTextBn: e.target.value })
              }
              rows={2}
              className="min-h-[4rem] text-sm"
            />
          </div>
        ) : null}
      </Card>
    </div>
  );
}
