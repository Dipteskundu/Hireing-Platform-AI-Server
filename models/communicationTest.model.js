// models/communicationTest.model.js
// Schema reference for communicationTests collection

/**
 * Document structure for communicationTests collection
 *
 * {
 *   candidateId: string,      // firebaseUid
 *   jobId: ObjectId,
 *   applicationId: ObjectId,   // optional, link to applications
 *   questions: Array<{ id, text, type }>,
 *   answers: Array<{ questionId, answer }>,
 *   score: number,             // 0-100
 *   clarityScore: number,
 *   toneScore: number,
 *   grammarScore: number,
 *   structureScore: number,
 *   feedback: string,
 *   status: "pending" | "in_progress" | "completed",
 *   createdAt: Date,
 *   completedAt: Date
 * }
 */

const STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

const COLLECTION = "communicationTests";

export { STATUS, COLLECTION };
