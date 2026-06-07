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
const models = ["gemini-3.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

async function runDiagnose() {
  console.log("Diagnosing Gemini API response for multiple models...");

  for (const modelName of models) {
    console.log(`\n--------------------------------------------`);
    console.log(`Testing model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });
      // Short test prompt asking for JSON
      const result = await model.generateContent("Respond with valid JSON containing: { \"status\": \"OK\" }");
      console.log(`✓ SUCCESS! Response:`, result.response.text().trim());
    } catch (err) {
      console.error(`✗ FAILED:`, err.message);
    }
  }
}

runDiagnose();
