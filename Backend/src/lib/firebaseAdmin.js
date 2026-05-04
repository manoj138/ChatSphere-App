const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let isFirebaseInitialized = false;

try {
  if (admin.apps.length === 0) {
    const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      
      // CRITICAL FIX: Replace literal \n characters with actual newlines in the private key
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isFirebaseInitialized = true;
      console.log("Firebase Admin initialized successfully.");
    } else {
      console.warn("Firebase serviceAccountKey.json not found.");
    }
  } else {
    isFirebaseInitialized = true;
  }
} catch (error) {
  console.error("Firebase initialization failed:", error.message);
  isFirebaseInitialized = false;
}

const sendNotification = async (token, title, body, data = {}) => {
  if (!isFirebaseInitialized || !token) return;

  const message = {
    notification: { title, body },
    data: {
      ...data,
      click_action: "FLUTTER_NOTIFICATION_CLICK" // Common standard, helps some browsers
    },
    token: token,
    webpush: {
      headers: {
        Urgency: "high"
      },
      notification: {
        title,
        body,
        icon: "/favicon.svg",
        click_action: "/"
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent notification:", response);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

module.exports = { sendNotification };
