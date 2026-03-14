// routes/communication.routes.js

import express from "express";
import {
  startTest,
  submitTest,
  getResult,
  getSession,
} from "../controllers/communication.controller.js";

const router = express.Router();

// POST /api/communication/start
router.post("/api/communication/start", startTest);

// GET /api/communication/session/:sessionId
router.get("/api/communication/session/:sessionId", getSession);

// POST /api/communication/submit
router.post("/api/communication/submit", submitTest);

// GET /api/communication/result/:sessionId
router.get("/api/communication/result/:sessionId", getResult);

export default router;
