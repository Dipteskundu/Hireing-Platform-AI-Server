// routes/skillGapRoutes.js

import express from "express";
import { getSkillGapAnalysis } from "../controllers/skillGapController.js";

const router = express.Router();

// route: /api/skill-gap/:jobId/:candidateId
router.get("/api/skill-gap/:jobId/:candidateId", getSkillGapAnalysis);

export default router;
