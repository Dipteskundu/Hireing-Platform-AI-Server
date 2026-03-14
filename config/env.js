// config/env.js
// Centralized environment validation and normalization

import "dotenv/config";

function buildMongoUriFromPieces() {
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;
  const host = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;
  const options = process.env.DB_OPTIONS;

  if (!user || !pass || !host) return null;

  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(pass);
  const dbSegment = dbName ? `/${dbName}` : "";
  const optionsSegment = options ? `?${options}` : "";

  return `mongodb+srv://${encodedUser}:${encodedPass}@${host}${dbSegment}${optionsSegment}`;
}

function parseFirebaseServiceAccount(raw, warnings, firebaseErrors) {
  if (!raw) {
    warnings.push(
      "FIREBASE_SERVICE_ACCOUNT is not set. Firebase Admin features will be disabled."
    );
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.private_key && parsed.private_key.includes("\\n")) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }

    if (!parsed?.project_id || !parsed?.client_email || !parsed?.private_key) {
      warnings.push(
        "FIREBASE_SERVICE_ACCOUNT is missing expected fields (project_id, client_email, private_key)."
      );
    }

    return parsed;
  } catch (error) {
    firebaseErrors.push(
      "FIREBASE_SERVICE_ACCOUNT must be valid JSON. Paste the full service account JSON string."
    );
    return null;
  }
}

export function loadEnv() {
  const errors = [];
  const warnings = [];
  const firebaseErrors = [];

  const MONGODB_URI =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    buildMongoUriFromPieces();

  if (!MONGODB_URI) {
    errors.push(
      "Missing MongoDB connection string. Set MONGODB_URI (preferred) or MONGO_URI, or DB_USER/DB_PASS/DB_HOST."
    );
  }

  if (process.env.DB_USER && !process.env.DB_PASS) {
    warnings.push("DB_USER is set but DB_PASS is missing.");
  }
  if (process.env.DB_PASS && !process.env.DB_USER) {
    warnings.push("DB_PASS is set but DB_USER is missing.");
  }
  if ((process.env.DB_USER || process.env.DB_PASS) && !process.env.DB_HOST) {
    warnings.push("DB_USER/DB_PASS set but DB_HOST is missing.");
  }

  const FIREBASE_SERVICE_ACCOUNT_RAW = process.env.FIREBASE_SERVICE_ACCOUNT;
  const FIREBASE_SERVICE_ACCOUNT = parseFirebaseServiceAccount(
    FIREBASE_SERVICE_ACCOUNT_RAW,
    warnings,
    firebaseErrors
  );

  return {
    env: {
      MONGODB_URI,
      MONGO_DB_NAME: process.env.MONGO_DB_NAME || process.env.DB_NAME || "skillmatchai",
      FIREBASE_SERVICE_ACCOUNT,
      FIREBASE_SERVICE_ACCOUNT_RAW,
      NODE_ENV: process.env.NODE_ENV || "development",
      CORS_ORIGIN: process.env.CORS_ORIGIN || "",
      PORT: process.env.PORT || "5000",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    },
    errors,
    warnings,
    firebaseErrors,
    isProd: process.env.NODE_ENV === "production",
  };
}
