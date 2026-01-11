// This file intentionally left blank. It is needed for Firebase Messaging.
// When deployed, Firebase will automatically configure it.
// For local development, you might need to add initialization code if you are
// testing push notifications locally outside of the Firebase Hosting environment.

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXfG_u4-lSWxzSnDmDvvgYj2Kn1dD1-bw",
  authDomain: "studio-6708594834-5c158.firebaseapp.com",
  projectId: "studio-6708594834-5c158",
  storageBucket: "studio-6708594834-5c158.appspot.com",
  messagingSenderId: "366990089732",
  appId: "1:366990089732:web:d748f6ca354fa093e1df51"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Make sure you have this icon in your public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
