import {
  useSubmitTeacherOptionalPayment,
  useTeacherOptionalPayments,
  useTeacherProfile,
} from "@/features/teacher/hooks/useTeacher";
import { OptionalPaymentsPanel } from "@/features/optional-payments/OptionalPaymentsPanel";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function TeacherGiftsPage() {
  const { t } = usePortalTranslation();
  const { data: profile } = useTeacherProfile();
  const { data: payments = [], isLoading, isError, refetch } =
    useTeacherOptionalPayments();
  const submit = useSubmitTeacherOptionalPayment();

  return (
    <OptionalPaymentsPanel
      title={t("teacher.optionalPaymentsTitle")}
      subtitle={t("teacher.optionalPaymentsSubtitle")}
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
