import {
  useStudentOptionalPayments,
  useStudentProfile,
  useSubmitStudentOptionalPayment,
} from "@/features/student/hooks/useStudent";
import { OptionalPaymentsPanel } from "@/features/optional-payments/OptionalPaymentsPanel";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentGiftsPage() {
  const { t } = usePortalTranslation();
  const { data: profile } = useStudentProfile();
  const { data: payments = [], isLoading, isError, refetch } =
    useStudentOptionalPayments();
  const submit = useSubmitStudentOptionalPayment();

  return (
    <OptionalPaymentsPanel
      title={t("student.optionalPaymentsTitle")}
      subtitle={t("student.optionalPaymentsSubtitle")}
      tuitionHref="/student/payments"
      payerName={profile?.name}
      payerEmail={profile?.email}
      payerWhatsapp={profile?.whatsapp}
      payments={payments}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => void refetch()}
      onSubmit={(formData) => submit.mutate(formData)}
      isSubmitting={submit.isPending}
    />
  );
}
