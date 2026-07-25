import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Lightbulb, Save } from "lucide-react";
import {
  useAdminFaqItem,
  useCreateFaqItem,
  useUpdateFaqItem,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { AdminPricingFormSection } from "@/features/admin/components/pricing/AdminPricingFormSection";
import { AdminCmsStatusBadge } from "@/features/admin/components/shared/AdminCmsStatusBadge";
import { slugify } from "@/features/admin/lib/adminCmsUtils";
import {
  formControlClass,
  formHintClass,
  formLabelClass,
} from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { env } from "@/config/env";

export function AdminFaqFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminFaqItem(isEdit ? id! : "");
  const createItem = useCreateFaqItem();
  const updateItem = useUpdateFaqItem(id ?? "");

  const [externalId, setExternalId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [externalIdTouched, setExternalIdTouched] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setExternalId(existing.externalId);
    setQuestion(existing.question);
    setAnswer(existing.answer);
    setSortOrder(String(existing.sortOrder));
    setShowOnWebsite(existing.showOnWebsite);
    setExternalIdTouched(true);
  }, [existing]);

  useEffect(() => {
    if (isEdit || externalIdTouched || !question.trim()) return;
    setExternalId(`faq-${slugify(question).slice(0, 32)}`);
  }, [isEdit, question, externalIdTouched]);

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const payload = {
      externalId: externalId.trim() || undefined,
      question: question.trim(),
      answer: answer.trim(),
      sortOrder: Number(sortOrder) || 0,
      showOnWebsite,
    };

    if (isEdit) {
      await updateItem.mutateAsync(payload);
    } else {
      await createItem.mutateAsync(payload);
    }
    navigate("/admin/faq");
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading FAQ item…" />
      </PageContainer>
    );
  }

  const isSaving = createItem.isPending || updateItem.isPending;
  const canSave = question.trim().length > 0 && answer.trim().length > 0;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/faq")}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to FAQ
          </button>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {isEdit ? "Edit FAQ Item" : "Create FAQ Item"}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-portal-muted">
            Add or update a question for the public website FAQ accordion.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`${env.publicSiteUrl}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            <Eye className="size-4" aria-hidden />
            Preview site
          </a>
          <Button
            type="button"
            disabled={!canSave || isSaving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? "Saving…" : "Save FAQ"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div className="flex flex-col gap-5">
          <AdminPricingFormSection number={1} title="FAQ Content">
            <label className="block">
              <span className={formLabelClass}>External ID</span>
              <input
                className={cn(formControlClass, "mt-1.5 font-mono text-sm")}
                value={externalId}
                onChange={(e) => {
                  setExternalIdTouched(true);
                  setExternalId(e.target.value);
                }}
                placeholder="faq-online-classes"
              />
              <span className={cn(formHintClass, "mt-1 block")}>
                Stable identifier for i18n and frontend keys. Auto-generated if
                left blank on create.
              </span>
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>Question *</span>
              <input
                className={cn(formControlClass, "mt-1.5")}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How do online Quran classes work?"
                required
              />
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>Answer *</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[160px]")}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write a clear, helpful answer…"
                required
              />
            </label>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={2} title="Display Settings">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Sort order</span>
                <input
                  type="number"
                  className={cn(formControlClass, "mt-1.5")}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
                <span className={cn(formHintClass, "mt-1 block")}>
                  Lower numbers appear first in the FAQ list.
                </span>
              </label>

              <fieldset>
                <legend className={formLabelClass}>Visibility</legend>
                <div className="mt-3 space-y-2">
                  {(
                    [
                      {
                        value: true,
                        label: "Published",
                        hint: "Shown on the public website",
                      },
                      {
                        value: false,
                        label: "Draft",
                        hint: "Hidden until published",
                      },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.label}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition",
                        showOnWebsite === opt.value
                          ? "border-primary/40 bg-primary/5"
                          : "border-portal hover:border-primary/25"
                      )}
                    >
                      <input
                        type="radio"
                        name="faq-visibility"
                        className="mt-1 accent-primary"
                        checked={showOnWebsite === opt.value}
                        onChange={() => setShowOnWebsite(opt.value)}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-portal-heading">
                          {opt.label}
                        </span>
                        <span className="text-xs text-portal-muted">
                          {opt.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </AdminPricingFormSection>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
              Preview
            </p>
            <details className="mt-3 rounded-xl border border-portal bg-portal-muted/20">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-portal-heading">
                {question.trim() || "Your question"}
              </summary>
              <div className="border-t border-portal px-4 py-3 text-sm leading-relaxed text-portal-muted">
                {answer.trim() || "Answer preview…"}
              </div>
            </details>
            <div className="mt-3">
              <AdminCmsStatusBadge showOnWebsite={showOnWebsite} />
            </div>
          </Card>

          <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary-dark" aria-hidden />
              <h2 className="text-sm font-bold text-primary-dark">Tips</h2>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-portal-muted">
              <li>Keep questions concise — users scan the accordion quickly.</li>
              <li>Answer in plain language; mention BOQ policies where relevant.</li>
              <li>Use sort order to put the most common questions first.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </PageContainer>
  );
}
