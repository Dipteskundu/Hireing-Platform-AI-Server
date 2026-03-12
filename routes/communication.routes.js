// routes/communication.routes.js

const express = require("express");
const router = express.Router();
const {
  startTest,
  submitTest,
  getResult,
  getSession,
} = require("../controllers/communication.controller");

// POST /api/communication/start
router.post("/api/communication/start", startTest);

// GET /api/communication/session/:sessionId
router.get("/api/communication/session/:sessionId", getSession);

// POST /api/communication/submit
router.post("/api/communication/submit", submitTest);

// GET /api/communication/result/:sessionId
router.get("/api/communication/result/:sessionId", getResult);

module.exports = router;
