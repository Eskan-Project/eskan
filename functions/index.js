const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.makeAdmin = functions.https.onRequest(async (req, res) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Use a secret header to secure your endpoint
  const secret = req.headers["x-admin-secret"];
  // You can set this secret in your environment using:
  // firebase functions:config:set admin.secret="YOUR_SECRET"
  if (secret !== functions.config().admin.secret) {
    return res.status(403).send("Unauthorized");
  }

  const { uid } = req.body;
  if (!uid) {
    return res.status(400).send("Missing uid");
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.status(200).send(`User ${uid} is now an admin`);
  } catch (error) {
    console.error("Error setting admin claims:", error);
    res.status(500).send("Internal Server Error");
  }
});
