/** Country name → international dial code (no +). Mirrors backend `whatsappPhone.ts`. */
export const DIAL_CODE_BY_COUNTRY: Record<string, string> = {
  Bangladesh: "880",
  "United States": "1",
  "United Kingdom": "44",
  Canada: "1",
  Australia: "61",
  "Saudi Arabia": "966",
  UAE: "971",
  "United Arab Emirates": "971",
  Qatar: "974",
  Kuwait: "965",
  Malaysia: "60",
  Singapore: "65",
  Indonesia: "62",
  Pakistan: "92",
  India: "91",
  Egypt: "20",
  Turkey: "90",
  Germany: "49",
  France: "33",
  Italy: "39",
  Spain: "34",
  Netherlands: "31",
  Sweden: "46",
  Norway: "47",
  Japan: "81",
  "South Korea": "82",
  China: "86",
  "New Zealand": "64",
  Ireland: "353",
  Belgium: "32",
  Switzerland: "41",
  Oman: "968",
  Bahrain: "973",
  Jordan: "962",
  Morocco: "212",
  Nigeria: "234",
  Kenya: "254",
  "South Africa": "27",
};

export const DIAL_CODE_OPTIONS = Object.entries(DIAL_CODE_BY_COUNTRY)
  .filter(([name], i, arr) => arr.findIndex(([n]) => n === name) === i)
  .map(([country, code]) => ({ country, code: `+${code}` }))
  .sort((a, b) => a.country.localeCompare(b.country));

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
