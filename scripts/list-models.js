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

const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
  console.log("Fetching list of models from Google AI...");
  try {
    // Note: listModels is a method on the GoogleGenerativeAI object or require client
    // Let's call the API's listModels
    // Wait, in standard @google/generative-ai SDK:
    // It is not direct if using newer SDKs, but we can hit the API endpoint directly using fetch!
    // Hitting the API endpoint directly is 100% reliable and doesn't depend on SDK versions.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch models: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Available models:");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- Name: ${m.name} (Display: ${m.displayName})`);
      }
    });
  } catch (error) {
    console.error("Failed to query models:", error.message);
  }
}

checkModels();
