import { WORLD_COUNTRY_ENTRIES } from "@/lib/worldCountries";

/** Country name → international dial code (no +). */
export const DIAL_CODE_BY_COUNTRY: Record<string, string> = Object.fromEntries(
  WORLD_COUNTRY_ENTRIES.map((entry) => [entry.name, entry.dialCodeDigits])
);
DIAL_CODE_BY_COUNTRY.UAE = DIAL_CODE_BY_COUNTRY["United Arab Emirates"] ?? "971";

export const DIAL_CODE_OPTIONS = WORLD_COUNTRY_ENTRIES.map((entry) => ({
  country: entry.name,
  code: entry.dialCode,
  iso: entry.iso,
})).sort((a, b) => a.country.localeCompare(b.country));

export function dialCodeForCountry(country?: string): string | undefined {
  if (!country?.trim()) return undefined;
  const trimmed = country.trim();
  if (DIAL_CODE_BY_COUNTRY[trimmed]) return DIAL_CODE_BY_COUNTRY[trimmed];
  const lower = trimmed.toLowerCase();
  const match = Object.entries(DIAL_CODE_BY_COUNTRY).find(
    ([name]) => name.toLowerCase() === lower
  );
  return match?.[1];
}
