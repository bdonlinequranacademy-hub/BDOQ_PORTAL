import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import { useAdminCertificate } from "@/features/admin/hooks/useAdmin";
import { CertificateTemplateSlot } from "@/features/certificates/components/CertificateTemplateSlot";
import { CertificateDocument } from "@/certificates/CertificateDocument";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/stores/uiStore";
import {
  exportCertificatePdf,
  exportCertificatePng,
  printCertificate,
} from "@/lib/certificateExport";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminCertificateViewPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = usePortalTranslation();
  const { data: certificate, isLoading, error } = useAdminCertificate(id ?? "");
  const addToast = useUiStore((s) => s.addToast);
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);

  const handlePng = useCallback(async () => {
    if (!certificate) return;
    setExporting("png");
    try {
      await exportCertificatePng(
        `${certificate.certificateId.replace(/\s+/g, "-")}.png`
      );
      addToast("success", "Certificate PNG downloaded");
    } catch {
      addToast("error", "PNG export needs certificate template design first");
    } finally {
      setExporting(null);
    }
  }, [certificate, addToast]);

  const handlePdf = useCallback(async () => {
    if (!certificate) return;
    setExporting("pdf");
    try {
      await exportCertificatePdf(
        `${certificate.certificateId.replace(/\s+/g, "-")}.pdf`
      );
      addToast("success", "Certificate PDF downloaded");
    } catch {
      addToast("error", "PDF export needs certificate template design first");
    } finally {
      setExporting(null);
    }
  }, [certificate, addToast]);

  const handlePrint = useCallback(() => {
    try {
      printCertificate();
    } catch {
      addToast("error", "Print needs certificate template design first");
    }
  }, [addToast]);

  if (isLoading) return <PageLoading label={t("admin.common.loadingCertificate")} />;

  if (error || !certificate) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-sm text-red-600">{t("admin.certificateView.notFound")}</p>
        <Link to="/admin/certificates" className="mt-3 inline-block text-sm font-semibold text-gold">
          {t("admin.certificateView.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-portal px-4 py-6 sm:px-6">
      <div className="no-print mx-auto mb-6 flex max-w-[1492px] flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/certificates"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {t("admin.certificateView.backToGenerator")}
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrint}
            className="h-9 gap-1.5 rounded-lg"
          >
            <Printer className="size-4" />
            {t("admin.certificateView.printPdf")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={exporting !== null}
            onClick={handlePdf}
            className="h-9 gap-1.5 rounded-lg"
          >
            {exporting === "pdf" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {t("admin.certificateView.downloadPdf")}
          </Button>
          <Button
            type="button"
            disabled={exporting !== null}
            onClick={handlePng}
            className="h-9 gap-1.5 rounded-lg bg-primary"
          >
            {exporting === "png" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {t("admin.certificateView.downloadPng")}
          </Button>
        </div>
      </div>

      <CertificateTemplateSlot certificate={certificate} />

      <div className="certificate-capture-host certificate-print-host" aria-hidden="true">
        <CertificateDocument certificate={certificate} />
      </div>
    </div>
  );
}
