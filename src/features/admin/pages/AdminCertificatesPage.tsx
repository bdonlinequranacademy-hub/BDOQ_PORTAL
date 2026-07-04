import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Loader2,
  Medal,
  RotateCcw,
  Search,
  Sparkles,
  User,
  X,
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
import { Textarea } from "@/components/ui/Textarea";
import { PageLoading } from "@/components/ui/PageLoading";
import { CertificateTemplateSlot } from "@/features/certificates/components/CertificateTemplateSlot";
import { emptyCertificateForm, gradeShowsBadge } from "@/lib/certificateDefaults";
import { formatCertificateDate } from "@/lib/certificateFormat";
import { filterCertificates } from "@/lib/certificateSearch";
import type { CertificateView } from "@/types/models";

const DURATION_PRESETS = ["1 Month", "3 Months", "6 Months", "12 Months"] as const;
const GRADE_PRESETS = ["Excellent (A+)", "Very Good (A)", "Good (B+)", "Pass"] as const;

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-portal bg-portal-surface-muted/30 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-portal-heading">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-portal-muted">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function PresetChips({
  options,
  value,
  onSelect,
}: {
  options: readonly string[];
  value: string;
  onSelect: (next: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value.trim().toLowerCase() === option.toLowerCase();
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-portal bg-portal text-portal-muted hover:border-primary/40 hover:text-portal-heading"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function CertificateForm({
  form,
  onChange,
  onSubmit,
  showActions = true,
  onReset,
  busy,
}: {
  form: CertificateFormPayload;
  onChange: (next: CertificateFormPayload) => void;
  onSubmit: (e: FormEvent) => void;
  showActions?: boolean;
  onReset: () => void;
  busy: boolean;
}) {
  const canSubmit = Boolean(form.studentName.trim() && form.courseName.trim());

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormSection
        icon={<User className="size-4" />}
        title="Student information"
        description="Name shown on the certificate in English and Bengali."
      >
        <Input
          label="Student name (English)"
          placeholder="e.g. Md. Abdullah Hasan"
          value={form.studentName}
          onChange={(e) => onChange({ ...form, studentName: e.target.value })}
          required
          fieldSize="lg"
        />
        <Input
          label="Student name (Bengali)"
          placeholder="যেমন: মো. আব্দুল্লাহ হাসান"
          value={form.studentNameBn ?? ""}
          onChange={(e) => onChange({ ...form, studentNameBn: e.target.value })}
          fieldSize="lg"
        />
        <Input
          label="Student ID"
          hint="Optional portal ID printed on the certificate."
          placeholder="e.g. STU-2024-0567"
          value={form.studentPortalId ?? ""}
          onChange={(e) => onChange({ ...form, studentPortalId: e.target.value })}
        />
      </FormSection>

      <FormSection
        icon={<BookOpen className="size-4" />}
        title="Course details"
        description="Course title appears on the green banner."
      >
        <Input
          label="Course name (English)"
          placeholder="e.g. Nazra Quran with Tajweed"
          value={form.courseName}
          onChange={(e) => onChange({ ...form, courseName: e.target.value })}
          required
          fieldSize="lg"
        />
        <Input
          label="Course name (Bengali)"
          placeholder="যেমন: নজরা কুরআন (তাজবিদের সহিত)"
          value={form.courseNameBn ?? ""}
          onChange={(e) => onChange({ ...form, courseNameBn: e.target.value })}
          fieldSize="lg"
        />
        <div>
          <span className="form-label">Course duration</span>
          <div className="mt-1.5 space-y-2">
            <PresetChips
              options={DURATION_PRESETS}
              value={form.courseDuration}
              onSelect={(courseDuration) => onChange({ ...form, courseDuration })}
            />
            <Input
              placeholder="Custom duration"
              value={form.courseDuration}
              onChange={(e) => onChange({ ...form, courseDuration: e.target.value })}
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<CalendarDays className="size-4" />}
        title="Certificate metadata"
        description="Issue date, grade, and performance badge settings."
      >
        <Input
          label="Issue date"
          type="date"
          value={form.issueDate ?? ""}
          onChange={(e) => onChange({ ...form, issueDate: e.target.value })}
          required
        />
        <div>
          <span className="form-label">Result / grade</span>
          <div className="mt-1.5 space-y-2">
            <PresetChips
              options={GRADE_PRESETS}
              value={form.grade}
              onSelect={(grade) =>
                onChange({
                  ...form,
                  grade,
                  showExcellentBadge: gradeShowsBadge(grade),
                })
              }
            />
            <Input
              placeholder="Custom grade"
              value={form.grade}
              onChange={(e) => {
                const grade = e.target.value;
                onChange({
                  ...form,
                  grade,
                  showExcellentBadge: gradeShowsBadge(grade),
                });
              }}
              required
            />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-portal bg-white/60 px-3.5 py-3 text-sm text-portal-heading dark:bg-portal-surface/40">
          <input
            type="checkbox"
            checked={form.showExcellentBadge ?? false}
            onChange={(e) =>
              onChange({ ...form, showExcellentBadge: e.target.checked })
            }
            className="size-4 rounded border-portal text-primary focus:ring-primary"
          />
          <div>
            <span className="flex items-center gap-1.5 font-medium">
              <Medal className="size-4 text-[#D4A853]" />
              Show Excellent Performance badge
            </span>
            <span className="mt-0.5 block text-xs text-portal-muted">
              Displays the gold medal on the left side of the certificate.
            </span>
          </div>
        </label>
      </FormSection>

      <FormSection
        icon={<GraduationCap className="size-4" />}
        title="Performance note"
        description="Shown below the course banner on the certificate."
      >
        <Textarea
          label="English"
          value={form.performanceTextEn ?? ""}
          onChange={(e) => onChange({ ...form, performanceTextEn: e.target.value })}
          rows={2}
          className="min-h-[4.5rem] text-sm"
        />
        <Textarea
          label="Bengali"
          value={form.performanceTextBn ?? ""}
          onChange={(e) => onChange({ ...form, performanceTextBn: e.target.value })}
          rows={2}
          className="min-h-[4.5rem] text-sm"
        />
      </FormSection>

      {showActions ? (
        <div className="flex flex-col gap-2 border-t border-portal pt-4">
          <Button
            type="submit"
            disabled={busy || !canSubmit}
            className="h-11 w-full gap-2 rounded-xl bg-primary shadow-sm"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {busy ? "Generating certificate…" : "Generate certificate"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            disabled={busy}
            className="h-10 w-full gap-2 rounded-xl"
          >
            <RotateCcw className="size-4" />
            Reset form
          </Button>
        </div>
      ) : null}
    </form>
  );
}

