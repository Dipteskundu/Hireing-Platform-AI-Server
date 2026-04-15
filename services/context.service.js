import { getDB } from "../config/db.js";

/**
 * Fetch just the user's display name for personalization.
 * Returns first name (first word of displayName) or "there" as fallback.
 * @param {string} uid - firebaseUid
 * @returns {Promise<string>}
 */
export async function getUserName(uid) {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne(
      { firebaseUid: uid },
      { projection: { displayName: 1, _id: 0 } }
    );
    const full = user?.displayName || "";
    const firstName = full.trim().split(" ")[0];
    return firstName || "there";
  } catch (_) {
    return "there";
  }
}

/**
 * Build a safe read-only context for a candidate user.
 * @param {string} uid - firebaseUid
 * @returns {Promise<object>}
 */
export async function getCandidateContext(uid) {
  const db = getDB();

  const user = await db.collection("users").findOne(
    { firebaseUid: uid },
    {
      projection: {
        displayName: 1,
        email: 1,
        skills: 1,
        title: 1,
        isSkillVerified: 1,
        isCommunicationVerified: 1,
        _id: 0,
      },
    }
  );

  const applications = await db
    .collection("applications")
    .find({ firebaseUid: uid })
    .project({ jobTitle: 1, companyName: 1, status: 1, createdAt: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  const applicationsCount = await db
    .collection("applications")
    .countDocuments({ firebaseUid: uid });

  const savedJobsCount = await db
    .collection("saved_jobs")
    .countDocuments({ firebaseUid: uid });

  const matchedJobs = await db
    .collection("find_jobs")
    .find({ matchedCandidates: uid })
    .project({ title: 1, company: 1, _id: 0 })
    .limit(5)
    .toArray();

  return {
    role: "candidate",
    profile: user || {},
    recentApplications: applications,
    applicationsCount,
    savedJobsCount,
    matchedJobsCount: matchedJobs.length,
    matchedJobs,
  };
}

/**
 * Build a safe read-only context for a recruiter user.
 * @param {string} uid - firebaseUid
 * @returns {Promise<object>}
 */
export async function getRecruiterContext(uid) {
  const db = getDB();

  const user = await db.collection("users").findOne(
    { firebaseUid: uid },
    { projection: { displayName: 1, email: 1, companyName: 1, _id: 0 } }
  );

  const companyJobs = await db
    .collection("find_jobs")
    .find({ $or: [{ postedBy: uid }, { company: user?.companyName || user?.displayName }] })
    .project({ title: 1, _id: 1 })
    .limit(10)
    .toArray();

  const jobIds = companyJobs.map((j) => j._id);

  let totalApplicants = 0;
  if (jobIds.length > 0) {
    totalApplicants = await db
      .collection("applications")
      .countDocuments({ jobId: { $in: jobIds } });
  }

  return {
    role: "recruiter",
    profile: user || {},
    activeJobsCount: companyJobs.length,
    recentJobs: companyJobs.slice(0, 5).map((j) => ({ title: j.title })),
    totalApplicants,
  };
}

/**
 * Build a lightweight learning / skill-gap context.
 * @param {string} uid - firebaseUid
 * @returns {Promise<object>}
 */
export async function getLearningContext(uid) {
  const db = getDB();

  const user = await db.collection("users").findOne(
    { firebaseUid: uid },
    { projection: { skills: 1, title: 1, _id: 0 } }
  );

  const latestApp = await db.collection("applications").findOne(
    { firebaseUid: uid },
    { sort: { createdAt: -1 }, projection: { jobTitle: 1, _id: 0 } }
  );

  return {
    currentSkills: user?.skills || [],
    currentTitle: user?.title || "",
    recentTargetRole: latestApp?.jobTitle || "Unknown",
  };
}
