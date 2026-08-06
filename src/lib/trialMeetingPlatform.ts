export type TrialMeetingPlatform =
  | "google_meet"
  | "zoom"
  | "teams"
  | "whatsapp"
  | "custom";

export const TRIAL_MEETING_PLATFORM_OPTIONS: {
  value: TrialMeetingPlatform;
  labelKey: string;
}[] = [
  { value: "google_meet", labelKey: "admin.trialLeads.platformGoogleMeet" },
  { value: "zoom", labelKey: "admin.trialLeads.platformZoom" },
  { value: "teams", labelKey: "admin.trialLeads.platformTeams" },
  { value: "whatsapp", labelKey: "admin.trialLeads.platformWhatsapp" },
  { value: "custom", labelKey: "admin.trialLeads.platformCustom" },
];

export function formatTrialMeetingPlatformLabel(
  platform: TrialMeetingPlatform | undefined,
  t: (key: string) => string
): string {
  if (!platform) return t("admin.trialLeads.notProvided");
  const match = TRIAL_MEETING_PLATFORM_OPTIONS.find((item) => item.value === platform);
  return match ? t(match.labelKey) : platform;
}
