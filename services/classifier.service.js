import { normalizeInput } from "../utils/normalizeInput.js";

/**
 * Intent key constants
 */
export const INTENTS = {
  APPLY_JOB: "APPLY_JOB",
  SAVE_JOB: "SAVE_JOB",
  CREATE_JOB: "CREATE_JOB",
  VIEW_APPLICATIONS: "VIEW_APPLICATIONS",
  VIEW_APPLICANTS: "VIEW_APPLICANTS",
  LEARNING_PLAN: "LEARNING_PLAN",
  SKILL_GAP: "SKILL_GAP",
  SKILL_TEST: "SKILL_TEST",
  PROFILE: "PROFILE",
  DASHBOARD: "DASHBOARD",
  UPLOAD_RESUME: "UPLOAD_RESUME",
  SCHEDULE_INTERVIEW: "SCHEDULE_INTERVIEW",
  USER_DATA_SUMMARY: "USER_DATA_SUMMARY",
  JOB_MATCHING: "JOB_MATCHING",
  CANDIDATE_WORKFLOW: "CANDIDATE_WORKFLOW",
  RECRUITER_WORKFLOW: "RECRUITER_WORKFLOW",
  NEXT_STEPS: "NEXT_STEPS",
  PLATFORM_HELP: "PLATFORM_HELP",
  WHO_AM_I: "WHO_AM_I",
  DELETE_JOB_EXPLAIN: "DELETE_JOB_EXPLAIN",
  EDIT_JOB_EXPLAIN: "EDIT_JOB_EXPLAIN",
  SHORTLIST_EXPLAIN: "SHORTLIST_EXPLAIN",
  OUT_OF_SCOPE: "OUT_OF_SCOPE",
};

/**
 * Keyword groups for each intent. Synonyms and rephrases are grouped together.
 * All strings are already lowercased — inputs will be normalized before matching.
 */
