/**
 * ChatHistory collection helpers using the raw MongoDB driver (no Mongoose).
 *
 * Collection: "chat_histories"
 * Document shape:
 *   {
 *     userId:    String (firebaseUid) — unique per user
 *     role:      String
 *     messages:  [{ sender: "user"|"bot", text: String, createdAt: Date }]
 *     createdAt: Date
 *     updatedAt: Date
 *   }
 */

export const CHAT_HISTORY_COLLECTION = "chat_histories";

/**
 * Returns the collection reference (assumes db is already connected).
 * @param {import("mongodb").Db} db
 */
export function getChatHistoryCollection(db) {
  return db.collection(CHAT_HISTORY_COLLECTION);
}
