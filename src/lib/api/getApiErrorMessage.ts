export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    const message = error.response.data.message.trim();
    if (message) {
      const lowerMessage = message.toLowerCase();
      if (
        lowerMessage.includes("email already exists") ||
        lowerMessage.includes("duplicate email") ||
        lowerMessage.includes("email is already registered") ||
        (lowerMessage.includes("duplicate key error") && lowerMessage.includes("email")) ||
        lowerMessage.includes("e11000")
      ) {
        return "এই ইমেইলটি অলরেডি আমাদের সিস্টেমে আছে। দয়া করে অন্য ইমেইল ব্যবহার করুন।";
      }
      return message;
    }
  }

  return fallback;
}
