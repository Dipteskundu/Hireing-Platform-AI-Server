// services/aiQuestionService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY?.trim();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
];

function getModel(modelName) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });
}

function parseRetryDelay(err) {
  const msg = String(err?.message || err);
  const match = msg.match(/retry\s+in\s+(\d+(?:\.\d+)?)\s*s/i);
  if (match) return Math.min(parseFloat(match[1]) || 60, 120);
  return 60;
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function generateWithFallback(prompt, retryCount = 0) {
  if (!genAI) {
    throw new Error("Gemini API not configured. Set GEMINI_API_KEY in .env");
  }

  let lastError = null;
  let lastWas429 = false;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = getModel(modelName);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      if (text && text.trim()) {
        console.log(`✓ Successfully used model: ${modelName} for questions`);
        return { text: text.trim(), modelUsed: modelName };
      }
    } catch (err) {
      lastError = err;
      const msg = String(err?.message || err).toLowerCase();
      const is404 = msg.includes("404") || msg.includes("not found");
      const is503 = msg.includes("503") || msg.includes("unavailable");
      const is429 = msg.includes("429") || msg.includes("too many requests") || msg.includes("quota exceeded");

      if (is404 || is503) {
        continue;
      }
      if (is429) {
        lastWas429 = true;
        continue;
      }
      throw err;
    }
  }

  if (lastWas429 && retryCount < 1) {
    const delay = Math.min(parseRetryDelay(lastError), 90);
    await sleep(delay);
    return generateWithFallback(prompt, retryCount + 1);
  }

  throw lastError || new Error("All Gemini models failed. Try updating GEMINI_API_KEY or check your internet connection.");
}

/**
 * Generate 3 technical interview questions for a given skill
 */
async function generateSkillQuestions(skill) {
  const prompt = `Generate 3 technical interview questions about ${skill}.

Requirements:
- Use very simple English
- Test deep understanding
- Include:
  1 simple
  1 medium
  1 hard question
- Keep questions short
- Return ONLY a valid JSON array. Each object must have: "id" (string), "text" (string), "difficulty" (string - "Simple", "Medium", "Hard").

Example JSON format:
[
  {"id": "q1", "text": "What is the purpose of a React component?", "difficulty": "Simple"},
  {"id": "q2", "text": "Why do we use useEffect in React applications?", "difficulty": "Medium"},
  {"id": "q3", "text": "Explain how React decides which parts of the UI need to re-render.", "difficulty": "Hard"}
]

Return ONLY the JSON array, no markdown, no extra text.`;

  const { text } = await generateWithFallback(prompt);

  // Parse JSON
  let jsonStr = text;
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) jsonStr = match[1].trim();

  try {
    const questions = JSON.parse(jsonStr);
    if (!Array.isArray(questions) || questions.length !== 3) {
      throw new Error("Invalid question format from AI");
    }
    return questions.map((q, i) => ({
      id: q.id || `q${i + 1}`,
      text: q.text || "",
      difficulty: q.difficulty || ["Simple", "Medium", "Hard"][i] || "Medium",
    }));
  } catch (error) {
    console.error("Failed to parse Skill Questions JSON", error);
    throw new Error("Failed to parse questions from AI");
  }
}

module.exports = {
  generateSkillQuestions
};
