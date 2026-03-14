// routes/commVerification.routes.js
// Global communication verification (not per-job)

import express from "express";
import {
  startCommVerification,
  submitCommVerification,
  getCommVerificationStatus,
} from "../controllers/commVerification.controller.js";

const router = express.Router();

// POST /api/verification/communication/start
router.post("/api/verification/communication/start", startCommVerification);

// POST /api/verification/communication/submit
router.post("/api/verification/communication/submit", submitCommVerification);

// GET /api/verification/communication/status/:uid
router.get("/api/verification/communication/status/:uid", getCommVerificationStatus);

export default router;
