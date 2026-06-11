const NAME_TO_CODE: Record<string, string> = {
  Bangladesh: "BD",
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  "Saudi Arabia": "SA",
  UAE: "AE",
  "United Arab Emirates": "AE",
  Qatar: "QA",
  Kuwait: "KW",
  Malaysia: "MY",
  Singapore: "SG",
  Indonesia: "ID",
  Pakistan: "PK",
  India: "IN",
  Egypt: "EG",
  Turkey: "TR",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Netherlands: "NL",
  Sweden: "SE",
  Norway: "NO",
  Japan: "JP",
  "South Korea": "KR",
  China: "CN",
  "New Zealand": "NZ",
  Ireland: "IE",
  Belgium: "BE",
  Switzerland: "CH",
  Oman: "OM",
  Bahrain: "BH",
  Jordan: "JO",
  Morocco: "MA",
  Nigeria: "NG",
  Kenya: "KE",
  "South Africa": "ZA",
};

/** Canonical country names for profile dropdowns (Bangladesh first). */
export const PROFILE_COUNTRIES = [
  "Bangladesh",
  ...Object.keys(NAME_TO_CODE)
    .filter((name) => name !== "Bangladesh" && name !== "United Arab Emirates")
    .sort((a, b) => a.localeCompare(b)),
] as const;

const COUNTRY_CODES: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(NAME_TO_CODE).map(([name, code]) => [name.toLowerCase(), code])
  ),
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

function codeToFlag(code: string): string {
  const upper = code.toUpperCase();
  if (upper.length !== 2) return "🌍";
  return String.fromCodePoint(
    ...upper.split("").map((char) => 127397 + char.charCodeAt(0))
  );
}

export function resolveCountryCode(country?: string): string | undefined {
  if (!country?.trim()) return undefined;
  const trimmed = country.trim();
  if (NAME_TO_CODE[trimmed]) return NAME_TO_CODE[trimmed];
  const key = trimmed.toLowerCase();
  if (COUNTRY_CODES[key]) return COUNTRY_CODES[key];
  if (key.length === 2) return key.toUpperCase();
  return undefined;
}

export function countryFlag(country?: string): string {
  const code = resolveCountryCode(country);
  return code ? codeToFlag(code) : "🌍";
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

export function isProfileCountry(value: string): boolean {
  return PROFILE_COUNTRIES.includes(value as (typeof PROFILE_COUNTRIES)[number]);
}
