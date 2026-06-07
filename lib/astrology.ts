import { generateAstroReport, BirthDetails } from "./gemini";

export interface AstrologyEngine {
  generateReport(details: BirthDetails): Promise<Record<string, any>>;
}

class VedicAstrologyService implements AstrologyEngine {
  /**
   * Generates a complete Vedic Astrology report based on birth details.
   * Currently uses planetary synthesis models under the hood to generate rich qualitative reports.
   * Can be extended or swapped later with a planetary engine like Swiss Ephemeris.
   */
  async generateReport(details: BirthDetails): Promise<Record<string, any>> {
    // Basic validation of inputs
    if (!details.fullName || !details.gender || !details.dob || !details.birthTime || !details.birthPlace) {
      throw new Error("Missing required birth details for report generation.");
    }

    // Call planetary calculations engine
    const reportData = await generateAstroReport(details);
    return reportData;
  }
}

export const astrologyService = new VedicAstrologyService();
export default astrologyService;
