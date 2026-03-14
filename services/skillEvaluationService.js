import { GoogleGenerativeAI } from "@google/generative-ai";

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
      temperature: 0.5,
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
    throw new Error("Gemini API not configured.");
  }

  let lastError = null;
  let lastWas429 = false;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = getModel(modelName);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (text && text.trim()) {
        console.log(`✓ Successfully used model: ${modelName} for evaluation`);
        return { text: text.trim(), modelUsed: modelName };
      }
    } catch (err) {
      lastError = err;
      const msg = String(err?.message || err).toLowerCase();
      if (msg.includes("404") || msg.includes("503")) continue;
      if (msg.includes("429") || msg.includes("quota")) {
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

  throw lastError || new Error("All Gemini models failed.");
}

/**
 * Evaluate candidate answers across multiple skills (up to 9 questions total)
 */
async function evaluateSkillAnswers(skillsArray, questions, answers) {
  const skillsList = Array.isArray(skillsArray) ? skillsArray.join(", ") : skillsArray;

  const qaPairs = questions.map((q) => {
    const ans = answers.find((a) => a.questionId === q.id);
    return {
      skill: q.skill || "Unknown",
      difficulty: q.difficulty,
      question: q.text,
      answer: ans?.answer || "(No answer provided)"
    };
  });

  const questionCount = questions.length;
  const marksPerQuestion = (100 / questionCount).toFixed(2);

  const prompt = `You are a Senior Software Engineer assessing a candidate's skill verification test.
The test covers these skills: ${skillsList}.
There are ${questionCount} questions.
Evaluate the candidate's answers based on correctness, deep understanding, and clear explanations.

Assign a score out of 100 for the ENTIRE test.
Each question is worth approximately ${marksPerQuestion} marks.

If an answer is completely correct and shows good understanding, give full marks for that question.
If partially correct, give partial marks.
If completely wrong or empty, give 0 marks.
Calculate the total score out of 100.

Return ONLY a valid JSON object in this exact format:
{
  "score": 75,
  "feedback": "Good understanding of React basics, but struggled with the advanced Node.js concept in question 5."
}

Questions and candidate answers:
${JSON.stringify(qaPairs, null, 2)}

Return ONLY the single JSON object, no markdown, no extra text.`;

  const { text } = await generateWithFallback(prompt);

  let jsonStr = text;
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) jsonStr = match[1].trim();

  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const score = Math.min(100, Math.max(0, Number(parsed.score) || 0));
    
    return {
      score,
      feedback: String(parsed.feedback || ""),
      passed: score >= 60
    };
  } catch (parseError) {
    console.error("Failed to parse Skill Evaluation JSON", text);
    throw new Error("Failed to evaluate questions using AI");
  }
}

export { evaluateSkillAnswers };
export default { evaluateSkillAnswers };
