const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

// Minimal schemas matching Mongoose models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

async function initDb() {
  console.log("Connecting to MongoDB at:", mongodbUri);
  try {
    await mongoose.connect(mongodbUri, { bufferCommands: false });
    console.log("✓ MongoDB Connected Successfully!");

    console.log("Creating 'users' and 'reports' collections explicitly...");
    
    // Force Mongoose to create the collections in the database
    await User.createCollection();
    console.log("✓ 'users' collection initialized.");
    
    await Report.createCollection();
    console.log("✓ 'reports' collection initialized.");

    console.log("\nDatabase setup complete! You should now see the collections in your MongoDB cluster/client.");
    process.exit(0);
  } catch (error) {
    console.error("✗ Failed to initialize database:", error);
    process.exit(1);
  }
}

initDb();
