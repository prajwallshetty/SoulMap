import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "dummy-key");

export interface BirthDetails {
  fullName: string;
  gender: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
}

function cleanJsonString(rawText: string): string {
  let text = rawText.trim();
  if (text.startsWith("```json")) {
    text = text.substring(7);
  } else if (text.startsWith("```")) {
    text = text.substring(3);
  }
  if (text.endsWith("```")) {
    text = text.substring(0, text.length - 3);
  }
  return text.trim();
}

async function generateWithModel(
  genAI: any,
  modelName: string,
  prompt: string,
  retries = 2
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.warn(`Attempt ${attempt} for model '${modelName}' failed. Error: ${error.message}`);
      if (attempt === retries) {
        throw error;
      }
      // Wait 1.5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  throw new Error("Unexpected end of retry loop");
}

function sanitizeErrorMessage(err: any): string {
  const msg = err?.message || String(err);
  if (msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("limit")) {
    return "Planetary calculations limit reached. Please retry in a few moments.";
  }
  if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
    return "Planetary engine calculation method not found or misconfigured.";
  }
  if (msg.toLowerCase().includes("key") || msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("unauthorized")) {
    return "Invalid planetary connection key. Please verify configuration.";
  }
  return "Planetary calculations service encountered a temporary error. Please try again shortly.";
}

