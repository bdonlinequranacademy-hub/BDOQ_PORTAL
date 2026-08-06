import worldTimezones from "@/lib/data/worldTimezones.json";

export interface IProfileTimezoneOption {
  value: string;
  label: string;
}

type ITzRow = {
  value: string;
  label: string;
  iso: string;
  country: string;
  offsetMinutes: number;
};

export const PROFILE_TIMEZONE_OPTIONS: IProfileTimezoneOption[] = (
  worldTimezones as ITzRow[]
).map((tz) => ({
  value: tz.value,
  label: tz.label,
}));

/** Backward-compatible list of IANA timezone ids. */
export const PROFILE_TIMEZONES = PROFILE_TIMEZONE_OPTIONS.map((tz) => tz.value);

export const DEFAULT_PROFILE_TIMEZONE = "Asia/Dhaka";

export function formatProfileTimezoneLabel(value: string): string {
  const match = PROFILE_TIMEZONE_OPTIONS.find((tz) => tz.value === value);
  return match?.label ?? value.replace(/_/g, " ");
}
