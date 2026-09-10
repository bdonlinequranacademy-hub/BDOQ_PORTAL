import React, { useState } from "react";
import { UserRound, BookOpen, Edit2, Plus } from "lucide-react";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { Button } from "../Button";
import { usePortalTranslation } from "@/i18n/LocaleProvider";


interface ApplicationDataViewProps {
  applicationId: string;
  applicationData: Record<string, unknown>;
  onUpdate: (applicationId: string, updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

const BASIC_INFO_KEYS = [
  "fullName",
  "email",
  "emailAddress",
  "whatsapp",
  "whatsappNumber",
  "dob",
  "dateOfBirth",
  "gender",
  "country",
  "currentCountry",
  "timezone",
  "age",
  "nationality",
  "profession",
  "city",
];

const LEARNING_PREF_KEYS = [
  "quranReadingLevel",
  "topics",
  "topicsOfInterest",
  "classType",
  "preferredClassType",
  "language",
  "languagePreference",
  "preferredDays",
  "preferredTime",
  "goal",
  "availability",
];

const HIDDEN_KEYS = [
  "prefillToken",
  "admissionPaymentProofPublicId",
  "paymentProofPublicId",
  "termsAccepted",
  "token",
  "id",
  "_id",
];

// Helper to format camelCase or snake_case to Title Case
const formatKeyName = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
  return result.charAt(0).toUpperCase() + result.slice(1).trim();
};

const renderValue = (value: unknown, t: any) => {
  if (value == null || value === "") {
    return <span className="text-portal-muted italic">{t("labels.not_provided") || "Not provided"}</span>;
  }

  if (typeof value === "boolean") {
    return value ? (t("labels.yes") || "Yes") : (t("labels.no") || "No");
  }
  if (value === "true") return t("labels.yes") || "Yes";
  if (value === "false") return t("labels.no") || "No";

  const strValue = String(value);
  if (
    strValue.startsWith("http") &&
    (strValue.includes("cloudinary.com") || strValue.match(/\.(jpeg|jpg|gif|png|webp)$/i))
  ) {
    return (
      <a href={strValue} target="_blank" rel="noreferrer" className="mt-2 block">
        <img
          src={strValue}
          alt="Attachment"
          className="max-h-40 rounded-lg border border-portal object-contain shadow-sm"
        />
      </a>
    );
  }

  return <span className="break-words">{strValue}</span>;
};

export const ApplicationDataView: React.FC<ApplicationDataViewProps> = ({
  applicationId,
  applicationData,
  onUpdate,
  isUpdating,
}) => {
  const { t } = usePortalTranslation();
  const [editingField, setEditingField] = useState<{ key: string; value: string; label: string } | null>(null);

  const handleEditClick = (key: string, value: unknown, label: string) => {
    setEditingField({ key, value: String(value ?? ""), label });
  };

  const handleSaveEdit = async () => {
    if (!editingField) return;
    const updated = { ...applicationData };
    
    // If the value is empty, we remove the key, otherwise we update it
    if (!editingField.value.trim()) {
      delete updated[editingField.key];
    } else {
      updated[editingField.key] = editingField.value;
    }
    
    await onUpdate(applicationId, updated);
    setEditingField(null);
  };

  const basicInfo: Record<string, unknown> = {};
  const learningPrefs: Record<string, unknown> = {};
  const otherInfo: Record<string, unknown> = {};

  Object.entries(applicationData).forEach(([key, value]) => {
    if (BASIC_INFO_KEYS.includes(key)) {
      basicInfo[key] = value;
    } else if (LEARNING_PREF_KEYS.includes(key)) {
      learningPrefs[key] = value;
    } else {
      otherInfo[key] = value;
    }
  });

  const renderSection = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    data: Record<string, unknown>
  ) => {
    const entries = Object.entries(data).filter(([key]) => !HIDDEN_KEYS.includes(key));
    if (entries.length === 0) return null;

    return (
      <section className="rounded-2xl border border-portal bg-portal-surface p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary-dark">{icon}</span>
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-sm text-portal-muted">{subtitle}</p>
        </div>

        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([key, value]) => {
            const label = formatKeyName(key);
            // Check if there is a translation for this specific key
            // We use a generic fallback if the translation doesn't exist
            const translatedLabel = t(`applicationData.${key}`) || label;
            
            return (
              <div
                key={key}
                className="group relative rounded-xl bg-portal-muted/20 px-3 py-2 transition hover:bg-portal-muted/30"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-portal-muted">
                  {translatedLabel}
                </dt>
                <dd className="mt-1 font-medium text-portal-heading pr-8">
                  {renderValue(value, t)}
                </dd>
                <button
                  onClick={() => handleEditClick(key, value, translatedLabel)}
                  disabled={isUpdating}
                  title={t("actions.edit")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-portal-muted opacity-0 transition-opacity hover:text-primary group-hover:opacity-100 disabled:opacity-0"
                >
                  <Edit2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </dl>
      </section>
    );
  };

  // Provide fallback text if translation is not found
  const basicInfoTitle = t("applicationData.basicInfo") || "Basic Information";
  const basicInfoDesc = t("applicationData.basicInfoDesc") || "Personal details submitted during admission.";
  
  const learningPrefsTitle = t("applicationData.learningPrefs") || "Learning Preferences";
  const learningPrefsDesc = t("applicationData.learningPrefsDesc") || "Course preferences and availability.";
  
  const otherDetailsTitle = t("applicationData.otherDetails") || "Other Details";
  const otherDetailsDesc = t("applicationData.otherDetailsDesc") || "Additional information from the application.";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="space-y-5 lg:col-span-2">
        {renderSection(
          basicInfoTitle,
          basicInfoDesc,
          <UserRound className="size-5" />,
          basicInfo
        )}

        {renderSection(
          learningPrefsTitle,
          learningPrefsDesc,
          <BookOpen className="size-5" />,
          learningPrefs
        )}

        {renderSection(
          otherDetailsTitle,
          otherDetailsDesc,
          <Plus className="size-5" />,
          otherInfo
        )}
      </div>

      {/* Edit Information Modal */}
      <Modal
        open={!!editingField}
        onClose={() => setEditingField(null)}
        title={t("applicationData.editInformation") || "Edit Information"}
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-portal-heading mb-1">
              {editingField?.label}
            </label>
            <Input
              value={editingField?.value || ""}
              onChange={(e) =>
                setEditingField((prev) => (prev ? { ...prev, value: e.target.value } : null))
              }
              placeholder={t("applicationData.infoDetailsPlaceholder") || "Enter details... (leave blank to remove)"}
              autoFocus
              className="bg-white text-portal-heading"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setEditingField(null)}
              disabled={isUpdating}
            >
              {t("actions.cancel") || "Cancel"}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              {t("actions.save") || "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
