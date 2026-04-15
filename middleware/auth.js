import { getFirebaseService } from "../services/firebaseService.js";
import { getDB } from "../config/db.js";

let warnedOfflineJwt = false;

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing Token" });
    }

    const token = authHeader.split(" ")[1];
    
    const firebaseService = getFirebaseService();
    let decodedToken;
    if (!firebaseService || !firebaseService.admin) {
      const isProdRuntime =
        process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

      if (isProdRuntime) {
        return res.status(500).json({
          success: false,
          message:
            "Server configuration error: Firebase Admin credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_JSON in environment variables.",
        });
      }

      if (!warnedOfflineJwt) {
        warnedOfflineJwt = true;
        console.warn(
          "Using offline JWT decoder because Firebase Admin credentials are missing (dev only).",
        );
      }
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const parsed = JSON.parse(payloadString);
        decodedToken = { uid: parsed.user_id || parsed.uid, email: parsed.email };
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid Token",
        });
      }
    } else {
      decodedToken = await firebaseService.admin.auth().verifyIdToken(token);
    }
    
    // Fetch user from DB to attach role
    const db = getDB();
    const user = await db.collection("users").findOne({ firebaseUid: decodedToken.uid });
    
    req.user = {
      uid: decodedToken.uid,
      email: user?.email || decodedToken.email || "",
      role: user?.role || "candidate",
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
  }
};