function CertificateHistoryRow({ certificate }: { certificate: CertificateView }) {
  const initial = certificate.studentName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-portal-surface-muted/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy">{certificate.studentName}</p>
          <p className="mt-0.5 truncate text-sm text-zinc-600">{certificate.courseName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] font-medium text-zinc-600">
              {certificate.certificateId}
            </span>
            <span className="text-xs text-zinc-500">
              {formatCertificateDate(certificate.issueDate)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
              {certificate.grade}
            </span>
          </div>
        </div>
      </div>
      <Link
        to={`/admin/certificates/${certificate.id}`}
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 sm:self-center"
      >
        <FileText className="size-3.5" />
        Open & download
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}

export function AdminCertificatesPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CertificateFormPayload>(emptyCertificateForm);
  const [preview, setPreview] = useState<CertificateView | null>(null);
  const [nameQuery, setNameQuery] = useState("");
  const [issueDateFilter, setIssueDateFilter] = useState("");
  const { data: history = [], isLoading } = useAdminCertificates();
  const createCert = useCreateCertificate();

  const filteredHistory = useMemo(
    () =>
      filterCertificates(history, {
        nameQuery,
        issueDate: issueDateFilter,
      }),
    [history, nameQuery, issueDateFilter]
  );

  const hasActiveFilters = Boolean(nameQuery.trim() || issueDateFilter);

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

  if (isLoading) return <PageLoading label="Loading certificates…" />;

  const canSubmit = Boolean(form.studentName.trim() && form.courseName.trim());

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="rounded-2xl border border-portal bg-gradient-to-br from-primary/5 via-portal-surface to-portal-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Award className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy">Certificate generator</h1>
                <p className="text-sm text-zinc-500">
                  Create, preview, and download BDOQ Academy certificates.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-portal bg-white/70 px-4 py-2.5 text-center dark:bg-portal-surface/60">
              <p className="text-lg font-bold text-navy">{history.length}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Issued
              </p>
            </div>
            <div className="rounded-xl border border-portal bg-white/70 px-4 py-2.5 text-center dark:bg-portal-surface/60">
              <p className="text-lg font-bold text-navy">
                {history.filter((c) => c.showExcellentBadge).length}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                With badge
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <Card className="flex flex-col overflow-hidden rounded-2xl border border-portal p-0 shadow-sm lg:h-[min(720px,calc(100vh-13rem))]">
          <div className="shrink-0 border-b border-portal bg-portal-surface-muted/40 px-5 py-4">
            <h2 className="text-sm font-bold text-navy">Certificate details</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Fill in the fields below. Preview updates automatically.
            </p>
          </div>
          <div className="min-h-0 max-h-[65vh] flex-1 overflow-y-auto p-5 lg:max-h-none">
            <CertificateForm
              form={form}
              onChange={setForm}
              onSubmit={handleSubmit}
              onReset={handleReset}
              busy={createCert.isPending}
              showActions={false}
            />
          </div>
          <div className="shrink-0 border-t border-portal bg-portal-surface/95 px-5 py-4 backdrop-blur-sm">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={createCert.isPending || !canSubmit}
                className="h-11 flex-1 gap-2 rounded-xl bg-primary shadow-sm"
              >
                {createCert.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {createCert.isPending ? "Generating…" : "Generate certificate"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={createCert.isPending}
                className="h-11 gap-2 rounded-xl sm:px-5"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden rounded-2xl border border-portal p-0 shadow-sm lg:h-[min(720px,calc(100vh-13rem))]">
          <div className="flex shrink-0 items-center justify-between border-b border-portal bg-portal-surface-muted/40 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-navy">Live preview</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Final layout before generating the certificate.
              </p>
            </div>
            {previewMutation.isPending ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                <Loader2 className="size-3 animate-spin" />
                Updating
              </span>
            ) : preview ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Ready
              </span>
            ) : null}
          </div>
          <div className="min-h-0 max-h-[50vh] flex-1 overflow-y-auto p-4 lg:max-h-none">
            {preview ? (
              <CertificateTemplateSlot certificate={preview} />
            ) : (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-portal bg-portal-surface-muted/30 px-6 text-center">
                <Award className="mb-3 size-10 text-zinc-300" />
                <p className="text-sm font-medium text-zinc-600">Preview will appear here</p>
                <p className="mt-1 max-w-xs text-xs text-zinc-500">
                  Enter student name and course name to see the certificate layout in real time.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-portal p-0 shadow-sm">
        <div className="border-b border-portal bg-portal-surface-muted/30 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">Certificate history</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {hasActiveFilters
                  ? `Showing ${filteredHistory.length} of ${history.length}`
                  : `${history.length} certificate${history.length === 1 ? "" : "s"} issued`}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-xl">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Search by student name"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  className="h-10 rounded-xl pl-9"
                />
              </div>
              <Input
                type="date"
                value={issueDateFilter}
                onChange={(e) => setIssueDateFilter(e.target.value)}
                className="h-10 rounded-xl sm:w-44"
                aria-label="Filter by issue date"
              />
              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setNameQuery("");
                    setIssueDateFilter("");
                  }}
                  className="h-10 gap-1.5 rounded-xl px-3"
                >
                  <X className="size-4" />
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        {history.length === 0 ? (
          <p className="p-8 text-center text-sm text-zinc-500">
            No certificates generated yet. Create your first certificate above.
          </p>
        ) : filteredHistory.length === 0 ? (
          <p className="p-8 text-center text-sm text-zinc-500">
            No certificates match your search. Try another name or date.
          </p>
        ) : (
          <div
            className="max-h-[min(480px,42vh)] divide-y divide-portal overflow-y-auto overscroll-contain"
            role="list"
            aria-label="Certificate history"
          >
            {filteredHistory.map((certificate) => (
              <CertificateHistoryRow key={certificate.id} certificate={certificate} />
            ))}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
