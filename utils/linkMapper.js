/**
 * Maps chatbot intents to frontend deep links.
 */
const INTENT_LINKS = {
  APPLY_JOB:          { label: "Go to Jobs Page", path: "/jobs" },
  SAVE_JOB:           { label: "Go to Saved Jobs", path: "/saved-jobs" },
  CREATE_JOB:         { label: "Go to Post a Job", path: "/post-job" },
  VIEW_APPLICATIONS:  { label: "Go to My Applications", path: "/applications" },
  VIEW_APPLICANTS:    { label: "Go to Applicants", path: "/applicants" },
  LEARNING_PLAN:      { label: "Go to Learning Plan", path: "/skill-gap-detection" },
  SKILL_GAP:          { label: "Go to Skill Gap Analysis", path: "/skill-gap-detection" },
  SKILL_TEST:         { label: "Go to Skill Tests", path: "/verification/skill-intro" },
  PROFILE:            { label: "Go to My Profile", path: "/profile" },
  DASHBOARD:          { label: "Go to Dashboard", path: "/dashboard" },
  UPLOAD_RESUME:      { label: "Go to Resume Upload", path: "/resume" },
  SCHEDULE_INTERVIEW: { label: "Go to Interviews", path: "/interviews" },
  MY_JOBS:            { label: "Go to My Jobs", path: "/my-jobs" },
};

/**
 * Returns the link object for a given intent, or null if none.
 * @param {string} intent
 * @returns {{ label: string, path: string } | null}
 */
export function getLinkForIntent(intent) {
  return INTENT_LINKS[intent] || null;
}

export default INTENT_LINKS;
