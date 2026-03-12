const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-SDK.json');

// Initialize Firebase Admin if it hasn't been initialized yet
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // Standard Firebase Realtime Database URL format based on project ID
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
    });
}

const db = admin.database();

/**
 * Send a real-time notification to a specific user
 * @param {string} userId - Firebase UID of the candidate or recruiter
 * @param {object} notification - Notification data (title, message, type, jobId, etc)
 */
async function sendNotification(userId, notification) {
    try {
        // Push generates a unique ID for the notification
        const ref = db.ref(`notifications/${userId}`).push();
        const fullNotification = {
            id: ref.key,
            ...notification,
            // Use server timestamp so times match the DB server
            createdAt: admin.database.ServerValue.TIMESTAMP,
            read: false,
        };
        await ref.set(fullNotification);
        console.log(`Real-time notification sent to user ${userId}`);
    } catch (error) {
        console.error("Firebase sendNotification error:", error);
    }
}

/**
 * Update the real-time applicant count for a job
 * @param {string} jobId - ID of the job
 * @param {number} count - The current total count of applicants
 */
async function updateApplicantCount(jobId, count) {
    try {
        const ref = db.ref(`jobApplicants/${jobId}`);
        await ref.set({ count });
        console.log(`Updated applicant count for job ${jobId} to ${count}`);
    } catch (error) {
        console.error("Firebase updateApplicantCount error:", error);
    }
}

module.exports = {
    admin,
    db,
    sendNotification,
    updateApplicantCount
};
