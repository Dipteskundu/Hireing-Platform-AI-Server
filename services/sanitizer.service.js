/**
 * Sanitizes a Gemini/fallback response to strip any phrases implying
 * that the bot has performed a write action.
 * @param {string} text
 * @returns {string}
 */

const FORBIDDEN_PHRASES = [
  "i updated your",
  "i updated the",
  "i deleted your",
  "i deleted the",
  "i applied",
  "i have applied",
  "i created",
  "i posted the",
  "i posted a",
  "i sent",
  "i submitted",
  "i scheduled",
  "i booked",
  "i removed",
];

export function sanitizeResponse(text) {
  if (!text || typeof text !== "string") {
    return "I cannot perform actions directly, but I can guide you on how to do it in the platform.";
  }

  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) {
      return "I cannot perform actions directly, but I can guide you on how to do it in the platform.";
    }
  }

  return text;
}
