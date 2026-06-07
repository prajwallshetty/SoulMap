const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, val] = arg.split("=");
  if (key.startsWith("--")) {
    args[key.replace("--", "")] = val;
  }
});

let mongodbUri = process.env.MONGODB_URI;

// Parse .env.local if not loaded by process environment
if (!mongodbUri) {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const lines = envContent.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("MONGODB_URI=")) {
          mongodbUri = line.split("=")[1].trim().replace(/['"]/g, "");
          break;
        }
      }
    }
  } catch (err) {
    console.warn("Could not read .env.local file directly:", err.message);
  }
}

if (!mongodbUri) {
  console.error("Error: MONGODB_URI is not defined. Please create .env.local or set MONGODB_URI.");
  process.exit(1);
}

// User Schema matching models/User.ts
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, default: "user" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function run() {
  const email = args.email;
  const password = args.password;
  const name = args.name || "System Admin";

  if (!email) {
    console.log(`
SoulMap Admin Seeding Utility
==============================
Usage:
  1. Create a new Admin user (or update password & set admin role if user exists):
     node scripts/create-admin.js --email=admin@example.com --password=adminpass --name="Admin Name"

  2. Promote an existing user to Admin:
     node scripts/create-admin.js --email=user@example.com

Options:
  --email      Email address (required)
  --password   New password (optional - if omitted, promotes existing user)
  --name       Display Name (optional - defaults to "System Admin" if creating)
    `);
    process.exit(0);
  }

  const emailLower = email.toLowerCase().trim();

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongodbUri, { bufferCommands: false });
    console.log("Connected successfully.\n");

    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      if (password) {
        console.log(`User ${emailLower} already exists. Updating password and elevating to admin...`);
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUser.password = hashedPassword;
        existingUser.role = "admin";
        if (args.name) existingUser.name = args.name;
        await existingUser.save();
        console.log(`✓ User ${emailLower} has been updated, password changed, and role set to 'admin'.`);
      } else {
        console.log(`User ${emailLower} already exists. Elevating role to admin...`);
        existingUser.role = "admin";
        await existingUser.save();
        console.log(`✓ User ${emailLower} has been promoted to 'admin'.`);
      }
    } else {
      if (!password) {
        console.error(`Error: User with email ${emailLower} does not exist. To create a new user, please provide a --password.`);
        process.exit(1);
      }
      console.log(`Creating new admin user ${emailLower}...`);
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email: emailLower,
        password: hashedPassword,
        role: "admin"
      });
      console.log(`✓ Admin user ${emailLower} created successfully!`);
    }

    process.exit(0);
  } catch (error) {
    console.error("✗ Operation failed:", error);
    process.exit(1);
  }
}

run();
