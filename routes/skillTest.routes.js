// routes/skillTest.routes.js

const express = require("express");
const router = express.Router();
const { generateTest, submitTest } = require("../controllers/skillTestController");

router.post("/api/skill-test/generate", generateTest);
router.post("/api/skill-test/submit", submitTest);

module.exports = router;
