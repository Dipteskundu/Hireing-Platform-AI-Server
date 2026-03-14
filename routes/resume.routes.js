// routes/resume.routes.js

import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// POST /api/resume/upload
// Expects multipart/form-data with a file field named 'resume' and a text field 'candidateId'
router.post("/api/resume/upload", upload.single("resume"), uploadResume);

export default router;
