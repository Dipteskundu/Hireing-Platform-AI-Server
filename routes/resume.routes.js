// routes/resume.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadResume } = require("../controllers/resumeController");

// Configure multer for temp storage (could be customized to save to a specific folder or S3)
const upload = multer({ dest: 'uploads/' });

// POST /api/resume/upload
// Expects multipart/form-data with a file field named 'resume' and a text field 'candidateId'
router.post("/api/resume/upload", upload.single("resume"), uploadResume);

module.exports = router;
