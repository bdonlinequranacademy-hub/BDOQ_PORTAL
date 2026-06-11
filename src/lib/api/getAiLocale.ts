import { useUiStore, type AiLocale } from "@/stores/uiStore";

export function getAiLocale(): AiLocale {
  return useUiStore.getState().aiLocale;
}
