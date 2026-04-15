Implement a secure AI chatbot feature in my existing application that fulfills the following requirements.

PROJECT STACK

- Next.js frontend (JavaScript only)
- Node.js + Express backend (JavaScript only)
- MongoDB database
- Gemini API already integrated in the backend
- JWT authentication already exists

IMPORTANT RULES

- Use JavaScript only (NO TypeScript).
- Do NOT change any existing design, UI structure, routing, or business logic.
- Do NOT refactor unrelated code.
- Only add the chatbot feature and integrate it safely with the current architecture.
- Reuse the existing backend structure, authentication system, and Gemini API integration.

---

MAIN GOAL

Create a smart chatbot that behaves like a modern support assistant for the platform but only answers questions related to the application domain.

The chatbot must help users with:

• platform feature explanations
• candidate workflow guidance
• recruiter workflow guidance
• the logged-in user's own database data (read-only only)
• learning plans and skill gap recommendations
• job matching explanations
• dashboard navigation help
• safe next-step suggestions

The chatbot must NEVER perform actions such as modifying data.

---

QUESTION UNDERSTANDING REQUIREMENTS

The chatbot must understand questions flexibly.

Requirements:

• Question matching must be CASE-INSENSITIVE
• The chatbot must understand similar or related questions
• The chatbot must support rephrased questions
• The chatbot must support short or incomplete questions
• Do NOT rely only on exact text matching

Examples that must all map to the same intent:

"how do i apply for a job"
"how to apply job"
"apply job process"
"apply for job steps"
"how can i apply"

Implementation suggestion:

1. Normalize input
   
   - trim spaces
   - convert to lowercase
   - remove extra punctuation

2. Use intent classification with keyword groups and synonyms.

3. Use intent categories such as:

platform_help
candidate_workflow_help
recruiter_workflow_help
user_data_summary
learning_guidance
job_matching_explanation
dashboard_navigation_help
safe_next_step_guidance
out_of_scope

---

ALLOWED QUESTION CATEGORIES

The chatbot should answer only these types of questions.

1. Platform Feature Help

Examples:

- How do I create my profile?
- How do I upload my resume?
- How do I apply for a job?
- How do I save a job?
- How do I view saved jobs?
- How do I update my skills?
- How do I use the dashboard?
- How do I use recruiter features?
- How do I post a job?
- How do I view applicants?

---

2. Candidate Workflow Help

Examples:

- What should I do after signup?
- What should I complete first in my profile?
- What should I do before applying?
- How can I improve my chances of getting shortlisted?
- What should I do after applying?

---

3. Recruiter Workflow Help

Examples:

- How do I post a job?
- How do I review applicants?
- How do I shortlist candidates?
- How do I compare candidates?
- What is the recruiter workflow?

The chatbot must only explain steps and never perform actions.

---

4. User’s Own Data Questions (READ-ONLY)

Examples for candidate:

- Show my recent applications
- How many jobs have I applied for?
- Show my matched jobs
- Show my saved jobs
- Is my profile complete?
- What skills are missing from my profile?

Examples for recruiter:

- Show my active job posts
- How many jobs have I posted?
- How many applicants do I have?
- Which job has the most applicants?

Important:
The chatbot must only access the logged-in user's own data.

---

5. Learning Plan and Skill Gap Questions

Examples:

- What is my learning plan?
- Why was this learning plan recommended?
- Which skills should I improve first?
- What are my skill gaps?
- Which courses are recommended for me?

---

6. Job Matching Explanation

Examples:

- Why is this job recommended to me?
- How does my match score work?
- Which skills helped this match?
- Which skills are missing?

---

7. Dashboard Navigation Help

Examples:

- Where can I find my profile?
- Where can I see my applications?
- Where can I find my learning plan?
- Where can I manage job posts?
- Where can I view applicants?

---

8. Safe Next-Step Guidance

Examples:

- What should I do next?
- What should I improve first?
- How can I improve my profile?
- How can I improve my job match score?

---

UNKNOWN QUESTION BEHAVIOR

If the chatbot does NOT know the answer or the information is not available in the database or internal knowledge base, it must respond with this exact fallback message:

"Sorry, I do not have relevant information about that right now. I can help you with platform features, your data in this system, learning plans, and job matching guidance."

Rules:
• Never hallucinate information
• Never guess missing data
• Never invent answers

---

SECURITY REQUIREMENTS

The chatbot must follow strict security rules.

1. Frontend must NEVER call Gemini directly.
2. Frontend must NEVER access database directly.
3. All chatbot requests must go through a backend API route.

The chatbot must NEVER:

• create data
• update data
• delete data
• modify data
• approve or reject candidates
• apply for jobs
• post jobs

If the user asks the chatbot to perform an action, the chatbot must respond like:

"I cannot perform actions directly, but I can guide you on how to do it in the platform."

Other security rules:

• Chatbot must be READ-ONLY
• No raw MongoDB queries from user input
• No exposure of other users' private data
• Strict role-based access control
• Candidate → only their data
• Recruiter → only their jobs and applicants

---

BACKEND IMPLEMENTATION REQUIREMENTS

Create a backend chatbot API:

POST /api/chatbot/ask

Steps:

1. Verify JWT authentication.
2. Identify user role (candidate or recruiter).
3. Normalize the user question.
4. Run intent classification.
5. If intent is allowed → build context.
6. Fetch minimal read-only database data using .select() and limit().
7. Summarize the data.
8. Send context + question to Gemini.
9. Generate a natural conversational answer.
10. Sanitize the response.

Add response guardrails to block phrases like:

"I updated your data"
"I deleted your application"
"I posted the job"

If detected → replace with safe message.

---

CONTEXT BUILDER REQUIREMENTS

Create context builders such as:

getCandidateContext(userId)
getRecruiterContext(userId)
getLearningPlanContext(userId)
getFeatureDocs()

These functions must fetch only minimal safe fields from MongoDB.

---

FRONTEND IMPLEMENTATION REQUIREMENTS

Create a reusable Next.js chatbot component.

Requirements:

• Chat interface with message list
• Input box
• Send button
• Loading state
• Error handling

Frontend must call:

POST /api/chatbot/ask

Include JWT token in the Authorization header.

The chatbot UI must not break the existing design.

---

KNOWLEDGE SOURCE

Create a knowledge source for system help:

Example:

systemKnowledge collection or JSON file containing:

• platform feature explanations
• candidate workflow documentation
• recruiter workflow documentation
• learning plan explanation
• job matching explanation
• dashboard navigation help

---

OUTPUT REQUIRED

Generate complete JavaScript code for:

• chatbot API route
• chatbot controller
• chatbot service
• intent classifier
• context builder
• response sanitizer
• knowledge source (JSON or DB model)
• Next.js chatbot component
• API integration
• step-by-step integration instructions

---

FINAL BEHAVIOR SUMMARY

The chatbot must:

• answer platform related questions
• support case-insensitive questions
• understand similar questions
• answer using internal platform data and knowledge
• stay read-only
• refuse unknown questions with fallback message
• maintain strong security controls