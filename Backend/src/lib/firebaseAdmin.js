const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let isFirebaseInitialized = false;

try {
  if (admin.apps.length === 0) {
    const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isFirebaseInitialized = true;
      console.log("Firebase Admin initialized successfully.");
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

  // THE ULTIMATE FIX: We send ONLY 'data' to the FCM server.
  // By omitting the top-level 'notification' object, we prevent the browser 
  // from automatically displaying its own plain notification. 
  // Our Service Worker (chatsphere-sw.js) will handle this 'data' and 
  // show exactly ONE manual notification with our custom branding.
  const message = {
    data: {
      ...data,
      title: title,
      body: body,
      click_action: "/"
    },
    token: token,
    // Add high urgency to ensure delivery even if the browser doesn't see a notification object
    webpush: {
      headers: {
        Urgency: "high"
      },
      fcm_options: {
        link: "/"
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully dispatched data-only notification:", response);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

module.exports = { sendNotification };
