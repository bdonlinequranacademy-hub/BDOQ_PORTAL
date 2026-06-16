import type { AiLocale } from "@/stores/uiStore";

/** Portal UI and AI content are English-only. */
export function getAiLocale(): AiLocale {
  return "en";
}
