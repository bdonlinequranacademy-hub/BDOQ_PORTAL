import { isImageUploadUrl, toPreviewImageUrl, toViewableUploadUrl } from "@/lib/toViewableUploadUrl";

export interface IAdmissionDisplayRow {
  key: string;
  label: string;
  value: string;
  fullWidth?: boolean;
  href?: string;
  imageUrl?: string;
}

export interface IAdmissionDisplaySection {
  title: string;
  rows: IAdmissionDisplayRow[];
}

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  name: "Full name",
  dateOfBirth: "Date of birth",
  age: "Age",
  nationality: "Nationality",
  gender: "Gender",
  email: "Email",
  whatsapp: "WhatsApp",
  guardianWhatsapp: "Guardian WhatsApp",
  currentAddressLine1: "Current address",
  currentAddressLine2: "Address line 2",
  currentCity: "City",
  currentDistrict: "District",
  currentState: "Division / State",
  currentPostalCode: "Postal code",
  currentCountry: "Country",
  sameAsCurrentAddress: "Permanent address same as current",
  permanentAddressLine1: "Permanent address",
  permanentAddressLine2: "Permanent address line 2",
  permanentCity: "Permanent city",
  permanentDistrict: "Permanent district",
  permanentState: "Permanent division / state",
  permanentPostalCode: "Permanent postal code",
  permanentCountry: "Permanent country",
  address: "Address",
  quranReadingLevel: "Quran reading level",
  teachingLanguage: "Teaching language",
  topicsOfInterest: "Topics of interest",
  courseInterest: "Course interest",
  classType: "Class type",
  timezone: "Timezone",
  preferredHour: "Preferred time (hour)",
  preferredMinute: "Preferred time (minute)",
  preferredPeriod: "AM / PM",
  preferredTeacherGender: "Preferred teacher",
  devices: "Devices for class",
  internetType: "Internet connection",
  packagePlan: "Learning package",
  packageName: "Package",
  paymentMethod: "Monthly payment method",
  admissionFeeCurrency: "Admission fee currency",
  admissionFeeAmount: "Admission fee paid",
  admissionFeePaymentMethod: "Admission fee payment method",
  admissionPaymentReference: "Transaction reference",
  admissionPaymentDate: "Payment date",
  admissionPaymentSender: "Sender account / mobile",
  admissionPaymentNote: "Payment note",
  admissionPaymentProofUrl: "Payment proof",
  payCurrentMonthTuition: "Paying this month’s tuition in advance",
  monthlyTuitionAmount: "This month’s tuition amount",
  monthlyTuitionReference: "Monthly tuition reference",
  monthlyTuitionPaymentMethod: "Monthly tuition payment method",
  monthlyTuitionDate: "Monthly tuition payment date",
  monthlyTuitionProofUrl: "Monthly tuition screenshot",
  monthlyTuitionChoice: "Paying this month’s tuition now",
  parentName: "Parent / guardian name",
  guardianName: "Guardian name",
  parentRelationship: "Relationship to student",
  parentWhatsapp: "Parent WhatsApp",
  guardianPhone: "Guardian phone",
  parentEmail: "Parent email",
  referralSources: "How they found us",
  goals: "Learning goals",
  termsAccepted: "Terms accepted",
  locale: "Form language",
};

const VALUE_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  male: "Male",
  female: "Female",
  "not-started": "Not started yet",
  "letters-only": "Arabic letters only",
  "can-read": "Can read Quran",
  "with-tajweed": "Reads with Tajweed",
  bengali: "Bengali",
  english: "English",
  urdu: "Urdu",
  hindi: "Hindi",
  "noorani-qaida": "Noorani Qaida",
  "quran-recitation": "Quran recitation",
  tajweed: "Tajweed",
  hifz: "Hifz (memorization)",
  "islamic-history": "Islamic history",
  "islamic-studies": "Islamic studies",
  arabic: "Arabic language",
  dua: "Dua",
  salah: "Salah",
  private: "Private (one-to-one)",
  batch: "Batch (group)",
  laptop: "Laptop",
  smartphone: "Smartphone",
  tablet: "Tablet",
  wifi: "Wi‑Fi",
  mobile: "Mobile data",
  both: "Wi‑Fi and mobile data",
  facebook: "Facebook",
  youtube: "YouTube",
  google: "Google search",
  friend: "Friend or family",
  bkash: "bKash",
  nagad: "Nagad",
  bank: "Bank transfer",
  paypal: "PayPal",
  cash: "Cash",
  bdt: "BDT",
  usd: "USD",
  AM: "AM",
  PM: "PM",
  en: "English",
  bn: "Bengali",
};

