import { useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { PaymentInvoiceDocument } from "@/components/payments/PaymentInvoiceDocument";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import { studentApi } from "@/lib/api/studentApi";
import { adminApi } from "@/lib/api/adminApi";

export function PaymentInvoicePage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin/");
  const backPath = isAdmin ? "/admin/payments" : "/student/payments";

  const { data, isLoading, error } = useQuery({
    queryKey: ["payment-invoice", isAdmin ? "admin" : "student", paymentId],
    enabled: Boolean(paymentId),
    queryFn: async () => {
      if (!paymentId) throw new Error("Missing payment ID");
      const res = isAdmin
        ? await adminApi.getPaymentInvoice(paymentId)
        : await studentApi.getPaymentInvoice(paymentId);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Invoice not available");
      }
      return res.data;
    },
  });

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (isLoading) {
    return <PageLoading label="Loading invoice…" />;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Invoice not available"}
        </p>
        <Link
          to={backPath}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to payments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-portal px-4 py-6 print:bg-white print:p-0 sm:px-6">
      <div className="no-print mx-auto mb-6 flex max-w-[720px] flex-wrap items-center justify-between gap-3">
        <Link
          to={backPath}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to payments
        </Link>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrint}
            className="h-9 gap-1.5 rounded-lg"
          >
            <Printer className="size-4" />
            Print / Save PDF
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="h-9 gap-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark"
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </div>

      <PaymentInvoiceDocument invoice={data} />
    </div>
  );
}
