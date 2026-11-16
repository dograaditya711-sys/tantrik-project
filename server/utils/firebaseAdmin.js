const admin = require('firebase-admin');

// Fly.io environment variables se Firebase config uthana
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Private key mein newline characters (\n) ko sahi format karna
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

module.exports = admin;