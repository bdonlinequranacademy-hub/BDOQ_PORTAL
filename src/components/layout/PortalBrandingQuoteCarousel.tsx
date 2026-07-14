"use client";

import { useEffect, useState } from "react";
import { PORTAL_BRANDING_QUOTES } from "@/lib/islamicPortal";
import { cn } from "@/lib/utils/cn";

function GoldStarDivider() {
  return (
    <div className="my-2 flex items-center justify-center gap-2.5" aria-hidden>
      <span className="h-[1.5px] w-10 rounded-full bg-gradient-to-r from-transparent via-[#D4A853] to-[#D4A853]/80 sm:w-14" />
      <svg className="size-3.5 shrink-0 text-[#D4A853]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2 13.6 8.4 19.9 7.1 16.2 12 19.9 16.9 13.6 15.6 12 21.8 10.4 15.6 4.1 16.9 7.8 12 4.1 7.1 10.4 8.4 12 2.2Z" />
      </svg>
      <span className="h-[1.5px] w-10 rounded-full bg-gradient-to-l from-transparent via-[#D4A853] to-[#D4A853]/80 sm:w-14" />
    </div>
  );
}

const INTERVAL_MS = 5500;

export function PortalBrandingQuoteCarousel() {
  const quotes = PORTAL_BRANDING_QUOTES;
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
      setFadeKey((k) => k + 1);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [quotes.length]);

  const quote = quotes[index] ?? quotes[0];
  if (!quote) return null;

  function goTo(next: number) {
    setIndex(next);
    setFadeKey((k) => k + 1);
  }

  return (
    <div
      className="portal-branding-quote-carousel relative min-w-0 border-t border-[#D4A853]/25 pt-4 md:border-t-0 md:pt-0"
      aria-roledescription="carousel"
      aria-label="Quran and Hadith quotes"
    >
      <div
        key={fadeKey}
        className="portal-branding-quote-slide flex min-h-[7.5rem] flex-col justify-center"
      >
        <p className="text-center font-arabic text-[1.2rem] font-bold leading-relaxed text-[#064E3B] sm:text-[1.35rem]">
          {quote.arabic}
        </p>
        <GoldStarDivider />
        <p className="mx-auto max-w-[22rem] text-center font-display text-[0.95rem] font-bold italic leading-snug text-[#0F5C48] sm:text-[1.02rem]">
          &ldquo;{quote.translation}&rdquo;
        </p>
        <p className="mt-2 text-center font-inter text-[0.8125rem] font-extrabold tracking-wide text-[#B8923F]">
          — {quote.source}
        </p>
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Quote slides"
      >
        {quotes.map((item, i) => (
          <button
            key={`${item.source}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show quote ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "size-1.5 rounded-full transition-all duration-300",
              i === index
                ? "w-4 bg-[#D4A853]"
                : "bg-[#D4A853]/35 hover:bg-[#D4A853]/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
