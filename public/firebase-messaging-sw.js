// DO NOT USE 'use client' OR 'use server'
// This file is a service worker and has its own separate context.

// Import and configure Firebase
// See: https://firebase.google.com/docs/cloud-messaging/js/receive#handle-messages-when-your-app-is-in-the-background
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

// This config is intentionally public.
const firebaseConfig = {
  "projectId": "studio-6708594834-5c158",
  "appId": "1:366990089732:web:d748f6ca354fa093e1df51",
  "apiKey": "AIzaSyDXfG_u4-lSWxzSnDmDvvgYj2Kn1dD1-bw",
  "authDomain": "studio-6708594834-5c158.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "366990089732"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: Set a background message handler.
// This will be triggered when a message is received while the app is in the background.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optional: you can add an icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