const INTENT_KEYWORDS = [
  {
    intent: INTENTS.UPLOAD_RESUME,
    keywords: [
      "upload resume", "upload my resume", "add resume", "submit resume", 
      "resume upload", "attach resume", "where can i upload", "how to upload resume"
    ],
  },
  {
    intent: INTENTS.APPLY_JOB,
    keywords: [
      "apply job", "apply for a job", "how do i apply", "how can i apply", "job apply",
      "apply to a job", "apply to job", "apply process", "application process",
      "submit application", "how to apply", "where to apply", "can i edit my application"
    ],
  },
  {
    intent: INTENTS.SAVE_JOB,
    keywords: [
      "save job", "saved jobs", "save a job", "bookmark job", "saved job list",
      "see my saved jobs", "show my saved jobs", "how to save a job"
    ],
  },
  {
    intent: INTENTS.CREATE_JOB,
    keywords: [
      "post a job", "create a job", "add a job", "post job", "create job post",
      "how to post", "job posting", "new job listing", "how do i post",
      "where to post job", "create a job post"
    ],
  },
  {
    intent: INTENTS.VIEW_APPLICATIONS,
    keywords: [
      "my applications", "view applications", "see my applications", "application history",
      "where are my applications", "track application", "application status",
      "check my application status", "show my recent applications"
    ],
  },
  {
    intent: INTENTS.VIEW_APPLICANTS,
    keywords: [
      "view applicants", "see applicants", "review applicants", "applicant list",
      "who applied", "candidates who applied", "review candidates", "show applicants",
      "where can i see applicants"
    ],
  },
  {
    intent: INTENTS.SCHEDULE_INTERVIEW,
    keywords: [
      "schedule interview", "schedule a meeting", "book interview", "interview candidate",
      "set up interview", "arrange interview", "how to interview", "manage interview schedules",
      "interview setup", "set time for interview"
    ],
  },
  {
    intent: INTENTS.LEARNING_PLAN,
    keywords: [
      "learning plan", "my learning plan", "study plan", "what should i learn",
      "learning path", "what courses", "recommend courses", "course recommendation",
      "why was this learning plan recommended", "where is my learning plan"
    ],
  },
  {
    intent: INTENTS.SKILL_GAP,
    keywords: [
      "skill gap", "missing skills", "skills i lack", "what skills do i need",
      "gap analysis", "skill analysis", "which skills to improve", "skill gap meaning",
      "what should i focus on next", "improve job chances"
    ],
  },
  {
    intent: INTENTS.SKILL_TEST,
    keywords: [
      "skill test", "take a test", "skill assessment", "verify my skills",
      "skills quiz", "evaluate my skills", "take a skill test", "assessment process"
    ],
  },
  {
    intent: INTENTS.PROFILE,
    keywords: [
      "my profile", "update profile", "edit profile", "complete profile",
      "profile page", "how to update my profile", "missing from my profile",
      "profile information", "what is my profile", "is my profile complete",
      "how to create my profile", "add experience", "add education",
      "update my skills", "improve my profile"
    ],
  },
  {
    intent: INTENTS.DASHBOARD,
    keywords: [
      "where can i find", "navigate to", "go to dashboard", "dashboard navigation",
      "how to navigate", "find the page", "where is the", "where is my dashboard",
      "dashboard location", "navigate to profile", "navigate to jobs"
    ],
  },
  {
    intent: INTENTS.USER_DATA_SUMMARY,
    keywords: [
      "how many jobs", "how many applications", "my applications count",
      "recent applications", "matched jobs", "active job posts", "how many applicants",
      "my data", "summarize my", "summary of my", "which job has the most applicants",
      "job performance", "how is my job post performing"
    ],
  },
  {
    intent: INTENTS.JOB_MATCHING,
    keywords: [
      "match score", "why is this job matched", "how does matching work",
      "job matching", "how am i matched", "matching algorithm",
      "why did i match", "what helped this match", "candidate matching",
      "best candidates for my job", "top matched candidates", "ranking reason",
      "why am i not getting matches", "why not good matches"
    ],
  },
  {
    intent: INTENTS.CANDIDATE_WORKFLOW,
    keywords: [
      "after signup", "first steps", "how do i get started", "candidate workflow",
      "before applying", "improve my chances", "after applying",
      "complete my profile first", "new candidate", "signup process",
      "what should i do after signing up"
    ],
  },
  {
    intent: INTENTS.RECRUITER_WORKFLOW,
    keywords: [
      "recruiter workflow", "how do i hire", "shortlist candidates", "compare candidates",
      "recruiter features", "how to review", "how to shortlist",
      "hiring process", "select candidates", "hiring workflow",
      "after posting a job", "review candidate profiles"
    ],
  },
  {
    intent: INTENTS.NEXT_STEPS,
    keywords: [
      "what should i do next", "what do i do next", "next steps", "next step",
      "do next", "improve my profile", "improve my job match",
      "what should i improve", "how to improve", "what to do now"
    ],
  },
  {
    intent: INTENTS.PLATFORM_HELP,
    keywords: [
      "how does this platform work", "what can i do here", "platform features",
      "what features", "what is jobmatch", "help me", "guide me",
      "recruiter features", "candidate features", "platform help",
      "how to use this platform"
    ],
  },
  {
    intent: INTENTS.WHO_AM_I,
    keywords: ["what is my name", "who am i", "my name", "what am i called", "tell me my name"],
  },
  {
    intent: INTENTS.DELETE_JOB_EXPLAIN,
    keywords: ["how to delete job", "delete job post", "remove job listing", "how to delete a job"],
  },
  {
    intent: INTENTS.EDIT_JOB_EXPLAIN,
    keywords: ["how to edit job", "edit job post", "modify job listing", "how to edit a job"],
  },
  {
    intent: INTENTS.SHORTLIST_EXPLAIN,
    keywords: ["how to shortlist", "shortlisting process", "how do i shortlist candidates"],
  },
];

/**
 * Action request detection — if user asks bot to DO something,
 * we must reply with a guidance refusal message.
 */
const ACTION_KEYWORDS = [
  "please apply", "apply me", "apply for me", "post the job for me",
  "submit my application", "schedule for me", "do it for me",
  "can you apply", "can you post", "can you schedule", "delete the job for me"
];

/**
 * Classify the normalized input into an intent key.
 * Returns { intent, isActionRequest }
 * @param {string} rawInput
 * @returns {{ intent: string, isActionRequest: boolean }}
 */
export function classifyIntent(rawInput) {
  const normalized = normalizeInput(rawInput);

  // Check for action requests first
  const isActionRequest = ACTION_KEYWORDS.some((kw) => normalized.includes(kw));

  // Find the first matching intent
  for (const { intent, keywords } of INTENT_KEYWORDS) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return { intent, isActionRequest };
    }
  }

  return { intent: INTENTS.OUT_OF_SCOPE, isActionRequest };
}
