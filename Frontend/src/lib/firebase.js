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
      if ('serviceWorker' in navigator) {
        // Use our new custom service worker name to avoid browser caching issues
        const registration = await navigator.serviceWorker.register('/chatsphere-sw.js');
        
        const token = await getToken(messaging, {
          vapidKey: "BFIpk_Hzv5vt-ebJdle9rdx7DrALt3SXdEdWZpb-OLVal3PMelrXOFbqai7brGBuGBmxzwqH59TogBOJ8RPIZZw",
          serviceWorkerRegistration: registration
        });

        if (token) {
          console.log("FCM Token Generated:", token);
          try {
            await axiosInstance.put("/auth/update-fcm-token", { token });
            console.log("FCM Token synchronized.");
          } catch (syncErr) {
            if (syncErr.response?.status !== 401) {
              console.error("Token sync failed:", syncErr.message);
            }
          }
        }
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
