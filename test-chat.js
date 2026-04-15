import { askChatbot } from "./services/chatbotService.js";
import { connectDB } from "./config/db.js";
import "dotenv/config";
import { loadEnv } from "./config/env.js";

loadEnv();

(async () => {
    try {
        await connectDB();
        // Fake UID to test how it builds context and calls Gemini
        const ans = await askChatbot("test-uid", "candidate", "how many jobs?");
        console.log("SUCCESS:", ans);
    } catch(err) {
        console.error("FAILED:", err.message);
        console.error(err.stack);
    } finally {
        process.exit(0);
    }
})();
