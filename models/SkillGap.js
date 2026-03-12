// models/SkillGap.js
// Schema reference for skillGaps collection

/**
 * Document structure for skillGaps collection
 *
 * {
 *   _id: ObjectId,
 *   applicationId: ObjectId,   // Link to applications collection
 *   candidateId: string,       // firebaseUid
 *   jobId: ObjectId,           // Link to find_jobs collection
 *   matchedSkills: Array<string>, // Skills candidate has that job requires
 *   missingSkills: Array<string>, // Skills job requires that candidate lacks
 *   matchScore: number,        // 0-100 percentage match
 *   learningSuggestions: Array<string>, // AI-generated learning tips for missing skills
 *   createdAt: Date
 * }
 */

const COLLECTION = "skillGaps";

module.exports = {
  COLLECTION,
};
