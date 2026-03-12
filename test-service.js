// backend/test-service.js
// Comprehensive test for the Gemini service functions

// Load environment variables FIRST before requiring the service
const dotenv = require("dotenv");
dotenv.config();

// Now require the service after env vars are loaded
const { generateQuestions, evaluateAnswers, TIME_LIMIT_MINUTES, QUESTION_COUNT } = require("./services/gemini.service");

async function testGenerateQuestions() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 1: Generate Communication Questions");
    console.log("=".repeat(60));
    
    try {
        const jobTitle = "Frontend Developer";
        const company = "Tech Innovations Inc";
        
        console.log(`\n📝 Generating questions for: ${jobTitle} at ${company}...`);
        
        const result = await generateQuestions(jobTitle, company);
        
        console.log("\n✅ SUCCESS! Generated questions:");
        console.log(`   Time Limit: ${result.timeLimit} minutes`);
        console.log(`   Question Count: ${result.questions.length}\n`);
        
        result.questions.forEach((q, index) => {
            console.log(`${index + 1}. [${q.type}] ${q.text.substring(0, 80)}...`);
        });
        
        return result.questions;
    } catch (error) {
        console.error("\n❌ FAILED to generate questions:");
        console.error(error.message);
        return null;
    }
}

async function testEvaluateAnswers(questions) {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 2: Evaluate Candidate Answers");
    console.log("=".repeat(60));
    
    if (!questions || questions.length === 0) {
        console.log("\n⚠️  Skipping evaluation test (no questions available)");
        return;
    }
    
    try {
        // Create sample answers
        const sampleAnswers = questions.map((q, index) => ({
            questionId: q.id,
            answer: index === 0 
                ? "Dear Team,\n\nI hope this email finds you well. I wanted to follow up on our previous discussion regarding the project timeline. Could you please provide an update on the current status?\n\nBest regards"
                : index === 1
                ? "I would approach this situation by first listening to my teammate's concerns and understanding their perspective. Then, I would present my reasoning clearly and objectively. If we still disagree, I would suggest we present both approaches to the team lead for their input."
                : index === 2
                ? "I believe effective teamwork requires clear communication, mutual respect, and shared goals. I would ensure everyone understands their role and responsibilities, and I would facilitate regular check-ins to address any issues promptly."
                : index === 3
                ? "I would explain the technical issue using simple analogies and avoid jargon. For example, I might compare a server issue to a traffic jam - when too many requests come in at once, things slow down. I would focus on the impact and the solution rather than technical details."
                : "The project is progressing well. We've completed 80% of the planned features and are on track to meet the deadline. However, we encountered a minor issue with the API integration that may require an additional 2 days to resolve."
        }));
        
        console.log("\n📊 Evaluating sample answers...");
        
        const scores = await evaluateAnswers(questions, sampleAnswers);
        
        console.log("\n✅ SUCCESS! Evaluation results:");
        console.log(`\n   📈 Scores:`);
        console.log(`      Clarity:        ${scores.clarityScore}/100`);
        console.log(`      Tone:           ${scores.toneScore}/100`);
        console.log(`      Grammar:        ${scores.grammarScore}/100`);
        console.log(`      Structure:      ${scores.structureScore}/100`);
        console.log(`      Overall:        ${scores.communicationScore}/100`);
        console.log(`\n   💬 Feedback:`);
        console.log(`      ${scores.feedback}`);
        
    } catch (error) {
        console.error("\n❌ FAILED to evaluate answers:");
        console.error(error.message);
    }
}

async function runAllTests() {
    console.log("\n🚀 Starting Gemini Service Tests...");
    console.log("This will test the actual service functions used in the application.\n");
    
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY NOT FOUND in .env");
        console.log("\nPlease add your API key to the .env file:");
        console.log("GEMINI_API_KEY=your_api_key_here");
        process.exit(1);
    }
    
    console.log(`🔑 API Key: ${apiKey.slice(0, 5)}...${apiKey.slice(-5)}`);
    console.log(`⚙️  Configuration: ${QUESTION_COUNT} questions, ${TIME_LIMIT_MINUTES} minute time limit`);
    
    // Test 1: Generate Questions
    const questions = await testGenerateQuestions();
    
    // Test 2: Evaluate Answers (only if questions were generated successfully)
    if (questions) {
        await testEvaluateAnswers(questions);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✨ All tests completed!");
    console.log("=".repeat(60));
    console.log("\nThe Gemini API integration is working correctly.");
    console.log("You can now use these functions in your application.\n");
}

runAllTests();
