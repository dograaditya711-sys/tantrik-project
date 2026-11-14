importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCM-0ZjxSnj4g2ULY2es2icNxCwqekkXDw",
  authDomain: "tanitrka.firebaseapp.com",
  projectId: "tanitrka",
  storageBucket: "tanitrka.firebasestorage.app",
  messagingSenderId: "1021898066783",
  appId: "1:1021898066783:web:c700ed3ec16605293884ea"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Agar aapke public folder mein logo hai
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});