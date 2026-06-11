import axios from "axios";

export function getAiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
    if (status === 429) {
      return "Daily AI limit reached — try again later or upgrade your Gemini API plan.";
    }
  }
  return fallback;
}
