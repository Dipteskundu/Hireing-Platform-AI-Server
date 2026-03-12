// controllers/skillTestController.js

const { getDB } = require("../config/db");
const { generateSkillQuestions } = require("../services/aiQuestionService");
const { evaluateSkillAnswers } = require("../services/skillEvaluationService");
const { ObjectId } = require("mongodb");

/**
 * Generate a new skill test
 * POST /api/skill-test/generate
 * Body: { candidateId: string, skill: string }
 */
const generateTest = async (req, res) => {
  try {
    const { candidateId, skill } = req.body;
    if (!candidateId || !skill) {
      return res.status(400).json({ success: false, message: "candidateId and skill are required" });
    }

    const questions = await generateSkillQuestions(skill);

    const db = getDB();
    const tests = db.collection("skill_tests");

    const newTest = {
      candidateId,
      skill,
      questions,
      answers: [],
      score: null,
      result: "pending", // pending, pass, fail
      createdAt: new Date(),
    };

    const result = await tests.insertOne(newTest);

    res.status(200).json({
      success: true,
      data: {
        testId: result.insertedId,
        skill,
        questions,
      },
    });
  } catch (error) {
    console.error("Error generating skill test:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate test" });
  }
};

/**
 * Submit answers for a skill test
 * POST /api/skill-test/submit
 * Body: { testId: string, candidateId: string, answers: Array<{questionId, answer}> }
 */
const submitTest = async (req, res) => {
  try {
    const { testId, candidateId, answers } = req.body;
    if (!testId || !candidateId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    const db = getDB();
    const tests = db.collection("skill_tests");
    const users = db.collection("users");

    // Fetch the test
    const test = await tests.findOne({ _id: new ObjectId(testId), candidateId });
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }
    
    if (test.result !== "pending") {
      return res.status(400).json({ success: false, message: "Test already submitted" });
    }

    // Evaluate answers
    const evaluation = await evaluateSkillAnswers(test.skill, test.questions, answers);

    const isPass = evaluation.passed;
    const finalResult = isPass ? "pass" : "fail";

    // Update test record
    await tests.updateOne(
      { _id: new ObjectId(testId) },
      {
        $set: {
          answers,
          score: evaluation.score,
          feedback: evaluation.feedback,
          result: finalResult,
          completedAt: new Date(),
        },
      }
    );

    // Update user record depending on result
    const user = await users.findOne({ firebaseUid: candidateId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let verifiedSkills = Array.isArray(user.verifiedSkills) ? [...user.verifiedSkills] : [];
    let isSkillVerified = user.isSkillVerified || false;
    let updateFields = {};

    if (isPass) {
      if (!verifiedSkills.includes(test.skill)) {
        verifiedSkills.push(test.skill);
      }
      
      const allSkills = Array.isArray(user.skills) ? user.skills : [];
      // Check if all declared skills are now verified
      const unverified = allSkills.filter(s => !verifiedSkills.includes(s));
      if (unverified.length === 0 && verifiedSkills.length > 0) {
        isSkillVerified = true;
      }

      updateFields = {
        verifiedSkills,
        isSkillVerified,
        lastTestAttempt: new Date(),
      };
    } else {
      // Cooldown for 2 hours if failed
      const nextAttemptTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
      updateFields = {
        lastTestAttempt: new Date(),
        nextAttemptTime,
      };
    }

    await users.updateOne(
      { firebaseUid: candidateId },
      { $set: updateFields }
    );

    res.status(200).json({
      success: true,
      data: {
        score: evaluation.score,
        result: finalResult,
        feedback: evaluation.feedback,
        verifiedSkills,
        isSkillVerified,
      },
    });
  } catch (error) {
    console.error("Error submitting skill test:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to submit test" });
  }
};

module.exports = {
  generateTest,
  submitTest,
};
