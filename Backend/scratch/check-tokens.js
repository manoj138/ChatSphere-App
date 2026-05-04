const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const User = require("../src/models/userModel");

async function checkTokens() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");
    
    const users = await User.find({ fcmToken: { $ne: "" } });
    console.log(`Found ${users.length} users with FCM tokens.`);
    
    users.forEach(u => {
      console.log(`User: ${u.username}, Token: ${u.fcmToken.substring(0, 20)}...`);
    });

    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}

checkTokens();
