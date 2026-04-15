import { getFirebaseService } from "../services/firebaseService.js";
import { getDB } from "../config/db.js";

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
      console.warn("Using offline JWT decoder because Firebase Admin credentials are missing.");
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const parsed = JSON.parse(payloadString);
        decodedToken = { uid: parsed.user_id || parsed.uid, email: parsed.email };
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Server configuration error: Firebase Admin is not configured and token fallback parsing failed."
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
