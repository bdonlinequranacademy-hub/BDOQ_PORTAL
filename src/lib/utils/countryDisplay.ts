import {
  WORLD_COUNTRY_ENTRIES,
  countryFlagFromName,
  resolveCountryIso,
} from "@/lib/worldCountries";

export { PROFILE_COUNTRIES, isProfileCountry } from "@/lib/worldCountries";

const ALIAS_TO_ISO: Record<string, string> = {
  bd: "BD",
  usa: "US",
  us: "US",
  uk: "GB",
  england: "GB",
  america: "US",
  ksa: "SA",
  uae: "AE",
  korea: "KR",
};

export function resolveCountryCode(country?: string): string | undefined {
  const iso = resolveCountryIso(country);
  if (iso) return iso;

  if (!country?.trim()) return undefined;
  const key = country.trim().toLowerCase();
  if (ALIAS_TO_ISO[key]) return ALIAS_TO_ISO[key];
  return undefined;
}

export function countryFlag(country?: string): string {
  return countryFlagFromName(country);
}

export function formatCountryWithFlag(country?: string): string {
  if (!country?.trim()) return "";
  return `${countryFlag(country)} ${country.trim()}`;
}

export function uniqueCountries(values: (string | undefined)[]): string[] {
  const set = new Set<string>();
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) set.add(trimmed);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export { WORLD_COUNTRY_ENTRIES };
