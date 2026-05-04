const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let isFirebaseInitialized = false;

try {
  const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseInitialized = true;
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("Firebase serviceAccountKey.json not found. Notifications will be disabled.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error.message);
}

const sendNotification = async (token, title, body, data = {}) => {
  if (!isFirebaseInitialized || !token) return;

  const message = {
    notification: { title, body },
    data,
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent notification:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendNotification };
