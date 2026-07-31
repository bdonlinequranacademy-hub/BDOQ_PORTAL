import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ShieldX, Award } from "lucide-react";
import { publicApi } from "@/lib/api/publicApi";
import { formatCertificateDate } from "@/lib/certificateFormat";
import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { PageLoading } from "@/components/ui/PageLoading";
import { CertificateTemplateSlot } from "@/features/certificates/components/CertificateTemplateSlot";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function VerifyCertificatePage() {
  const { t } = usePortalTranslation();
  const { certificateId } = useParams<{ certificateId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["verify-certificate", certificateId],
    enabled: Boolean(certificateId),
    queryFn: async () => {
      const res = await publicApi.verifyCertificate(certificateId ?? "");
      if (!res.success || !res.data) {
        throw new Error(res.message || "Not found");
      }
      return res.data;
    },
    retry: false,
  });

  return (
    <div className="min-h-screen bg-portal px-4 py-12">
      <div className="mx-auto max-w-[1492px]">
        <div className="mb-8 text-center">
          <Award className="mx-auto size-10 text-primary" />
          <h1 className="mt-3 text-xl font-bold text-navy">{BDOQ_BRAND.name}</h1>
          <p className="text-sm text-zinc-500">{t("admin.verifyCertificate.title")}</p>
        </div>

        {isLoading ? (
          <PageLoading label={t("admin.verifyCertificate.verifying")} />
        ) : isError || !data ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <ShieldX className="mx-auto size-10 text-red-500" />
            <p className="mt-3 font-semibold text-red-800">{t("admin.verifyCertificate.notFound")}</p>
            <p className="mt-1 text-sm text-red-600">
              {t("admin.verifyCertificate.notFoundDesc", { id: certificateId ?? "" })}
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {t("admin.verifyCertificate.backHome")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="mx-auto w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="size-6 shrink-0" />
                <p className="font-bold">{t("admin.verifyCertificate.authentic")}</p>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-400">{t("admin.verifyCertificate.certId")}</dt>
                  <dd className="font-mono font-semibold text-navy">{data.certificateId}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-400">{t("admin.verifyCertificate.issueDate")}</dt>
                  <dd className="text-zinc-700">{formatCertificateDate(data.issueDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-400">{t("admin.verifyCertificate.student")}</dt>
                  <dd className="font-semibold text-navy">{data.studentName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-400">{t("admin.verifyCertificate.grade")}</dt>
                  <dd className="text-zinc-700">{data.grade}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-zinc-400">{t("admin.verifyCertificate.course")}</dt>
                  <dd className="text-zinc-700">{data.courseName}</dd>
                </div>
              </dl>
            </div>

            <CertificateTemplateSlot certificate={data} />
          </div>
        )}
      </div>
    </div>
  );
}
