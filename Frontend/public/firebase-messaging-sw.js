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

// We removed manual notification display here to let the browser 
// handle the 'notification' payload automatically. 
// This prevents double notifications.

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received (handled by browser automatically):", payload);
});

// Handle notification click to open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