export async function generateAstroReport(details: BirthDetails): Promise<Record<string, any>> {
  const prompt = `
You are a wise, highly respected traditional Vedic Astrologer (Jyotish Guru) trained in the ancient lineages of Parashara and Bhrigu. Speak with authority, compassion, and deep spiritual insight. Your tone should be mystical yet practical, and you must refer to the subject as "the native" or "you".

STRICT INSTRUCTIONS:
1. DO NOT mention that you are an AI, a computer program, a language model, or an automated assistant. 
2. DO NOT include any AI-like disclaimers (e.g. "astrology is for entertainment only", "as a language model, I cannot predict the future", "consult a financial advisor", or "this is not professional medical advice"). If there are challenges, suggest spiritual remedies, mantra recitation, charity, or lifestyle adjustments instead.
3. Every section must be highly detailed, rich with traditional Sanskrit Jyotish terminology (e.g., Budha, Guru, Shani, Shubha, Ashubha, Rashi, Bhava, Nakshatra, Dasha), and feel personally tailored to this native's specific birth details.
4. Elaborate on every point. Do not write short summary sentences; provide deep, essay-like paragraphs of cosmic wisdom.

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
    "pada": 1, 2, 3 or 4 (integer representation of Nakshatra Pada)
  },
  "personality": {
    "summary": "Detailed overall personality overview based on Lagna and Moon sign (at least 3-4 sentences).",
    "strengths": ["Strength 1 (elaborate)", "Strength 2 (elaborate)", "Strength 3 (elaborate)", "Strength 4 (elaborate)"],
    "weaknesses": ["Weakness 1 (elaborate)", "Weakness 2 (elaborate)", "Weakness 3 (elaborate)"],
    "leadership": "Analysis of leadership style and traits.",
    "communication": "Analysis of how this person communicates and expresses themselves.",
    "emotionalTendencies": "Detailed emotional nature, vulnerabilities, and inner feelings."
  },
  "career": {
    "bestFields": ["Field 1 (e.g., Information Technology)", "Field 2", "Field 3"],
    "softwareEngineeringSuitability": "In-depth suitability score and analysis for software engineering, logic, and coding tasks.",
    "entrepreneurshipPotential": "Detailed assessment of capability to run an enterprise or startup.",
    "businessVsJob": "A comparative analysis between doing business (self-employed) vs a corporate/stable job.",
    "leadershipPotential": "Career-based leadership growth, capability to manage teams.",
    "successTimeline": "Astrological timeline indicating periods of high success, promotions, or career shifts."
  },
  "finance": {
    "wealthPotential": "Vedic wealth potentials (Dhana Yoga effects).",
    "incomePatterns": "Patterns of earnings, steady vs fluctuating income.",
    "investments": "Suitability of investments like stocks, mutual funds, real estate, metals, etc.",
    "propertyProspects": "Buying land, home, or vehicle prospects in this lifetime."
  },
  "loveMarriage": {
    "relationshipTendencies": "Relationship behaviour, attachments, and expectations.",
    "marriageTiming": "Estimated ideal time or upcoming favorable planetary periods for marriage.",
    "partnerCharacteristics": "Traits, personality, and profession prediction of the spouse/partner.",
    "compatibilityInsights": "General advice on choosing a partner and maintaining harmony."
  },
  "health": {
    "generalTendencies": "Vedic physical constitution (Vata/Pitta/Kapha tendencies) and general health overview.",
    "lifestyleSuggestions": ["Diet suggestion (elaborated)", "Physical activity suggestion (elaborated)", "Stress relief suggestion"]
  },
  "planetAnalysis": [
    {
      "planet": "Sun",
      "house": 1,
      "sign": "Sign name",
      "dignity": "Exalted / Debilitated / Own Sign / Friendly / Neutral / Enemy",
      "effects": "Comprehensive detail of the Sun's placement impact on personality, career, and parents."
    },
    {
      "planet": "Moon",
      "house": 2,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Moon placement on emotions, wealth, mother, and domestic peace."
    },
    {
      "planet": "Mars",
      "house": 3,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Mars placement on energy, siblings, courage, and property."
    },
    {
      "planet": "Mercury",
      "house": 4,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Mercury placement on intellect, education, writing, and speech."
    },
    {
      "planet": "Jupiter",
      "house": 5,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Jupiter placement on wisdom, children, luck, and wealth."
    },
    {
      "planet": "Venus",
      "house": 6,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Venus placement on relationships, arts, luxuries, and comforts."
    },
    {
      "planet": "Saturn",
      "house": 7,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Saturn placement on discipline, delays, obstacles, and career perseverance."
    },
    {
      "planet": "Rahu",
      "house": 8,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Rahu placement on desires, illusions, foreign travels, and sudden gains."
    },
    {
      "planet": "Ketu",
      "house": 9,
      "sign": "Sign name",
      "dignity": "Dignity status",
      "effects": "Impact of Ketu placement on spirituality, detachment, occult, and liberation."
    }
  ],
  "dashaAnalysis": {
    "currentInfluences": "Detailed explanation of the current Mahadasha and Antardasha active for this person, explaining what they represent and how to navigate this period.",
    "futureInfluences": "An outlook of the upcoming planetary periods and shifts in focus over the next 5-10 years."
  },
  "yogasDoshas": {
    "yogas": [
      {
        "name": "Yoga Name (e.g., Budhaditya Yoga)",
        "description": "Brief description of how it forms in a chart.",
        "effects": "Elaborate impact of this yoga on the native's life.",
        "remedy": "How to enhance or activate the positive effects."
      }
    ],
    "doshas": [
      {
        "name": "Dosha Name (e.g., Manglik Dosha / Sade Sati)",
        "description": "Brief description of the affliction.",
        "effects": "How this dosha manifests in challenges or delays.",
        "remedy": "Specific practical remedies (donations, mantras, actions) to pacify the negative impact."
      }
    ]
  },
  "practicalAdvice": {
    "career": "Specific, actionable career guidance.",
    "business": "Actionable business/industry advice.",
    "finance": "Financial planning and saving recommendations.",
    "relationship": "Specific advice to nurture relationships.",
    "personalGrowth": "Mindset shifts and spiritual practices for personal evolution."
  }
}
`;

  // Attempt using primary model: gemini-3.5-flash with retries
  try {
    console.log("Requesting report generation from primary model 'gemini-3.5-flash'...");
    const rawResponse = await generateWithModel(genAI, "gemini-3.5-flash", prompt, 2);
    const cleanJson = cleanJsonString(rawResponse);
    return JSON.parse(cleanJson);
  } catch (primaryError: any) {
    console.warn("Primary model 'gemini-3.5-flash' failed after retries. Attempting fallback to 'gemini-2.5-flash'... Error details:", primaryError.message);
    
    // Attempt fallback using available model: gemini-2.5-flash
    try {
      const fallbackResponse = await generateWithModel(genAI, "gemini-2.5-flash", prompt, 1);
      const cleanFallbackJson = cleanJsonString(fallbackResponse);
      return JSON.parse(cleanFallbackJson);
    } catch (fallbackError: any) {
      console.error("All calculations models failed. Fallback error:", fallbackError);
      throw new Error(`Failed to generate astrology report. Planetary engine returned: ${sanitizeErrorMessage(fallbackError)}`);
    }
  }
}
