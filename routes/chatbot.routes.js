import express from "express";
import { handleAskChatbot, getChatHistory, deleteChatHistory } from "../controllers/chatbotController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/api/chatbot/ask",     verifyToken, handleAskChatbot);
router.get("/api/chatbot/history",  verifyToken, getChatHistory);
router.delete("/api/chatbot/history", verifyToken, deleteChatHistory);

export default router;
