// services/resumeParserService.js
// Service to extract text from various resume file formats (PDF, DOCX)

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Parses a resume file and extracts its text content.
 * Supports .pdf, .docx, and .txt files.
 *
 * @param {Object} file - The uploaded file object (from multer)
 * @returns {Promise<string>} The extracted text
 */
async function extractTextFromResume(file) {
  if (!file || !file.path) {
    throw new Error('No file provided for parsing');
  }

  const mimeType = file.mimetype;
  const filePath = file.path;

  try {
    let extractedText = '';

    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // docx
      mimeType === 'application/msword' // doc (mammoth support is limited, but we try)
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else if (mimeType === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error(`Unsupported file type: ${mimeType}. Please upload PDF, DOCX, or TXT.`);
    }

    // Clean up the text a bit (remove excessive empty lines)
    extractedText = extractedText.replace(/\n\s*\n/g, '\n\n').trim();

    return extractedText;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume file');
  }
}

module.exports = {
  extractTextFromResume,
};
