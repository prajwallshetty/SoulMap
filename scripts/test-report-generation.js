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

const details = {
  fullName: "John Doe",
  gender: "Male",
  dob: "1990-01-01",
  birthTime: "12:00",
  birthPlace: "Mumbai, India"
};

const prompt = `
Generate a highly detailed, professional, and comprehensive Vedic Astrology (Jyotish) report for the following individual.
Be extremely detailed in each section. Make all explanations elaborate, insightful, and practical.

Birth Details:
- Full Name: ${details.fullName}
- Gender: ${details.gender}
- Date of Birth: ${details.dob} (YYYY-MM-DD)
- Time of Birth: ${details.birthTime} (24-hour HH:MM)
- Place of Birth: ${details.birthPlace}

You MUST return a JSON object with the exact structure below. Do not wrap it in anything else or add markdown formatting outside the JSON:

{
  "basicAnalysis": {
    "lagna": "Ascendant / Rising Sign (e.g., Aries, Taurus)",
    "moonSign": "Moon Sign / Rashi (e.g., Cancer, Leo)",
    "sunSign": "Sun Sign / Surya Rashi (e.g., Pisces, Scorpio)",
    "nakshatra": "Nakshatra / Birth Star (e.g., Rohini, Ashwini)",
    "pada": 1
  },
  "personality": {
    "summary": "Detailed overall personality overview.",
    "strengths": ["Strength 1"],
    "weaknesses": ["Weakness 1"],
    "leadership": "Leadership style",
    "communication": "Communication style",
    "emotionalTendencies": "Emotional tendencies"
  },
  "career": {
    "bestFields": ["Field 1"],
    "softwareEngineeringSuitability": "Suitability score and analysis",
    "entrepreneurshipPotential": "Assessment",
    "businessVsJob": "Analysis",
    "leadershipPotential": "Leadership growth",
    "successTimeline": "Timeline"
  },
  "finance": {
    "wealthPotential": "Wealth potential",
    "incomePatterns": "Income patterns",
    "investments": "Investments",
    "propertyProspects": "Property prospects"
  },
  "loveMarriage": {
    "relationshipTendencies": "Tendencies",
    "marriageTiming": "Timing",
    "partnerCharacteristics": "Characteristics",
    "compatibilityInsights": "Insights"
  },
  "health": {
    "generalTendencies": "Health overview",
    "lifestyleSuggestions": ["Diet suggestion"]
  },
  "planetAnalysis": [
    {
      "planet": "Sun",
      "house": 1,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Effects"
    }
  ],
  "dashaAnalysis": {
    "currentInfluences": "Current influences",
    "futureInfluences": "Future influences"
  },
  "yogasDoshas": {
    "yogas": [
      {
        "name": "Yoga Name",
        "description": "Description",
        "effects": "Effects",
        "remedy": "Remedy"
      }
    ],
    "doshas": [
      {
        "name": "Dosha Name",
        "description": "Description",
        "effects": "Effects",
        "remedy": "Remedy"
      }
    ]
  },
  "practicalAdvice": {
    "career": "Career guidance",
    "business": "Business advice",
    "finance": "Financial advice",
    "relationship": "Relationship advice",
    "personalGrowth": "Personal growth advice"
  }
}
`;

async function runTest() {
  console.log("Generating report using gemini-3.5-flash...");
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  try {
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    console.log("----------------- RAW RESPONSE -----------------");
    console.log(textResponse);
    console.log("------------------------------------------------");
    
    console.log("Attempting to parse response as JSON...");
    const parsed = JSON.parse(textResponse);
    console.log("✓ Successfully parsed as JSON!");
    console.log("Basic Analysis Check:", parsed.basicAnalysis);
  } catch (error) {
    console.error("✗ Failed during test. Error details:", error);
  }
}

runTest();
