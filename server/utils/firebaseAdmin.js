const admin = require('firebase-admin');

// Check agar firebase-admin theek se load hua hai
if (typeof admin === 'undefined' || !admin.initializeApp) {
  console.error("❌ Firebase admin package properly loaded nahi hua. Kripya 'npm install firebase-admin' run karein.");
  module.exports = null; // Prevent crash
} else {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
  };

  if (!admin.apps || !admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin Initialized Successfully");
    } catch (error) {
      console.error("❌ Firebase Admin Initialization Error:", error);
    }
  }
  module.exports = admin;
}