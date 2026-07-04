import { DIAL_CODE_BY_COUNTRY, dialCodeForCountry } from "@/lib/countryDialCodes";

const SORTED_DIAL_CODES = [...new Set(Object.values(DIAL_CODE_BY_COUNTRY))].sort(
  (a, b) => b.length - a.length
);

export type ParsedWhatsApp = {
  e164: string;
  waMeDigits: string;
  display: string;
};

export type ParseWhatsAppResult =
  | { ok: true; value: ParsedWhatsApp }
  | { ok: false; error: string };

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

function detectInternationalDigits(digits: string): string | null {
  for (const code of SORTED_DIAL_CODES) {
    if (digits.startsWith(code) && digits.length > code.length + 6) {
      return digits;
    }
  }
  return null;
}

function formatDisplay(waMeDigits: string): string {
  return `+${waMeDigits}`;
}

function validateLength(waMeDigits: string): string | null {
  if (waMeDigits.length < 10 || waMeDigits.length > 15) {
    return "Number must be 10–15 digits including country code.";
  }
  if (waMeDigits.startsWith("0")) {
    return "Remove leading 0 or include full country code (e.g. +880…).";
  }
  return null;
}

export function parseWhatsApp(
  raw: string,
  countryHint?: string
): ParseWhatsAppResult {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) {
    return { ok: false, error: "WhatsApp number is required." };
  }

  const digits = digitsOnly(trimmed);
  if (!digits) {
    return { ok: false, error: "Enter a valid phone number." };
  }

  const hasPlus = trimmed.startsWith("+");
  let waMeDigits: string;

  if (hasPlus || detectInternationalDigits(digits)) {
    waMeDigits = detectInternationalDigits(digits) ?? digits;
  } else {
    const dial = dialCodeForCountry(countryHint);
    if (!dial) {
      return {
        ok: false,
        error: "Select your country first, or type the number with + country code.",
      };
    }
    let local = digits;
    if (local.startsWith("0")) local = local.slice(1);
    waMeDigits = local.startsWith(dial) ? local : `${dial}${local}`;
  }

  const lengthError = validateLength(waMeDigits);
  if (lengthError) {
    return { ok: false, error: lengthError };
  }

  return {
    ok: true,
    value: {
      e164: `+${waMeDigits}`,
      waMeDigits,
      display: formatDisplay(waMeDigits),
    },
  };
}

export function buildWaMeUrl(waMeDigits: string, message?: string): string {
  const base = `https://wa.me/${waMeDigits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function waMeUrlFromRaw(
  raw: string,
  countryHint?: string,
  message?: string
): string | null {
  const parsed = parseWhatsApp(raw, countryHint);
  if (!parsed.ok) return null;
  return buildWaMeUrl(parsed.value.waMeDigits, message);
}

/** Split stored E.164 for dial-code + local input UI. */
export function splitWhatsAppForInput(
  e164: string,
  countryHint?: string
): { dialCode: string; local: string } {
  const digits = digitsOnly(e164);
  if (!digits) {
    const dial = dialCodeForCountry(countryHint) ?? "880";
    return { dialCode: dial, local: "" };
  }
  for (const code of SORTED_DIAL_CODES) {
    if (digits.startsWith(code)) {
      return { dialCode: code, local: digits.slice(code.length) };
    }
  }
  return { dialCode: dialCodeForCountry(countryHint) ?? "", local: digits };
}

export function composeWhatsAppFromParts(
  dialCode: string,
  local: string,
  countryHint?: string
): ParseWhatsAppResult {
  const dial = dialCode.replace(/\D/g, "");
  const localDigits = local.replace(/\D/g, "");
  if (!localDigits) {
    return { ok: false, error: "Enter your WhatsApp number." };
  }
  const raw = dial ? `+${dial}${localDigits}` : localDigits;
  return parseWhatsApp(raw, countryHint);
}
