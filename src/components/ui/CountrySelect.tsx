import { Select } from "@/components/ui/Select";
import {
  PROFILE_COUNTRIES,
  formatCountryWithFlag,
} from "@/lib/utils/countryDisplay";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  label = "Country",
  required = true,
}: CountrySelectProps) {
  return (
    <Select
      label={required ? `${label} *` : label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">{required ? "Select country…" : "Not set"}</option>
      {PROFILE_COUNTRIES.map((country) => (
        <option key={country} value={country}>
          {formatCountryWithFlag(country)}
        </option>
      ))}
    </Select>
  );
}
