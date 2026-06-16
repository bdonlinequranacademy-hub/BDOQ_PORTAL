import { create } from "zustand";

export type AiLocale = "en" | "bn";
export type ToastKind = "success" | "error" | "info";

const LOCALE_KEY = "myacademy-ai-locale";

function ensureEnglishLocale() {
  try {
    localStorage.setItem(LOCALE_KEY, "en");
  } catch {
    /* ignore */
  }
}

export interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
}

interface UiState {
  toasts: ToastItem[];
  aiLocale: AiLocale;
  setAiLocale: (locale: AiLocale) => void;
  addToast: (kind: ToastKind, message: string) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  aiLocale: "en",
  setAiLocale: () => {
    ensureEnglishLocale();
    set({ aiLocale: "en" });
  },
  addToast: (kind, message) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), kind, message },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

ensureEnglishLocale();

export const toast = {
  success: (message: string) => useUiStore.getState().addToast("success", message),
  error: (message: string) => useUiStore.getState().addToast("error", message),
  info: (message: string) => useUiStore.getState().addToast("info", message),
};
