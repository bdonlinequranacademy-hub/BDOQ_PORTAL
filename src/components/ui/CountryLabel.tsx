import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";

interface CountryLabelProps {
  country?: string;
  className?: string;
  showFallback?: boolean;
}

export function CountryLabel({
  country,
  className = "",
  showFallback = false,
}: CountryLabelProps) {
  if (!country?.trim()) {
    if (!showFallback) return null;
    return <span className={className}>🌍 Unknown</span>;
  }

  return <span className={className}>{formatCountryWithFlag(country)}</span>;
}