const SECTIONS: { title: string; fields: string[] }[] = [
  {
    title: "Personal information",
    fields: [
      "fullName",
      "name",
      "dateOfBirth",
      "age",
      "nationality",
      "gender",
      "email",
      "whatsapp",
      "guardianWhatsapp",
    ],
  },
  {
    title: "Address",
    fields: [
      "currentAddressLine1",
      "currentAddressLine2",
      "currentState",
      "currentCity",
      "currentDistrict",
      "currentPostalCode",
      "currentCountry",
      "sameAsCurrentAddress",
      "permanentAddressLine1",
      "permanentAddressLine2",
      "permanentState",
      "permanentCity",
      "permanentDistrict",
      "permanentPostalCode",
      "permanentCountry",
    ],
  },
  {
    title: "Course & learning preferences",
    fields: [
      "quranReadingLevel",
      "teachingLanguage",
      "topicsOfInterest",
      "courseInterest",
      "classType",
      "timezone",
      "preferredHour",
      "preferredMinute",
      "preferredPeriod",
      "preferredTeacherGender",
      "devices",
      "internetType",
      "packagePlan",
      "packageName",
      "paymentMethod",
    ],
  },
  {
    title: "Admission fee payment",
    fields: [
      "admissionFeeCurrency",
      "admissionFeeAmount",
      "admissionFeePaymentMethod",
      "admissionPaymentReference",
      "admissionPaymentDate",
      "admissionPaymentSender",
      "admissionPaymentNote",
      "admissionPaymentProofUrl",
      "payCurrentMonthTuition",
      "monthlyTuitionChoice",
      "monthlyTuitionAmount",
      "monthlyTuitionPaymentMethod",
      "monthlyTuitionReference",
      "monthlyTuitionDate",
      "monthlyTuitionProofUrl",
    ],
  },
  {
    title: "Guardian & other details",
    fields: [
      "parentName",
      "guardianName",
      "parentRelationship",
      "parentWhatsapp",
      "guardianPhone",
      "parentEmail",
      "referralSources",
      "goals",
      "termsAccepted",
    ],
  },
];

const HEADER_FIELDS = new Set(["fullName", "name", "email", "whatsapp"]);

const HIDDEN_FIELDS = new Set([
  "admissionPaymentProofPublicId",
  "admissionPaymentProofFile",
  "monthlyTuitionProofPublicId",
  "monthlyTuitionProofFile",
  "locale",
  "password",
  "confirmPassword",
  "passwordHash",
]);

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function formatSingleValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => formatSingleValue(item))
      .filter((part): part is string => Boolean(part));
    return parts.length > 0 ? parts.join(", ") : null;
  }
  if (typeof value === "object") return null;
  const str = String(value).trim();
  if (!str) return null;
  return VALUE_LABELS[str] ?? str;
}

function formatTimePreference(formData: Record<string, unknown>): string | null {
  const hour = formatSingleValue(formData.preferredHour);
  const minute = formatSingleValue(formData.preferredMinute);
  const period = formatSingleValue(formData.preferredPeriod);
  if (!hour && !minute && !period) return null;
  const parts = [hour, minute?.padStart(2, "0")].filter(Boolean);
  const time = parts.join(":");
  return period ? `${time} ${period}` : time || null;
}


export function buildAdmissionDisplaySections(
  formData: Record<string, unknown>
): IAdmissionDisplaySection[] {
  const usedKeys = new Set<string>();
  const sections: IAdmissionDisplaySection[] = [];

  for (const section of SECTIONS) {
    const rows: IAdmissionDisplayRow[] = [];

    for (const key of section.fields) {
      if (HEADER_FIELDS.has(key)) continue;
      if (
        key === "preferredHour" ||
        key === "preferredMinute" ||
        key === "preferredPeriod" ||
        key === "timezone"
      ) {
        continue;
      }

      const value = formatSingleValue(formData[key]);
      if (!value) continue;

      if (key === "admissionPaymentProofUrl" || key === "monthlyTuitionProofUrl") {
        const viewUrl = toViewableUploadUrl(value);
        rows.push({
          key,
          label: FIELD_LABELS[key] ?? humanizeKey(key),
          value: key === "monthlyTuitionProofUrl" ? "Monthly tuition screenshot" : "Payment proof",
          href: viewUrl,
          imageUrl: isImageUploadUrl(viewUrl) ? viewUrl : toPreviewImageUrl(viewUrl),
          fullWidth: true,
        });
        usedKeys.add(key);
        continue;
      }

      rows.push({
        key,
        label: FIELD_LABELS[key] ?? humanizeKey(key),
        value,
        fullWidth: key === "goals" || key === "address" || key.includes("AddressLine"),
      });
      usedKeys.add(key);
    }

    if (section.title === "Course & learning preferences") {
      const combinedTime = formatTimePreference(formData);
      const tz = formatSingleValue(formData.timezone);
      if (combinedTime || tz) {
        rows.push({
          key: "preferredClassTime",
          label: "Preferred class time",
          value:
            combinedTime && tz
              ? `${combinedTime} (${tz})`
              : (combinedTime ?? tz ?? ""),
        });
        usedKeys.add("preferredHour");
        usedKeys.add("preferredMinute");
        usedKeys.add("preferredPeriod");
        usedKeys.add("timezone");
      }
    }

    if (rows.length > 0) {
      sections.push({ title: section.title, rows });
    }
  }

  const extraRows: IAdmissionDisplayRow[] = [];
  for (const [key, raw] of Object.entries(formData)) {
    if (
      usedKeys.has(key) ||
      HEADER_FIELDS.has(key) ||
      HIDDEN_FIELDS.has(key)
    ) {
      continue;
    }
    const value = formatSingleValue(raw);
    if (!value) continue;
    extraRows.push({
      key,
      label: FIELD_LABELS[key] ?? humanizeKey(key),
      value,
      fullWidth: typeof raw === "string" && raw.length > 60,
    });
  }

  if (extraRows.length > 0) {
    sections.push({ title: "Additional information", rows: extraRows });
  }

  return sections;
}
