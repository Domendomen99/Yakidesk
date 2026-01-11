// This file must be in the public directory.

// Import the Firebase app and messaging libraries.
// See: https://firebase.google.com/docs/web/setup#access-firebase
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

// The Firebase config object is taken from the client-side configuration.
// It's safe to expose this data. Security is handled by Firestore rules.
const firebaseConfig = {
  "projectId": "studio-6708594834-5c158",
  "appId": "1:366990089732:web:d748f6ca354fa093e1df51",
  "apiKey": "AIzaSyDXfG_u4-lSWxzSnDmDvvgYj2Kn1dD1-bw",
  "authDomain": "studio-6708594834-5c158.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "366990089732"
};


// Initialize the Firebase app in the service worker.
const app = initializeApp(firebaseConfig);

// Get the Firebase Messaging instance.
// This is required to handle background notifications.
const messaging = getMessaging(app);

// Note: Background message handling would be added here if needed,
// but for simple notifications, this setup is sufficient.
// self.addEventListener('push', (event) => { ... });

console.log('Firebase Messaging Service Worker initialized.');
