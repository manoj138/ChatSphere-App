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

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "chatsphere-msg",
    renotify: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
