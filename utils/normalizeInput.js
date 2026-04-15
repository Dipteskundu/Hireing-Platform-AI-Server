/**
 * Normalize user input: trim, lowercase, remove punctuation.
 * @param {string} input
 * @returns {string}
 */
export function normalizeInput(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[.,?!;:'"()]/g, "")
    .replace(/\s+/g, " ");
}
