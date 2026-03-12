// models/Resume.js
// Schema reference for resumes collection

/**
 * Document structure for resumes collection
 *
 * {
 *   _id: ObjectId,
 *   candidateId: string,       // firebaseUid
 *   fileUrl: string,           // URL or path to the stored resume
 *   originalName: string,      // Original file name
 *   mimeType: string,          // File type (e.g., application/pdf)
 *   size: number,              // File size in bytes
 *   extractedText: string,     // Raw text extracted from the file
 *   extractedSkills: Array<string>, // Skills identified by AI
 *   extractedExperience: number,    // Years of experience
 *   extractedTechnologies: Array<string>,
 *   extractedRoles: Array<string>,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

const COLLECTION = "resumes";

module.exports = {
  COLLECTION,
};
