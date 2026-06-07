const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const lines = envContent.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("GEMINI_API_KEY=")) {
          apiKey = line.split("=")[1].trim().replace(/['"]/g, "");
          break;
        }
      }
    }
  } catch (err) {
    console.warn("Could not read .env.local file directly:", err.message);
  }
}

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined.");
  process.exit(1);
}

// Visual indicator of key structure
console.log(`Using API Key starting with: ${apiKey.substring(0, 7)}...`);
if (!apiKey.startsWith("AIzaSy")) {
  console.warn("⚠ WARNING: Standard Google API keys typically start with 'AIzaSy'. Your key format might be incorrect.");
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  console.log("Testing connection to Gemini AI...");
  try {
    // Attempting with gemini-2.5-flash first
    console.log("Attempting model: gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Respond with the word 'Success'.");
    console.log("✓ Connection successful! Response:", result.response.text().trim());
  } catch (error) {
    console.error("✗ gemini-2.5-flash failed. Error details:", error.message);
    
    // Fallback attempt with gemini-1.5-flash in case 2.5 is not accessible
    console.log("\nAttempting fallback model: gemini-1.5-flash...");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Respond with the word 'Success'.");
      console.log("✓ Connection successful with 1.5-flash! Response:", result.response.text().trim());
    } catch (fallbackError) {
      console.error("✗ gemini-1.5-flash fallback failed too. Error details:", fallbackError.message);
    }
  }
}

testGemini();
