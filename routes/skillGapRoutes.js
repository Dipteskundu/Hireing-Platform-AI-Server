// routes/skillGapRoutes.js

const express = require("express");
const router = express.Router();
const { getSkillGapAnalysis } = require("../controllers/skillGapController");

// route: /api/skill-gap/:jobId/:candidateId
router.get("/api/skill-gap/:jobId/:candidateId", getSkillGapAnalysis);

module.exports = router;
