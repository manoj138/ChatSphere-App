/* global importScripts, firebase, clients */

importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBx6n_rUmh1i9i6q953VZ0Ti3IW1R2qcBI",
  authDomain: "chatsphere-fc9b3.firebaseapp.com",
  projectId: "chatsphere-fc9b3",
  storageBucket: "chatsphere-fc9b3.firebasestorage.app",
  messagingSenderId: "799384932967",
  appId: "1:799384932967:web:5f9f57cf6fe7daec247ac2",
  measurementId: "G-139LN680WJ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// THE FINAL FIX: We handle everything manually in the background.
// Since we won't send the 'notification' object from the backend anymore, 
// the browser will NOT show its own plain notification. 
// ONLY THIS manual one will be shown.
messaging.onBackgroundMessage((payload) => {
  console.log("Payload received in ChatSphere SW:", payload);
  
  const notificationTitle = payload.data?.title || "New Signal Received";
  const notificationOptions = {
    body: payload.data?.body || "Check your grid for updates.",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "chatsphere-unique-msg",
    renotify: true,
    requireInteraction: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) client = clientList[i];
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
