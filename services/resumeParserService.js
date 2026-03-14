// services/resumeParserService.js
// Service to extract text from various resume file formats (PDF, DOCX, TXT)

import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

function ensureBuffer(file) {
  if (file?.buffer && Buffer.isBuffer(file.buffer)) {
    return file.buffer;
  }
  if (file?.path) {
    return fs.readFileSync(file.path);
  }
  return null;
}

/**
 * Parses a resume file and extracts its text content.
 * Supports .pdf, .docx, and .txt files.
 *
 * @param {Object} file - The uploaded file object (from multer)
 * @returns {Promise<string>} The extracted text
 */
async function extractTextFromResume(file) {
  if (!file) {
    throw new Error("No file provided for parsing");
  }

  const mimeType = file.mimetype;
  const buffer = ensureBuffer(file);

  if (!buffer) {
    throw new Error("Resume file buffer could not be read");
  }

  try {
    let extractedText = "";

    if (mimeType === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (mimeType === "text/plain") {
      extractedText = buffer.toString("utf8");
    } else {
      throw new Error(`Unsupported file type: ${mimeType}. Please upload PDF, DOCX, or TXT.`);
    }

    extractedText = extractedText.replace(/\n\s*\n/g, "\n\n").trim();

    return extractedText;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error("Failed to parse resume file");
  }
}

export { extractTextFromResume };
