import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Loader2,
  Maximize2,
  Medal,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  useAdminCertificates,
  useCreateCertificate,
} from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/lib/api/adminApi";
import type { CertificateFormPayload } from "@/lib/api/adminApi";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageLoading } from "@/components/ui/PageLoading";
import { CertificateTemplateSlot } from "@/features/certificates/components/CertificateTemplateSlot";
import { emptyCertificateForm, gradeShowsBadge } from "@/lib/certificateDefaults";
import { filterCertificates } from "@/lib/certificateSearch";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { useUiStore } from "@/stores/uiStore";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { CertificateView } from "@/types/models";
import { AdminCertificatesStatsGrid } from "@/features/admin/components/certificates/AdminCertificatesStatsGrid";
import { AdminCertFormSection } from "@/features/admin/components/certificates/AdminCertFormSection";
import { AdminCertificateTemplatePanel } from "@/features/admin/components/certificates/AdminCertificateTemplatePanel";
import { AdminCertificatesHistory } from "@/features/admin/components/certificates/AdminCertificatesHistory";
import { computeCertificateStats } from "@/features/admin/components/certificates/adminCertificatesUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const DURATION_PRESETS = ["1 Month", "3 Months", "6 Months", "12 Months"] as const;
const GRADE_PRESETS = ["Excellent (A+)", "Very Good (A)", "Good (B+)", "Pass"] as const;

