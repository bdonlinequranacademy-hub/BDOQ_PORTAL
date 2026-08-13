export const locales = ["en", "bn"] as const;

export type LocaleType = (typeof locales)[number];

export const defaultLocale: LocaleType = "en";

export const LOCALE_STORAGE_KEY = "boq-locale";

type StringMap = Record<string, string>;
type NestedStringMap = Record<string, string | StringMap>;

export interface IPortalMessages {
  nav: StringMap;
  sections: StringMap;
  roles: StringMap;
  portal: StringMap;
  layout: StringMap;
  branding: StringMap;
  auth: StringMap;
  common: StringMap;
  pagination: StringMap;
  search: StringMap;
  filters: StringMap;
  tables: StringMap;
  status: StringMap;
  actions: StringMap;
  sort: StringMap;
  loading: StringMap;
  empty: StringMap;
  months: StringMap;
  payments: {
    methods: StringMap;
    categories: StringMap;
    optional: StringMap;
  };
  admin: {
    dashboard: StringMap;
    payments: StringMap;
    common: StringMap;
    users: StringMap;
    userProfile: StringMap;
    profile: StringMap;
    classes: StringMap;
    classDetail: StringMap;
    classForm: StringMap;
    routine: NestedStringMap;
    liveMonitor: NestedStringMap;
    attendance: StringMap;
    homework: StringMap;
    progress: StringMap;
    curriculum: StringMap;
    classLogs: StringMap;
    earnings: StringMap;
    trialLeads: StringMap;
    admissions: StringMap;
    teacherApplications: StringMap;
    studentRequests: StringMap;
    contact: StringMap;
    optionalPayments: StringMap;
    newsletter: StringMap;
    whatsapp: StringMap;
    certificates: StringMap;
    certificateView: StringMap;
    verifyCertificate: StringMap;
    cms: Record<string, StringMap>;
  };
  student: StringMap;
  teacher: StringMap;
  session: StringMap;
  pages: StringMap;
  labels: StringMap;
}
