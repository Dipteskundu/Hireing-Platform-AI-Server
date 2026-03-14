// routes/skillTest.routes.js

import express from "express";
import { generateTest, submitTest } from "../controllers/skillTestController.js";

const router = express.Router();

router.post("/api/skill-test/generate", generateTest);
router.post("/api/skill-test/submit", submitTest);

export default router;
