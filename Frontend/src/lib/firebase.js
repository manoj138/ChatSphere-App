import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { axiosInstance } from "../services/api";

const firebaseConfig = {
  apiKey: "AIzaSyBx6n_rUmh1i9i6q953VZ0Ti3IW1R2qcBI",
  authDomain: "chatsphere-fc9b3.firebaseapp.com",
  projectId: "chatsphere-fc9b3",
  storageBucket: "chatsphere-fc9b3.firebasestorage.app",
  messagingSenderId: "799384932967",
  appId: "1:799384932967:web:5f9f57cf6fe7daec247ac2",
  measurementId: "G-139LN680WJ"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        // You still need to replace this VAPID KEY from Firebase Console
        vapidKey: "BOM7_L4uY_U2h3f6E7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8" 
      });
      if (token) {
        console.log("FCM Token Generated:", token);
        await axiosInstance.put("/auth/update-fcm-token", { token });
      }
    }
  } catch (error) {
    console.error("Error requesting FCM token:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
