var admin = require("firebase-admin");

var serviceAccount = require("../secrets/mia-milkshare-firebase-adminsdk-ytbcg-c974f582c3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
