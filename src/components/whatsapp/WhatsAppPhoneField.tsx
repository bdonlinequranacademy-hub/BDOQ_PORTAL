import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DIAL_CODE_OPTIONS, dialCodeForCountry } from "@/lib/countryDialCodes";
import {
  composeWhatsAppFromParts,
  splitWhatsAppForInput,
} from "@/lib/whatsapp";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface WhatsAppPhoneFieldProps {
  id?: string;
  label?: string;
  country: string;
  value: string;
  onChange: (e164: string) => void;
  onError?: (message: string | null) => void;
  required?: boolean;
  hint?: string;
  className?: string;
}

export function WhatsAppPhoneField({
  id = "whatsapp",
  label = "WhatsApp number",
  country,
  value,
  onChange,
  onError,
  required,
  hint,
  className,
}: WhatsAppPhoneFieldProps) {
  const initial = splitWhatsAppForInput(value, country);
  const [dialCode, setDialCode] = useState(
    initial.dialCode || dialCodeForCountry(country) || "880"
  );
  const [local, setLocal] = useState(initial.local);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const next = splitWhatsAppForInput(value, country);
    setDialCode(next.dialCode || dialCodeForCountry(country) || "880");
    setLocal(next.local);
  }, [value, country]);

  useEffect(() => {
    const fromCountry = dialCodeForCountry(country);
    if (fromCountry && !value) {
      setDialCode(fromCountry);
    }
  }, [country, value]);

  function commit(nextDial: string, nextLocal: string) {
    if (!nextLocal.trim()) {
      setError(null);
      onError?.(null);
      onChange("");
      return;
    }
    const parsed = composeWhatsAppFromParts(nextDial, nextLocal, country);
    if (!parsed.ok) {
      setError(parsed.error);
      onError?.(parsed.error);
      return;
    }
    setError(null);
    onError?.(null);
    onChange(parsed.value.e164);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-xs font-medium text-navy">
        {label}
        {required ? <span className="text-brand-red"> *</span> : null}
      </label>
      <div className="flex items-stretch gap-2">
        <div className="relative shrink-0">
          <select
            aria-label="Country dial code"
            value={dialCode}
            onChange={(e) => {
              const next = e.target.value;
              setDialCode(next);
              commit(next, local);
            }}
            className={cn(
              formControlClass,
              "h-11 w-[7.5rem] appearance-none bg-zinc-50 pl-2 pr-7 text-sm font-medium"
            )}
          >
            {DIAL_CODE_OPTIONS.map((opt) => (
              <option key={`${opt.country}-${opt.code}`} value={opt.code.replace("+", "")}>
                {opt.code}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="1712 345 678"
          value={local}
          onChange={(e) => {
            const next = e.target.value;
            setLocal(next);
            commit(dialCode, next);
          }}
          onBlur={() => commit(dialCode, local)}
          className={cn(formControlClass, "h-11 min-w-0 flex-1")}
        />
      </div>
      {value ? (
        <p className="text-xs text-emerald-700">Saved as {value}</p>
      ) : (
        <p className="text-xs text-zinc-500">
          {hint ??
            "Use your active WhatsApp number with country code — required for academy messages."}
        </p>
      )}
      {error ? <p className="text-xs text-brand-red">{error}</p> : null}
    </div>
  );
}