export function AdminCertificatesPage() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const addToast = useUiStore((s) => s.addToast);
  const [form, setForm] = useState<CertificateFormPayload>(emptyCertificateForm);
  const [preview, setPreview] = useState<CertificateView | null>(null);
  const [nameQuery, setNameQuery] = useState("");
  const [issueDateFilter, setIssueDateFilter] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  const { data: history = [], isLoading } = useAdminCertificates();
  const createCert = useCreateCertificate();

  const stats = useMemo(() => computeCertificateStats(history), [history]);

  const filteredHistory = useMemo(
    () =>
      filterCertificates(history, {
        nameQuery,
        issueDate: issueDateFilter,
      }),
    [history, nameQuery, issueDateFilter]
  );

  const pagination = usePaginatedList(filteredHistory, {
    pageSize: 10,
    resetDeps: [nameQuery, issueDateFilter],
  });

  const previewMutation = useMutation({
    mutationFn: adminApi.previewCertificate,
    onSuccess: (res) => {
      if (res.success && res.data) setPreview(res.data);
    },
  });

  useEffect(() => {
    if (!form.studentName.trim() || !form.courseName.trim()) {
      setPreview(null);
      return;
    }
    const timer = window.setTimeout(() => {
      previewMutation.mutate(form);
    }, 450);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preview on form debounce only
  }, [form]);

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    createCert.mutate(form, {
      onSuccess: (res) => {
        if (res.success && res.data?.id) {
          navigate(`/admin/certificates/${res.data.id}`);
        }
      },
    });
  }

  function handleReset() {
    setForm(emptyCertificateForm());
    setPreview(null);
  }

  function handleShare(certificate: CertificateView) {
    const url = certificate.verifyUrl;
    void navigator.clipboard.writeText(url).then(
      () => addToast("success", "Verification link copied"),
      () => addToast("error", "Could not copy link")
    );
  }

  function scrollToForm() {
    document.getElementById("certificate-generator")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (isLoading) return <PageLoading label={t("admin.common.loadingCertificates")} />;

  const canSubmit = Boolean(form.studentName.trim() && form.courseName.trim());

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.certificates.title")}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-portal-muted">
            {t("admin.certificates.subtitle")}
          </p>
        </div>
        <Button
          type="button"
          onClick={scrollToForm}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden />
          {t("admin.certificates.generate")}
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1">
          <AdminCertificatesStatsGrid stats={stats} />
        </div>
      </div>

      <div
        id="certificate-generator"
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(280px,0.95fr)_minmax(260px,0.85fr)_minmax(300px,1.1fr)]"
      >
        <AdminCertFormSection number={1} title={t("admin.certificates.certDetails")}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <Input
              label={t("admin.certificates.studentNameEn")}
              placeholder="e.g. Md. Abdullah Hasan"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              required
              fieldSize="lg"
            />
            <Input
              label={t("admin.certificates.studentNameBn")}
              placeholder="যেমন: মো. আব্দুল্লাহ হাসান"
              value={form.studentNameBn ?? ""}
              onChange={(e) =>
                setForm({ ...form, studentNameBn: e.target.value })
              }
              fieldSize="lg"
            />
            <Input
              label={t("admin.certificates.studentId")}
              placeholder="e.g. STU-2024-0567"
              value={form.studentPortalId ?? ""}
              onChange={(e) =>
                setForm({ ...form, studentPortalId: e.target.value })
              }
            />

            <Input
              label={t("admin.certificates.courseNameEn")}
              placeholder="e.g. Nazra Quran with Tajweed"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
              required
              fieldSize="lg"
            />
            <Input
              label={t("admin.certificates.courseNameBn")}
              placeholder="যেমন: নজরা কুরআন (তাজবিদের সহিত)"
              value={form.courseNameBn ?? ""}
              onChange={(e) =>
                setForm({ ...form, courseNameBn: e.target.value })
              }
              fieldSize="lg"
            />

            <div>
              <span className="form-label">{t("admin.certificates.courseDuration")}</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {DURATION_PRESETS.map((option) => {
                  const active =
                    form.courseDuration.trim().toLowerCase() ===
                    option.toLowerCase();
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, courseDuration: option })
                      }
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-portal text-portal-muted hover:border-primary/40"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <Input
                className="mt-2"
                value={form.courseDuration}
                onChange={(e) =>
                  setForm({ ...form, courseDuration: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={t("admin.certificates.dateOfCompletion")}
                type="date"
                value={form.issueDate ?? ""}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                required
              />
              <div>
                <span className="form-label">{t("admin.certificates.certId")}</span>
                <input
                  className={cn(formControlClass, "mt-1.5 bg-portal-muted/20")}
                  value={preview?.certificateId ?? t("admin.certificates.autoGenerated")}
                  readOnly
                />
              </div>
            </div>

            <div>
              <span className="form-label">{t("admin.certificates.resultGrade")}</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {GRADE_PRESETS.map((option) => {
                  const active =
                    form.grade.trim().toLowerCase() === option.toLowerCase();
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          grade: option,
                          showExcellentBadge: gradeShowsBadge(option),
                        })
                      }
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-portal text-portal-muted hover:border-primary/40"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <Input
                className="mt-2"
                value={form.grade}
                onChange={(e) => {
                  const grade = e.target.value;
                  setForm({
                    ...form,
                    grade,
                    showExcellentBadge: gradeShowsBadge(grade),
                  });
                }}
                required
              />
            </div>

            <div className="rounded-xl border border-portal bg-portal-muted/15 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-portal-muted">
                {t("admin.certificates.additionalOptions")}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-portal-heading">
                  <input type="checkbox" checked disabled className="size-4 accent-primary" />
                  {t("admin.certificates.addSignature")}
                  <span className="text-[10px] text-portal-muted">
                    {t("admin.certificates.alwaysOnTemplate")}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm text-portal-heading">
                  <input type="checkbox" checked disabled className="size-4 accent-primary" />
                  {t("admin.certificates.addQrCode")}
                  <span className="text-[10px] text-portal-muted">
                    {t("admin.certificates.alwaysOnTemplate")}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm text-portal-heading">
                  <input type="checkbox" checked disabled className="size-4 accent-primary" />
                  {t("admin.certificates.addVerificationLink")}
                  <span className="text-[10px] text-portal-muted">
                    {t("admin.certificates.alwaysOnTemplate")}
                  </span>
                </li>
                <li>
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-portal-heading">
                    <input
                      type="checkbox"
                      className="mt-0.5 size-4 accent-primary"
                      checked={form.showExcellentBadge ?? false}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          showExcellentBadge: e.target.checked,
                        })
                      }
                    />
                    <span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Medal className="size-3.5 text-gold-dark" aria-hidden />
                        {t("admin.certificates.addExcellentBadge")}
                        <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-violet-700">
                          {t("admin.certificates.popular")}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-portal-muted">
                        {t("admin.certificates.excellentBadgeHint")}
                      </span>
                    </span>
                  </label>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 border-t border-portal pt-4">
              <Button
                type="submit"
                disabled={createCert.isPending || !canSubmit}
                className="h-11 w-full gap-2 rounded-xl bg-primary"
              >
                {createCert.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {createCert.isPending
                  ? t("admin.certificates.generating")
                  : t("admin.certificates.generate")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={createCert.isPending}
                className="h-10 w-full gap-2 rounded-xl"
              >
                <RotateCcw className="size-4" />
                {t("admin.certificates.reset")}
              </Button>
            </div>
          </form>
        </AdminCertFormSection>

        <AdminCertificateTemplatePanel form={form} onChange={setForm} />

        <Card className="flex flex-col overflow-hidden rounded-2xl border border-portal p-0 shadow-sm xl:sticky xl:top-24 xl:self-start">
          <div className="flex shrink-0 items-center justify-between border-b border-portal bg-portal-muted/20 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-primary-dark">{t("admin.certificates.livePreview")}</h2>
              <p className="text-[11px] text-portal-muted">
                {t("admin.certificates.templateLocked")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {previewMutation.isPending ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <Loader2 className="size-3 animate-spin" />
                  {t("admin.certificates.updating")}
                </span>
              ) : preview ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  {t("admin.certificates.ready")}
                </span>
              ) : null}
              <button
                type="button"
                disabled={!preview}
                onClick={() => setFullscreen(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-portal px-2.5 py-1.5 text-[11px] font-semibold text-portal-heading transition hover:border-primary/30 disabled:opacity-40"
              >
                <Maximize2 className="size-3.5" aria-hidden />
                {t("admin.certificates.fullScreen")}
              </button>
            </div>
          </div>

          <div className="max-h-[min(640px,70vh)] min-h-[280px] flex-1 overflow-y-auto p-3">
            {preview ? (
              <CertificateTemplateSlot certificate={preview} />
            ) : (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-portal bg-portal-muted/20 px-6 text-center">
                <Award className="mb-3 size-10 text-portal-muted/40" aria-hidden />
                <p className="text-sm font-medium text-portal-heading">
                  {t("admin.certificates.previewPlaceholder")}
                </p>
                <p className="mt-1 max-w-xs text-xs text-portal-muted">
                  {t("admin.certificates.previewHint")}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AdminCertificatesHistory
        items={pagination.paginatedItems}
        totalAll={history.length}
        nameQuery={nameQuery}
        issueDateFilter={issueDateFilter}
        pagination={pagination}
        onNameQueryChange={setNameQuery}
        onIssueDateChange={setIssueDateFilter}
        onClearFilters={() => {
          setNameQuery("");
          setIssueDateFilter("");
        }}
        onShare={handleShare}
      />

      {fullscreen && preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("admin.certificates.fullscreenAria")}
        >
          <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-portal-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-portal px-4 py-3">
              <p className="text-sm font-bold text-primary-dark">
                {t("admin.certificates.fullScreenPreview")}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="rounded-xl bg-primary text-white"
                  onClick={() => setFullscreen(false)}
                >
                  {t("admin.certificates.close")}
                </Button>
              </div>
            </div>
            <div className="overflow-auto p-4">
              <CertificateTemplateSlot certificate={preview} />
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
