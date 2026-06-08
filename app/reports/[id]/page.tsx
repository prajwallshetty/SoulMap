"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Calendar, Clock, MapPin, Printer, ArrowLeft, Loader2, 
  User, Compass, Award, Heart, Activity, ShieldAlert,
  Zap, Target, BookOpen, Sparkles, Briefcase, TrendingUp,
  CheckCircle2, AlertCircle, XCircle, Building2, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PlanetData {
  planet: string;
  house: number;
  sign: string;
  dignity: string;
  effects: string;
}

interface YogaData {
  name: string;
  description: string;
  effects: string;
  remedy?: string;
}

interface DoshaData {
  name: string;
  description: string;
  effects: string;
  remedy: string;
}

interface CareerProfession {
  rank: number;
  profession: string;
  score: number;
  industry: string;
  reasoning: string;
}

interface CareerPotentialDimension {
  score: number;
  summary: string;
}

interface CareerPathRecommendation {
  verdict: string; // "Highly Recommended" | "Conditionally Recommended" | "Not Recommended"
  explanation: string;
}

interface CareerAnalysisData {
  topProfessions: CareerProfession[];
  potentials: {
    business: CareerPotentialDimension;
    employment: CareerPotentialDimension;
    leadership: CareerPotentialDimension;
    creative: CareerPotentialDimension;
    technical: CareerPotentialDimension;
    publicInfluence: CareerPotentialDimension;
  };
  pathRecommendations: {
    buildBusiness: CareerPathRecommendation;
    privateJob: CareerPathRecommendation;
    governmentService: CareerPathRecommendation;
    selfEmployed: CareerPathRecommendation;
    freelancer: CareerPathRecommendation;
    managementRoles: CareerPathRecommendation;
  };
  favorableIndustries: string[];
  careerTimeline: {
    growthPhases: string;
    majorBreakthroughs: string;
    challenges: string;
  };
}

interface MarriageTimingProb {
  probability: string;
  reasoning: string;
}

interface RelationshipNatureProp {
  score: number;
  description: string;
}

interface MarriageAnalysisData {
  timingProbabilities: {
    earlyMarriage: MarriageTimingProb;
    averageMarriage: MarriageTimingProb;
    lateMarriage: MarriageTimingProb;
  };
  likelyAgeRange: string;
  confidenceLevel: string;
  partnerProfile: {
    personalityTraits: string;
    careerTendencies: string;
  };
  relationshipNature: {
    romantic: RelationshipNatureProp;
    practical: RelationshipNatureProp;
    emotional: RelationshipNatureProp;
    independent: RelationshipNatureProp;
  };
  strengths: string[];
  challenges: string[];
  favorablePeriods: {
    seriousRelationships: string;
    engagement: string;
    marriage: string;
  };
  cautionPeriods: string;
  astrologicalReasoning: {
    seventhHouse: string;
    venusJupiter: string;
    darakaraka: string;
    navamsaD9: string;
    dashaCycles: string;
  };
  remedialAdvice: string;
}

interface ReportData {
  _id: string;
  fullName: string;
  gender: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  createdAt: string;
  generatedReport: {
    basicAnalysis: {
      lagna: string;
      moonSign: string;
      sunSign: string;
      nakshatra: string;
      pada: number;
    };
    personality: {
      summary: string;
      strengths: string[];
      weaknesses: string[];
      leadership: string;
      communication: string;
      emotionalTendencies: string;
    };
    career: {
      bestFields: string[];
      softwareEngineeringSuitability: string;
      entrepreneurshipPotential: string;
      businessVsJob: string;
      leadershipPotential: string;
      successTimeline: string;
    };
    careerAnalysis?: CareerAnalysisData;
    marriageAnalysis?: MarriageAnalysisData;
    finance: {
      wealthPotential: string;
      incomePatterns: string;
      investments: string;
      propertyProspects: string;
    };
    loveMarriage: {
      relationshipTendencies: string;
      marriageTiming: string;
      partnerCharacteristics: string;
      compatibilityInsights: string;
    };
    health: {
      generalTendencies: string;
      lifestyleSuggestions: string[];
    };
    planetAnalysis: PlanetData[];
    dashaAnalysis: {
      currentInfluences: string;
      futureInfluences: string;
    };
    yogasDoshas: {
      yogas: YogaData[];
      doshas: DoshaData[];
    };
    practicalAdvice: {
      career: string;
      business: string;
      finance: string;
      relationship: string;
      personalGrowth: string;
    };
  };
}

function getScoreFromText(text: string, defaultMin = 65, defaultMax = 95): number {
  if (!text) return 75;
  
  // Try to find a percentage in the text, e.g. "85%"
  const percentMatch = text.match(/(\d+)\s*%/);
  if (percentMatch) {
    const val = parseInt(percentMatch[1], 10);
    if (val >= 0 && val <= 100) return val;
  }
  
  // Try to find a fraction like "8/10" or "8.5/10"
  const fractionMatch = text.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
  if (fractionMatch) {
    const val = parseFloat(fractionMatch[1]) * 10;
    if (val >= 0 && val <= 100) return val;
  }

  // Look for keywords
  const lower = text.toLowerCase();
  if (lower.includes("exceptional") || lower.includes("excellent") || lower.includes("extremely high") || lower.includes("outstanding")) {
    return 94;
  }
  if (lower.includes("highly suitable") || lower.includes("high suitability") || lower.includes("very strong") || lower.includes("great potential") || lower.includes("highly recommended")) {
    return 88;
  }
  if (lower.includes("good suitability") || lower.includes("moderate") || lower.includes("medium") || lower.includes("decent") || lower.includes("average")) {
    return 74;
  }
  if (lower.includes("challenging") || lower.includes("low suitability") || lower.includes("not suitable") || lower.includes("difficult")) {
    return 55;
  }

  // Fallback to a deterministic hash of the text so it's stable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const range = defaultMax - defaultMin;
  const score = defaultMin + (Math.abs(hash) % (range + 1));
  return score;
}

interface IndexMeterProps {
  title: string;
  score: number;
  description: string;
  icon?: React.ReactNode;
}

function IndexMeter({ title, score, description, icon }: IndexMeterProps) {
  return (
    <div className="p-6 rounded-xl bg-white border border-[#E4E4E7] shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-600">
            {icon}
          </div>
          <span className="text-sm font-semibold tracking-wide text-zinc-800">{title}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold font-serif text-[#3B0A45] tracking-tight">{score}%</span>
          <span className="text-[9px] text-[#71717A] uppercase tracking-widest mt-0.5 font-medium">Cosmic Score</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full bg-[#FAFAFA] rounded-full overflow-hidden border border-zinc-200/50">
          <div 
            className="h-full bg-[#3B0A45] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-[#71717A] px-0.5 font-medium">
          <span>Latent</span>
          <span>Moderate</span>
          <span>Optimal</span>
        </div>
      </div>
      <p className="text-xs text-[#71717A] font-light leading-relaxed">{description}</p>
    </div>
  );
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { status } = useSession();

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch report details
  useEffect(() => {
    if (status === "authenticated") {
      const fetchReport = async () => {
        try {
          const res = await fetch(`/api/reports/${id}`);
          if (!res.ok) {
            throw new Error("Report not found or unauthorized.");
          }
          const data = await res.json();
          setReport(data.report || null);
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Failed to load report details.");
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [status, id]);

  const handlePrint = () => {
    window.print();
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center min-h-[50vh] gap-3 bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 text-[#3B0A45] animate-spin" />
        <p className="text-sm text-zinc-500 font-light">Consulting coordinates...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !report) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center text-[#18181B] bg-[#FAFAFA] flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 mb-4 text-sm font-light">{error || "Unauthorized or report not found."}</p>
        <Button onClick={() => router.push("/dashboard")} className="bg-[#3B0A45] text-white hover:bg-[#3B0A45]/90 rounded-lg">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { basicAnalysis, personality, career, careerAnalysis, marriageAnalysis, finance, loveMarriage, health, planetAnalysis, dashaAnalysis, yogasDoshas, practicalAdvice } = report.generatedReport;

  // Calculate scores deterministically for premium visual meters
  const seScore = getScoreFromText(career.softwareEngineeringSuitability);
  const entScore = getScoreFromText(career.entrepreneurshipPotential);
  const harmonyScore = getScoreFromText(loveMarriage.compatibilityInsights);

  // Print section numbering logic
  let printSecIndex = 4;
  const careerAnalysisIndex = careerAnalysis ? printSecIndex++ : null;
  const marriageAnalysisIndex = marriageAnalysis ? printSecIndex++ : null;
  const careerFinanceIndex = printSecIndex++;
  const loveMarriageIndex = printSecIndex++;
  const planetsIndex = printSecIndex++;
  const dashasIndex = printSecIndex++;
  const practicalAdviceIndex = printSecIndex++;

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8 w-full flex-grow flex flex-col gap-5 sm:gap-6 bg-[#FAFAFA] text-[#18181B]">
      {/* 1. Header Toolbar (Screen only) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E4E4E7] pb-6 gap-4 no-print">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="text-zinc-500 hover:text-[#18181B] hover:bg-zinc-100 w-fit h-9 text-xs rounded-lg"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Dashboard
        </Button>
        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            className="bg-[#3B0A45] text-white hover:bg-[#3B0A45]/90 rounded-lg shadow-sm h-9 text-xs px-4"
          >
            <Printer className="mr-1.5 h-4 w-4 text-white" />
            Download PDF / Print
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN VIEW LAYOUT (Interactive, beautiful tabs) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-8 flex-grow no-print">
        {/* Profile Card Header */}
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 sm:p-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between shadow-sm">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-[#18181B] tracking-tight">{report.fullName}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-light">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-zinc-400" /> Born: {report.dob}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-zinc-400" /> Time: {report.birthTime}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-zinc-400" /> Place: {report.birthPlace}</span>
              <span className="text-[10px] bg-[#E8C47A]/10 text-[#3B0A45] px-2 py-0.5 rounded border border-[#E8C47A]/20 font-medium">{report.gender}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 p-3 sm:p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] w-full md:w-auto justify-around text-xs">
            <div className="text-center">
              <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Lagna</div>
              <div className="text-sm font-serif font-bold text-[#3B0A45] mt-0.5">{basicAnalysis.lagna}</div>
            </div>
            <div className="h-8 border-l border-zinc-200 mx-2 self-center" />
            <div className="text-center">
              <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Moon Sign</div>
              <div className="text-sm font-serif font-bold text-[#3B0A45] mt-0.5">{basicAnalysis.moonSign}</div>
            </div>
            <div className="h-8 border-l border-zinc-200 mx-2 self-center" />
            <div className="text-center">
              <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Nakshatra</div>
              <div className="text-sm font-serif font-bold text-[#3B0A45] mt-0.5">{basicAnalysis.nakshatra} (Pada {basicAnalysis.pada})</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="summary" className="w-full flex flex-col gap-6">
          <TabsList className="bg-zinc-100 border border-[#E4E4E7] p-1.5 rounded-xl grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center h-auto shadow-sm gap-1">
            <TabsTrigger value="summary" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Summary</TabsTrigger>
            <TabsTrigger value="personality" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Personality</TabsTrigger>
            <TabsTrigger value="career-analysis" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Career Analysis</TabsTrigger>
            <TabsTrigger value="career" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Career</TabsTrigger>
            <TabsTrigger value="marriage-analysis" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Marriage Analysis</TabsTrigger>
            <TabsTrigger value="love" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Love</TabsTrigger>
            <TabsTrigger value="planets" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Planets</TabsTrigger>
            <TabsTrigger value="dashas" className="py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#3B0A45] data-[state=active]:shadow-sm rounded-lg text-zinc-500 hover:text-zinc-900 transition-all text-center">Dashas</TabsTrigger>
          </TabsList>

          {/* TAB 1: SUMMARY */}
          <TabsContent value="summary" className="space-y-6 outline-none">
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                  <Compass className="h-5.5 w-5.5" />
                  Cosmic Blueprint Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-8 font-light leading-relaxed text-sm">
                <p className="text-zinc-700 leading-relaxed text-base">{personality.summary}</p>
                
                {/* Core parameters metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-zinc-100">
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] text-center">
                    <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Sun Sign</div>
                    <div className="text-base font-serif font-bold text-[#18181B] mt-1">{basicAnalysis.sunSign}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] text-center">
                    <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Lagna (Rising)</div>
                    <div className="text-base font-serif font-bold text-[#18181B] mt-1">{basicAnalysis.lagna}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] text-center">
                    <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Moon Sign</div>
                    <div className="text-base font-serif font-bold text-[#18181B] mt-1">{basicAnalysis.moonSign}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] text-center">
                    <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Nakshatra Star</div>
                    <div className="text-base font-serif font-bold text-[#18181B] mt-1">{basicAnalysis.nakshatra} (Pada {basicAnalysis.pada})</div>
                  </div>
                </div>

                {/* Cosmic Strengths Index Grid */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h3 className="font-serif text-base text-[#18181B] font-semibold flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#E8C47A]" />
                    Astrological Index Dashboard
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <IndexMeter 
                      title="Software Engineering" 
                      score={seScore} 
                      description="Logic processing aptitude, system design affinity, and structural coding alignment."
                      icon={<Compass className="h-4 w-4" />}
                    />
                    <IndexMeter 
                      title="Entrepreneurship" 
                      score={entScore} 
                      description="Independent enterprise initiative, leadership conviction, and risk adaptation."
                      icon={<Zap className="h-4 w-4" />}
                    />
                    <IndexMeter 
                      title="Cosmic Harmony" 
                      score={harmonyScore} 
                      description="Inherent sync for balanced communication, partnership longevity, and relationship wisdom."
                      icon={<Heart className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: PERSONALITY & HEALTH */}
          <TabsContent value="personality" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths & Weaknesses */}
              <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 rounded-xl shadow-sm">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="font-serif text-lg text-[#3B0A45] flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-[#E8C47A]" /> Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 pt-2">
                  <ul className="space-y-3">
                    {personality.strengths.map((str, i) => (
                      <li key={i} className="text-xs font-light text-zinc-600 flex items-start gap-2.5">
                        <span className="h-4.5 w-4.5 shrink-0 rounded-full bg-[#E8C47A]/10 border border-[#E8C47A]/30 text-[#3B0A45] text-[10px] flex items-center justify-center font-bold mt-0.5">✓</span>
                        <span className="leading-relaxed">{str}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 rounded-xl shadow-sm">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="font-serif text-lg text-[#3B0A45] flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 text-red-500" /> Vulnerabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 pt-2">
                  <ul className="space-y-3">
                    {personality.weaknesses.map((weak, i) => (
                      <li key={i} className="text-xs font-light text-zinc-600 flex items-start gap-2.5">
                        <span className="h-4.5 w-4.5 shrink-0 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] flex items-center justify-center font-bold mt-0.5">!</span>
                        <span className="leading-relaxed">{weak}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* In-depth Tendencies */}
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 space-y-4 rounded-xl shadow-sm">
              <h3 className="font-serif text-base text-[#3B0A45] pb-2 border-b border-zinc-100 font-bold">Psychological Tendencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1.5">Leadership Style</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">{personality.leadership}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1.5">Communication Style</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">{personality.communication}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1.5">Emotional Disposition</h4>
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">{personality.emotionalTendencies}</p>
                </div>
              </div>
            </Card>

            {/* Health & Vitality */}
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-lg text-[#3B0A45] flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-[#3B0A45]" /> Health & Physical Constitution
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-6 font-light text-xs">
                <p className="text-zinc-700 leading-relaxed text-sm">{health.generalTendencies}</p>
                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-3">Lifestyle & Diet Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {health.lifestyleSuggestions.map((sug, i) => (
                      <div key={i} className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] flex flex-col gap-1.5 shadow-sm">
                        <span className="text-[9px] font-bold text-[#E8C47A] uppercase tracking-widest">Guideline #{i+1}</span>
                        <span className="text-xs text-zinc-600 leading-relaxed font-light">{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: CAREER ANALYSIS (Deep) */}
          <TabsContent value="career-analysis" className="space-y-6 outline-none">
            {report.generatedReport.careerAnalysis ? (
              <>
                {/* Section 1: Top 10 Professions Ranked */}
                <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                      <Star className="h-5 w-5 text-[#E8C47A]" /> Top 10 Career Paths — Ranked by Cosmic Suitability
                    </CardTitle>
                    <p className="text-xs text-zinc-500 font-light mt-1">Professions ranked from highest to lowest compatibility based on planetary placements, yogas, and dasha cycles.</p>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-3">
                    {report.generatedReport.careerAnalysis.topProfessions.map((prof) => (
                      <div key={prof.rank} className="group flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-[#E4E4E7] hover:border-[#3B0A45]/30 hover:bg-zinc-50/50 transition-all duration-200">
                        {/* Rank Badge */}
                        <div className="shrink-0 flex flex-col items-center gap-1">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold font-serif shadow-sm ${
                            prof.rank === 1 ? 'bg-[#E8C47A] text-[#3B0A45]' :
                            prof.rank === 2 ? 'bg-zinc-300 text-zinc-700' :
                            prof.rank === 3 ? 'bg-amber-600/80 text-white' :
                            'bg-zinc-100 text-zinc-500 border border-[#E4E4E7]'
                          }`}>
                            #{prof.rank}
                          </div>
                        </div>
                        {/* Profession Details */}
                        <div className="flex-grow space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif font-bold text-base text-[#18181B]">{prof.profession}</span>
                            <span className="text-[10px] bg-[#E8C47A]/10 text-[#3B0A45] border border-[#E8C47A]/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">{prof.industry}</span>
                          </div>
                          {/* Score Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                              <span className="uppercase tracking-wider font-semibold">Suitability Score</span>
                              <span className="font-bold text-[#3B0A45] text-xs">{prof.score}/100</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${prof.score}%`,
                                  background: prof.score >= 85 ? 'linear-gradient(90deg, #3B0A45, #7C3AED)' :
                                              prof.score >= 70 ? 'linear-gradient(90deg, #3B0A45, #9D5B9A)' :
                                              'linear-gradient(90deg, #71717A, #A1A1AA)'
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-zinc-600 font-light leading-relaxed">{prof.reasoning}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Section 2: 6 Potential Meters */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#18181B] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#3B0A45]" />
                    Astrological Potential Index
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {([
                      { key: 'business', label: 'Business Potential', icon: <Building2 className="h-4 w-4" /> },
                      { key: 'employment', label: 'Employment Potential', icon: <Briefcase className="h-4 w-4" /> },
                      { key: 'leadership', label: 'Leadership Potential', icon: <Star className="h-4 w-4" /> },
                      { key: 'creative', label: 'Creative Potential', icon: <Sparkles className="h-4 w-4" /> },
                      { key: 'technical', label: 'Technical Potential', icon: <Zap className="h-4 w-4" /> },
                      { key: 'publicInfluence', label: 'Public Influence', icon: <Target className="h-4 w-4" /> },
                    ] as const).map(({ key, label, icon }) => {
                      const dim = report.generatedReport.careerAnalysis!.potentials[key];
                      return (
                        <IndexMeter
                          key={key}
                          title={label}
                          score={dim.score}
                          description={dim.summary}
                          icon={icon}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Career Path Recommendations */}
                <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                      <Briefcase className="h-5 w-5" /> Career Path Recommendations
                    </CardTitle>
                    <p className="text-xs text-zinc-500 font-light mt-1">Based on your birth chart's planetary strengths and weaknesses, here is how well each career path aligns with your cosmic blueprint.</p>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {([
                        { key: 'buildBusiness', label: 'Build a Business' },
                        { key: 'privateJob', label: 'Private / Corporate Job' },
                        { key: 'governmentService', label: 'Government Service' },
                        { key: 'selfEmployed', label: 'Self-Employed' },
                        { key: 'freelancer', label: 'Freelancing' },
                        { key: 'managementRoles', label: 'Management / Leadership Roles' },
                      ] as const).map(({ key, label }) => {
                        const rec = report.generatedReport.careerAnalysis!.pathRecommendations[key];
                        const isHighly = rec.verdict.toLowerCase().includes('highly');
                        const isNot = rec.verdict.toLowerCase().includes('not ');
                        return (
                          <div key={key} className={`p-4 rounded-xl border transition-all duration-200 ${
                            isHighly ? 'border-emerald-200 bg-emerald-50/50' :
                            isNot ? 'border-red-100 bg-red-50/30' :
                            'border-amber-200 bg-amber-50/30'
                          }`}>
                            <div className="flex items-start gap-2.5 mb-2">
                              {isHighly ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" /> :
                               isNot ? <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" /> :
                               <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />}
                              <div>
                                <div className="font-semibold text-xs text-[#18181B]">{label}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                                  isHighly ? 'text-emerald-700' :
                                  isNot ? 'text-red-600' :
                                  'text-amber-700'
                                }`}>{rec.verdict}</div>
                              </div>
                            </div>
                            <p className="text-[11px] text-zinc-600 font-light leading-relaxed">{rec.explanation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Section 4: Favorable Industries */}
                <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                      <Building2 className="h-5 w-5" /> Favorable Industries
                    </CardTitle>
                    <p className="text-xs text-zinc-500 font-light mt-1">Only industries that are strongly supported by your chart's planetary positions are listed below.</p>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="flex flex-wrap gap-2">
                      {report.generatedReport.careerAnalysis.favorableIndustries.map((industry, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-[#3B0A45]/10 to-[#E8C47A]/10 text-[#3B0A45] border border-[#3B0A45]/20 px-4 py-2 rounded-full shadow-sm hover:from-[#3B0A45]/20 hover:border-[#3B0A45]/40 transition-all"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#E8C47A]" />
                          {industry}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Section 5: Career Timeline */}
                <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                      <Calendar className="h-5 w-5" /> Career Timeline & Planetary Periods
                    </CardTitle>
                    <p className="text-xs text-zinc-500 font-light mt-1">Key Mahadasha and Antardasha periods that shape your professional journey.</p>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Growth Phases</span>
                        </div>
                        <p className="text-xs text-zinc-700 font-light leading-relaxed">{report.generatedReport.careerAnalysis.careerTimeline.growthPhases}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-[#3B0A45]/5 border border-[#3B0A45]/15 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-[#3B0A45] flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-[#E8C47A]" />
                          </div>
                          <span className="text-xs font-bold text-[#3B0A45] uppercase tracking-wider">Major Breakthroughs</span>
                        </div>
                        <p className="text-xs text-zinc-700 font-light leading-relaxed">{report.generatedReport.careerAnalysis.careerTimeline.majorBreakthroughs}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-amber-600 flex items-center justify-center">
                            <ShieldAlert className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Challenges & Cautions</span>
                        </div>
                        <p className="text-xs text-zinc-700 font-light leading-relaxed">{report.generatedReport.careerAnalysis.careerTimeline.challenges}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-12 text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm">
                <Briefcase className="h-10 w-10 text-zinc-300 mb-4" />
                <h3 className="font-serif text-base font-bold text-[#18181B] mb-1">Career Analysis Not Available</h3>
                <p className="text-xs text-zinc-500 font-light max-w-sm">This report was generated before the Career Analysis feature was available. Please generate a new report to access the full career breakdown.</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 4: CAREER & FINANCE (General) */}
          <TabsContent value="career" className="space-y-6 outline-none">
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 space-y-6 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                  <Target className="h-4.5 w-4.5" /> Career Path & Professional Alignment
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-6 font-light">
                {/* Score Meters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-zinc-100">
                  <IndexMeter 
                    title="Software Engineering Suitability" 
                    score={seScore} 
                    description={career.softwareEngineeringSuitability}
                    icon={<Compass className="h-4 w-4" />}
                  />
                  <IndexMeter 
                    title="Entrepreneurship Potential" 
                    score={entScore} 
                    description={career.entrepreneurshipPotential}
                    icon={<Zap className="h-4 w-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">Recommended Career Fields</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {career.bestFields.map((field, idx) => (
                          <span key={idx} className="text-[10px] bg-[#E8C47A]/10 text-[#3B0A45] border border-[#E8C47A]/20 px-2.5 py-1 rounded-full font-medium">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">Corporate Job vs Business Propensity</h4>
                      <p className="text-xs text-zinc-600 leading-relaxed mt-1">{career.businessVsJob}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">Career Timeline & Success Phases</h4>
                      <p className="text-xs text-zinc-600 leading-relaxed mt-1">{career.successTimeline}</p>
                    </div>
                    {career.leadershipPotential && (
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">Leadership Potential</h4>
                        <p className="text-xs text-zinc-600 leading-relaxed mt-1">{career.leadershipPotential}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial potential */}
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-lg text-[#3B0A45] flex items-center gap-2">
                  <Zap className="h-4.5 w-4.5 text-[#3B0A45]" /> Wealth & Financial Potentials
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light leading-relaxed">
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1">Wealth & Dhana Yogas</h4>
                  <p className="text-zinc-600 mt-1">{finance.wealthPotential}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1">Income & Earnings Patterns</h4>
                  <p className="text-zinc-600 mt-1">{finance.incomePatterns}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1">Investment Suitability</h4>
                  <p className="text-zinc-600 mt-1">{finance.investments}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1">Property & Asset Prospects</h4>
                  <p className="text-zinc-600 mt-1">{finance.propertyProspects}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: MARRIAGE & RELATIONSHIP ANALYSIS (Deep) */}
          <TabsContent value="marriage-analysis" className="space-y-6 outline-none">
            {marriageAnalysis ? (
              <>
                {/* Section 1: Timing & Probability Dashboard */}
                <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#E8C47A]" /> Marriage Timing & Age Outlook
                    </CardTitle>
                    <p className="text-xs text-zinc-500 font-light mt-1">
                      Probability distributions for marriage timing based on Dasha triggers and planetary accelerations/delays.
                    </p>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-6">
                    {/* Probabilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {([
                        { key: 'earlyMarriage', label: 'Early Marriage', theme: 'emerald' },
                        { key: 'averageMarriage', label: 'Average Marriage Age', theme: 'purple' },
                        { key: 'lateMarriage', label: 'Late Marriage', theme: 'amber' }
                      ] as const).map(({ key, label, theme }) => {
                        const probData = marriageAnalysis.timingProbabilities[key];
                        const numericScore = parseInt(probData.probability) || 50;
                        return (
                          <div key={key} className="p-4 rounded-xl border border-[#E4E4E7] bg-zinc-50/50 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-zinc-700">{label}</span>
                              <span className="text-base font-bold text-[#3B0A45]">{probData.probability}</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  theme === 'emerald' ? 'bg-emerald-600' :
                                  theme === 'purple' ? 'bg-[#3B0A45]' :
                                  'bg-amber-600'
                                }`}
                                style={{ width: `${numericScore}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{probData.reasoning}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Likely Age & Confidence Indicator */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                      <div className="p-4 rounded-xl bg-zinc-50 border border-[#E4E4E7] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Most Likely Marriage Age Range</span>
                          <span className="text-base font-serif font-bold text-[#3B0A45] mt-1 block">{marriageAnalysis.likelyAgeRange}</span>
                        </div>
                        <Calendar className="h-8 w-8 text-[#E8C47A]/75 shrink-0" />
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-50 border border-[#E4E4E7] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Prediction Confidence Level</span>
                          <span className="text-base font-serif font-bold text-[#3B0A45] mt-1 block">{marriageAnalysis.confidenceLevel}</span>
                        </div>
                        <Sparkles className="h-8 w-8 text-[#3B0A45]/75 shrink-0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 2: Partner Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                      <User className="h-5 w-5 text-[#3B0A45]" />
                      <h3 className="font-serif text-base font-bold text-[#18181B]">Partner Personality & Appearance</h3>
                    </div>
                    <p className="text-xs text-zinc-600 font-light leading-relaxed">
                      {marriageAnalysis.partnerProfile.personalityTraits}
                    </p>
                  </Card>

                  <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                      <Briefcase className="h-5 w-5 text-[#3B0A45]" />
                      <h3 className="font-serif text-base font-bold text-[#18181B]">Partner Career & Finances</h3>
                    </div>
                    <p className="text-xs text-zinc-600 font-light leading-relaxed">
                      {marriageAnalysis.partnerProfile.careerTendencies}
                    </p>
                  </Card>
                </div>

                {/* Section 3: Relationship Dynamics */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#18181B] flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#3B0A45]" />
                    Relationship Harmony Dimensions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {([
                      { key: 'romantic', label: 'Romantic Connection', icon: <Heart className="h-4 w-4" /> },
                      { key: 'practical', label: 'Practical Grounding', icon: <Building2 className="h-4 w-4" /> },
                      { key: 'emotional', label: 'Emotional Depth', icon: <Compass className="h-4 w-4" /> },
                      { key: 'independent', label: 'Personal Autonomy', icon: <Star className="h-4 w-4" /> },
                    ] as const).map(({ key, label, icon }) => {
                      const dim = marriageAnalysis.relationshipNature[key];
                      return (
                        <IndexMeter
                          key={key}
                          title={label}
                          score={dim.score}
                          description={dim.description}
                          icon={icon}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Jyotish Synthesis (Detailed Reasoning) */}
                <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                      <BookOpen className="h-5 w-5" /> Detailed Jyotish Synthesis
                    </CardTitle>
                    <p className="text-xs text-zinc-500 font-light mt-1">
                      Deep astrological logic showing how specific birth chart indicators shape your marital outcomes.
                    </p>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {([
                        { key: 'seventhHouse', label: '7th House & 7th Lord', summary: marriageAnalysis.astrologicalReasoning.seventhHouse },
                        { key: 'venusJupiter', label: 'Venus & Jupiter Dignities', summary: marriageAnalysis.astrologicalReasoning.venusJupiter },
                        { key: 'darakaraka', label: 'Darakaraka Placement', summary: marriageAnalysis.astrologicalReasoning.darakaraka },
                        { key: 'navamsaD9', label: 'Navamsa (D9) Chart', summary: marriageAnalysis.astrologicalReasoning.navamsaD9 },
                        { key: 'dashaCycles', label: 'Active Dasha Cycles', summary: marriageAnalysis.astrologicalReasoning.dashaCycles },
                      ] as const).map(({ key, label, summary }) => (
                        <div key={key} className="p-4 rounded-xl border border-zinc-100 bg-purple-50/20 space-y-2">
                          <span className="text-[10px] font-bold text-[#3B0A45] uppercase tracking-wider block">{label}</span>
                          <p className="text-[11px] text-zinc-600 font-light leading-relaxed">{summary}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Section 5: Strengths, Challenges & Periods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths & Challenges Card */}
                  <Card className="bg-white border border-[#E4E4E7] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                          Marital Strengths
                        </h4>
                        <ul className="space-y-2 text-xs font-light text-zinc-600">
                          {marriageAnalysis.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#E8C47A] font-bold mt-0.5">•</span>
                              <span className="leading-relaxed">{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-zinc-100">
                        <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                          <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
                          Marital Challenges
                        </h4>
                        <ul className="space-y-2 text-xs font-light text-zinc-600">
                          {marriageAnalysis.challenges.map((chal, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-400 font-bold mt-0.5">•</span>
                              <span className="leading-relaxed">{chal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Favorable & Caution Periods Card */}
                  <Card className="bg-white border border-[#E4E4E7] p-6 rounded-xl shadow-sm space-y-4">
                    <h4 className="font-serif text-base font-bold text-[#3B0A45]">Timing Windows & Cautions</h4>
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100/50">
                        <span className="font-bold text-emerald-800 text-[10px] uppercase tracking-wider block">Favorable for serious relationships</span>
                        <p className="text-zinc-600 font-light mt-0.5 leading-relaxed">{marriageAnalysis.favorablePeriods.seriousRelationships}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100/50">
                        <span className="font-bold text-emerald-800 text-[10px] uppercase tracking-wider block">Favorable for engagement</span>
                        <p className="text-zinc-600 font-light mt-0.5 leading-relaxed">{marriageAnalysis.favorablePeriods.engagement}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100/50">
                        <span className="font-bold text-emerald-800 text-[10px] uppercase tracking-wider block">Favorable for marriage ceremony</span>
                        <p className="text-zinc-600 font-light mt-0.5 leading-relaxed">{marriageAnalysis.favorablePeriods.marriage}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                        <span className="font-bold text-amber-800 text-[10px] uppercase tracking-wider block">Caution & Remedy periods</span>
                        <p className="text-zinc-600 font-light mt-0.5 leading-relaxed">{marriageAnalysis.cautionPeriods}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Practical Advice */}
                <Card className="bg-[#3B0A45]/5 border border-[#3B0A45]/15 text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5.5 w-5.5 text-[#E8C47A]" />
                    <span className="font-serif text-base font-bold text-[#3B0A45]">Practical Marital Wisdom & Guidance</span>
                  </div>
                  <p className="text-xs text-zinc-700 font-light leading-relaxed">
                    {marriageAnalysis.remedialAdvice}
                  </p>
                </Card>
              </>
            ) : (
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-12 text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm">
                <Heart className="h-10 w-10 text-zinc-300 mb-4" />
                <h3 className="font-serif text-base font-bold text-[#18181B] mb-1">Marriage Analysis Not Available</h3>
                <p className="text-xs text-zinc-500 font-light max-w-sm">
                  This report was generated before the Marriage & Relationship Analysis feature was available. Please generate a new report to access the full relationship breakdown.
                </p>
              </div>
            )}
          </TabsContent>

          {/* TAB 4: RELATIONSHIPS */}
          <TabsContent value="love" className="space-y-6 outline-none">
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 space-y-6 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-xl text-[#3B0A45] flex items-center gap-2">
                  <Heart className="h-4.5 w-4.5" /> Love, Marriage & Relationship Tendencies
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-6 text-xs font-light leading-relaxed">
                {/* Harmony score indicator */}
                <IndexMeter 
                  title="Cosmic Harmony & Relationship Compatibility" 
                  score={harmonyScore} 
                  description={loveMarriage.compatibilityInsights}
                  icon={<Heart className="h-4 w-4" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                    <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1.5">Attachment Style & Tendencies</h4>
                    <p className="text-zinc-600 leading-relaxed">{loveMarriage.relationshipTendencies}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                    <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1.5">Marriage Timing Outlook</h4>
                    <p className="text-zinc-600 leading-relaxed">{loveMarriage.marriageTiming}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                    <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1.5">Spouse Profile & Traits</h4>
                    <p className="text-zinc-600 leading-relaxed">{loveMarriage.partnerCharacteristics}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: PLANETS */}
          <TabsContent value="planets" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planetAnalysis.map((p, idx) => (
                <Card key={idx} className="bg-white border border-[#E4E4E7] text-[#18181B] p-5 rounded-xl hover-border-gold flex flex-col justify-between shadow-sm transition-all duration-200">
                  <CardHeader className="px-0 pt-0 pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-base font-bold text-[#3B0A45]">{p.planet}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5 text-zinc-400">
                        {p.sign} &bull; House {p.house}
                      </CardDescription>
                    </div>
                    <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded bg-[#E8C47A]/10 text-[#3B0A45] border border-[#E8C47A]/20 self-start">
                      {p.dignity}
                    </span>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 pt-3 text-xs font-light text-zinc-600 leading-relaxed flex-grow">
                    {p.effects}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 6: DASHAS & YOGAS */}
          <TabsContent value="dashas" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yogas */}
              <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 rounded-xl shadow-sm">
                <CardHeader className="px-0 pt-0 border-b border-zinc-100 pb-3 mb-4">
                  <CardTitle className="font-serif text-base text-[#3B0A45] flex items-center gap-2 font-bold">
                    <Sparkles className="h-4.5 w-4.5 text-[#E8C47A]" /> Active Yogas
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  {yogasDoshas.yogas.map((yoga, i) => (
                    <div key={i} className="space-y-1.5 font-light text-xs border-b border-zinc-100 pb-3.5 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-zinc-800">{yoga.name}</span>
                        <span className="text-[9px] text-zinc-400 italic">Formation: {yoga.description}</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{yoga.effects}</p>
                      {yoga.remedy && (
                        <p className="text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg mt-1.5 font-light">
                          <strong className="font-semibold text-zinc-900">Action:</strong> {yoga.remedy}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Doshas */}
              <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 rounded-xl shadow-sm">
                <CardHeader className="px-0 pt-0 border-b border-zinc-100 pb-3 mb-4">
                  <CardTitle className="font-serif text-base text-[#3B0A45] flex items-center gap-2 font-bold">
                    <ShieldAlert className="h-4.5 w-4.5" /> Active Doshas
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  {yogasDoshas.doshas.map((dosha, i) => (
                    <div key={i} className="space-y-1.5 font-light text-xs border-b border-zinc-100 pb-3.5 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-zinc-800">{dosha.name}</span>
                        <span className="text-[9px] text-zinc-400 italic">{dosha.description}</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{dosha.effects}</p>
                      <p className="text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg mt-1.5 font-light">
                        <strong className="font-semibold text-zinc-900">Remedy:</strong> {dosha.remedy}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Dasha analysis */}
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-lg text-[#3B0A45] flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5" /> Vimshottari Dasha Cycles
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light leading-relaxed">
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1">Current Cycle Influences</h4>
                  <p className="text-zinc-600 mt-1 font-light">{dashaAnalysis.currentInfluences}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7]">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#3B0A45] font-semibold mb-1">Future Cycle Shifts (5-10 years)</h4>
                  <p className="text-zinc-600 mt-1 font-light">{dashaAnalysis.futureInfluences}</p>
                </div>
              </CardContent>
            </Card>

            {/* Practical Remedies Advice */}
            <Card className="bg-white border border-[#E4E4E7] text-[#18181B] p-6 sm:p-8 rounded-xl shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-serif text-lg text-[#3B0A45] flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5" /> Practical Wisdom & Remedial Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4 text-xs font-light text-zinc-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#E8C47A] uppercase tracking-wider">Career Advice</span>
                    <p className="leading-relaxed font-light text-zinc-600">{practicalAdvice.career}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#E8C47A] uppercase tracking-wider">Business Guidance</span>
                    <p className="leading-relaxed font-light text-zinc-600">{practicalAdvice.business}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#E8C47A] uppercase tracking-wider">Financial Stewardship</span>
                    <p className="leading-relaxed font-light text-zinc-600">{practicalAdvice.finance}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#E8C47A] uppercase tracking-wider">Relationships Alignment</span>
                    <p className="leading-relaxed font-light text-zinc-600">{practicalAdvice.relationship}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] space-y-1.5 lg:col-span-2">
                    <span className="text-[10px] font-bold text-[#E8C47A] uppercase tracking-wider">Personal Evolution Advice</span>
                    <p className="leading-relaxed font-light text-zinc-600">{practicalAdvice.personalGrowth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ========================================================================= */}
      {/* PRINT MEDIA DOCUMENT LAYOUT (All sections rendered vertically, print only) */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full text-black space-y-8 p-8 bg-white">
        {/* Document Header */}
        <div className="text-center pb-6 border-b-2 border-[#3B0A45] space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#3B0A45] uppercase tracking-widest">
            SoulMap Vedic Horoscope
          </h1>
          <p className="text-xs text-gray-600 italic">Certified Astrological Blueprint Synthesis</p>
        </div>

        {/* Birth Details Info Box */}
        <div className="grid grid-cols-2 gap-4 border border-gray-300 p-4 bg-gray-50 text-xs">
          <div><strong>Seeker Full Name:</strong> {report.fullName}</div>
          <div><strong>Gender Profile:</strong> {report.gender}</div>
          <div><strong>Date of Birth:</strong> {report.dob}</div>
          <div><strong>Precise Time:</strong> {report.birthTime}</div>
          <div className="col-span-2"><strong>Place of Birth:</strong> {report.birthPlace}</div>
        </div>

        {/* Basic Coordinates */}
        <div className="grid grid-cols-4 gap-2 border border-gray-300 p-3 text-center text-xs bg-gray-100">
          <div><strong>Lagna:</strong> {basicAnalysis.lagna}</div>
          <div><strong>Moon Sign:</strong> {basicAnalysis.moonSign}</div>
          <div><strong>Sun Sign:</strong> {basicAnalysis.sunSign}</div>
          <div><strong>Nakshatra Star:</strong> {basicAnalysis.nakshatra} (Pada {basicAnalysis.pada})</div>
        </div>

        {/* 1. Summary with Scores */}
        <div className="space-y-4 print-card p-4">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            1. Core Astrological Summary & Cosmic Indices
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed font-light">{personality.summary}</p>
          
          <div className="grid grid-cols-3 gap-4 border border-gray-200 p-3 bg-gray-50 text-[10px] mt-2">
            <div>
              <strong>Software Suitability:</strong> {seScore}%
            </div>
            <div>
              <strong>Entrepreneurship Index:</strong> {entScore}%
            </div>
            <div>
              <strong>Harmony Compatibility:</strong> {harmonyScore}%
            </div>
          </div>
        </div>

        {/* 2. Personality */}
        <div className="space-y-4 print-card p-4">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            2. Psychological & Physical Constitution
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <strong className="text-zinc-800 block mb-1">Key Strengths:</strong>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                {personality.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <strong className="text-zinc-800 block mb-1">Key Vulnerabilities:</strong>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                {personality.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-[10px] mt-2 pt-2 border-t border-gray-200">
            <div>
              <strong>Leadership Style:</strong>
              <p className="text-gray-700 mt-1">{personality.leadership}</p>
            </div>
            <div>
              <strong>Communication Style:</strong>
              <p className="text-gray-700 mt-1">{personality.communication}</p>
            </div>
            <div>
              <strong>Emotional Disposition:</strong>
              <p className="text-gray-700 mt-1">{personality.emotionalTendencies}</p>
            </div>
          </div>
        </div>

        {/* 3. Health */}
        <div className="space-y-2 print-card p-4 print-page-break">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            3. Health Alignment & Constitution
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">{health.generalTendencies}</p>
          <div className="mt-2 text-xs">
            <strong>Dietary & Lifestyle Guidelines:</strong>
            <ul className="list-decimal pl-4 mt-1 text-gray-700 space-y-1">
              {health.lifestyleSuggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* 4. Career Analysis — Deep (Print) */}
        {careerAnalysis && (
          <div className="space-y-4 p-4 border border-gray-300">
            <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
              {careerAnalysisIndex}. Career Analysis — Ranked Professions & Potentials
            </h2>

            {/* Top Professions Table */}
            <div>
              <strong className="text-xs">Top 10 Career Paths (Ranked by Suitability):</strong>
              <table className="w-full border-collapse border border-gray-300 mt-2 text-[10px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-1.5 text-center w-8">Rank</th>
                    <th className="border border-gray-300 p-1.5 text-left">Profession</th>
                    <th className="border border-gray-300 p-1.5 text-left">Industry</th>
                    <th className="border border-gray-300 p-1.5 text-center w-14">Score</th>
                    <th className="border border-gray-300 p-1.5 text-left">Astrological Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {careerAnalysis.topProfessions.map((prof) => (
                    <tr key={prof.rank} className="even:bg-gray-50">
                      <td className="border border-gray-300 p-1.5 text-center font-bold">#{prof.rank}</td>
                      <td className="border border-gray-300 p-1.5 font-semibold">{prof.profession}</td>
                      <td className="border border-gray-300 p-1.5 text-gray-600">{prof.industry}</td>
                      <td className="border border-gray-300 p-1.5 text-center font-bold text-[#3B0A45]">{prof.score}</td>
                      <td className="border border-gray-300 p-1.5 text-gray-700 text-[9px]">{prof.reasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Potentials */}
            <div className="pt-2 border-t border-gray-200">
              <strong className="text-xs">Astrological Potential Index:</strong>
              <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                <div className="border border-gray-200 p-2"><strong>Business:</strong> {careerAnalysis.potentials.business.score}% — {careerAnalysis.potentials.business.summary}</div>
                <div className="border border-gray-200 p-2"><strong>Employment:</strong> {careerAnalysis.potentials.employment.score}% — {careerAnalysis.potentials.employment.summary}</div>
                <div className="border border-gray-200 p-2"><strong>Leadership:</strong> {careerAnalysis.potentials.leadership.score}% — {careerAnalysis.potentials.leadership.summary}</div>
                <div className="border border-gray-200 p-2"><strong>Creative:</strong> {careerAnalysis.potentials.creative.score}% — {careerAnalysis.potentials.creative.summary}</div>
                <div className="border border-gray-200 p-2"><strong>Technical:</strong> {careerAnalysis.potentials.technical.score}% — {careerAnalysis.potentials.technical.summary}</div>
                <div className="border border-gray-200 p-2"><strong>Public Influence:</strong> {careerAnalysis.potentials.publicInfluence.score}% — {careerAnalysis.potentials.publicInfluence.summary}</div>
              </div>
            </div>

            {/* Path Recommendations */}
            <div className="pt-2 border-t border-gray-200">
              <strong className="text-xs">Career Path Recommendations:</strong>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                {([
                  { key: 'buildBusiness', label: 'Build a Business' },
                  { key: 'privateJob', label: 'Private / Corporate Job' },
                  { key: 'governmentService', label: 'Government Service' },
                  { key: 'selfEmployed', label: 'Self-Employed' },
                  { key: 'freelancer', label: 'Freelancing' },
                  { key: 'managementRoles', label: 'Management Roles' },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="border border-gray-200 p-2">
                    <strong>{label}:</strong>{" "}
                    <span className="italic text-gray-700">{careerAnalysis.pathRecommendations[key].verdict}</span>
                    {" — "}{careerAnalysis.pathRecommendations[key].explanation}
                  </div>
                ))}
              </div>
            </div>

            {/* Favorable Industries */}
            <div className="pt-2 border-t border-gray-200 text-[10px]">
              <strong className="text-xs">Favorable Industries:</strong>{" "}
              {careerAnalysis.favorableIndustries.join(" • ")}
            </div>

            {/* Career Timeline */}
            <div className="pt-2 border-t border-gray-200 text-[10px] space-y-2">
              <strong className="text-xs">Career Timeline:</strong>
              <div><strong>Growth Phases:</strong> {careerAnalysis.careerTimeline.growthPhases}</div>
              <div><strong>Major Breakthroughs:</strong> {careerAnalysis.careerTimeline.majorBreakthroughs}</div>
              <div><strong>Challenges & Cautions:</strong> {careerAnalysis.careerTimeline.challenges}</div>
            </div>
          </div>
        )}

        {/* 5. Career & Finance */}
        <div className="space-y-4 print-card p-4">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            {careerFinanceIndex}. Career & Wealth Potentials
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <strong>Recommended Fields:</strong> {career.bestFields.join(", ")}
            </div>
            <div>
              <strong>Software Suitability:</strong> {seScore}% &bull; {career.softwareEngineeringSuitability}
            </div>
            <div>
              <strong>Entrepreneurship Index:</strong> {entScore}% &bull; {career.entrepreneurshipPotential}
            </div>
            <div>
              <strong>Job vs Self-Employment:</strong> {career.businessVsJob}
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <strong>Wealth Potential:</strong> {finance.wealthPotential}
              </div>
              <div>
                <strong>Income Patterns:</strong> {finance.incomePatterns}
              </div>
              <div>
                <strong>Investments Suitability:</strong> {finance.investments}
              </div>
              <div>
                <strong>Property Prospects:</strong> {finance.propertyProspects}
              </div>
            </div>
          </div>
        </div>

        {/* Marriage & Relationship Analysis — Deep (Print) */}
        {marriageAnalysis && (
          <div className="space-y-4 p-4 border border-gray-300 print-page-break">
            <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
              {marriageAnalysisIndex}. Marriage & Relationship Analysis
            </h2>

            {/* Timing Probabilities */}
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="border border-gray-200 p-2">
                <strong>Early Marriage Likelihood:</strong> {marriageAnalysis.timingProbabilities.earlyMarriage.probability}
                <p className="text-[9px] text-gray-600 mt-1">{marriageAnalysis.timingProbabilities.earlyMarriage.reasoning}</p>
              </div>
              <div className="border border-gray-200 p-2">
                <strong>Average Marriage Likelihood:</strong> {marriageAnalysis.timingProbabilities.averageMarriage.probability}
                <p className="text-[9px] text-gray-600 mt-1">{marriageAnalysis.timingProbabilities.averageMarriage.reasoning}</p>
              </div>
              <div className="border border-gray-200 p-2">
                <strong>Late Marriage Likelihood:</strong> {marriageAnalysis.timingProbabilities.lateMarriage.probability}
                <p className="text-[9px] text-gray-600 mt-1">{marriageAnalysis.timingProbabilities.lateMarriage.reasoning}</p>
              </div>
            </div>

            {/* Likely Age & Confidence */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div><strong>Most Likely Marriage Age Range:</strong> {marriageAnalysis.likelyAgeRange}</div>
              <div><strong>Confidence Level:</strong> {marriageAnalysis.confidenceLevel}</div>
            </div>

            {/* Partner Profile */}
            <div className="grid grid-cols-2 gap-4 text-[10px] pt-2 border-t border-gray-200">
              <div>
                <strong>Spouse Personality & Traits:</strong>
                <p className="text-gray-700 mt-1 leading-relaxed">{marriageAnalysis.partnerProfile.personalityTraits}</p>
              </div>
              <div>
                <strong>Spouse Career & Finances:</strong>
                <p className="text-gray-700 mt-1 leading-relaxed">{marriageAnalysis.partnerProfile.careerTendencies}</p>
              </div>
            </div>

            {/* Relationship Harmony Dimensions */}
            <div className="pt-2 border-t border-gray-200">
              <strong className="text-xs">Relationship Harmony Dimensions:</strong>
              <div className="grid grid-cols-4 gap-2 mt-1.5 text-[10px]">
                <div className="border border-gray-200 p-1.5"><strong>Romantic:</strong> {marriageAnalysis.relationshipNature.romantic.score}% — {marriageAnalysis.relationshipNature.romantic.description}</div>
                <div className="border border-gray-200 p-1.5"><strong>Practical:</strong> {marriageAnalysis.relationshipNature.practical.score}% — {marriageAnalysis.relationshipNature.practical.description}</div>
                <div className="border border-gray-200 p-1.5"><strong>Emotional:</strong> {marriageAnalysis.relationshipNature.emotional.score}% — {marriageAnalysis.relationshipNature.emotional.description}</div>
                <div className="border border-gray-200 p-1.5"><strong>Independent:</strong> {marriageAnalysis.relationshipNature.independent.score}% — {marriageAnalysis.relationshipNature.independent.description}</div>
              </div>
            </div>

            {/* Jyotish Synthesis */}
            <div className="pt-2 border-t border-gray-200">
              <strong className="text-xs">Vedic Astrological Analysis & Reasoning:</strong>
              <table className="w-full border-collapse border border-gray-300 mt-1.5 text-[10px]">
                <thead>
                  <tr className="bg-gray-100 text-[9px] uppercase">
                    <th className="border border-gray-300 p-1 text-left w-1/4">Factor</th>
                    <th className="border border-gray-300 p-1 text-left">Astrological Placement & Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-1.5 font-bold">7th House & 7th Lord</td>
                    <td className="border border-gray-300 p-1.5 text-gray-700 text-[9px]">{marriageAnalysis.astrologicalReasoning.seventhHouse}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1.5 font-bold">Venus & Jupiter Signifiers</td>
                    <td className="border border-gray-300 p-1.5 text-gray-700 text-[9px]">{marriageAnalysis.astrologicalReasoning.venusJupiter}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1.5 font-bold">Darakaraka Placement</td>
                    <td className="border border-gray-300 p-1.5 text-gray-700 text-[9px]">{marriageAnalysis.astrologicalReasoning.darakaraka}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1.5 font-bold">Navamsa (D9) Chart</td>
                    <td className="border border-gray-300 p-1.5 text-gray-700 text-[9px]">{marriageAnalysis.astrologicalReasoning.navamsaD9}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1.5 font-bold">Mahadasha / Antardasha Cycles</td>
                    <td className="border border-gray-300 p-1.5 text-gray-700 text-[9px]">{marriageAnalysis.astrologicalReasoning.dashaCycles}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Strengths & Challenges */}
            <div className="grid grid-cols-2 gap-4 text-[10px] pt-2 border-t border-gray-200">
              <div>
                <strong>Key Marital Strengths:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-700">
                  {marriageAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <strong>Key Marital Challenges:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-700">
                  {marriageAnalysis.challenges.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>

            {/* Timing Windows */}
            <div className="pt-2 border-t border-gray-200 text-[9px] grid grid-cols-4 gap-2">
              <div><strong>Relationship Windows:</strong> <p className="text-gray-700 mt-0.5">{marriageAnalysis.favorablePeriods.seriousRelationships}</p></div>
              <div><strong>Engagement Windows:</strong> <p className="text-gray-700 mt-0.5">{marriageAnalysis.favorablePeriods.engagement}</p></div>
              <div><strong>Marriage Ceremony Windows:</strong> <p className="text-gray-700 mt-0.5">{marriageAnalysis.favorablePeriods.marriage}</p></div>
              <div><strong>Cautionary Windows:</strong> <p className="text-gray-700 mt-0.5">{marriageAnalysis.cautionPeriods}</p></div>
            </div>

            {/* Remedial Advice */}
            <div className="pt-2 border-t border-gray-200 text-[10px]">
              <strong>Astrological & Practical Advice:</strong>
              <p className="text-gray-700 mt-1 leading-relaxed font-light">{marriageAnalysis.remedialAdvice}</p>
            </div>
          </div>
        )}

        {/* 5. Relationships */}
        <div className="space-y-2 print-card p-4 print-page-break">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            {loveMarriageIndex}. Love, Marriage & Relationship Tendencies
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2 border-b border-gray-100 pb-2">
              <strong>Harmony Compatibility Score:</strong> {harmonyScore}% &bull; {loveMarriage.compatibilityInsights}
            </div>
            <div>
              <strong>Tendencies & Attachments:</strong> {loveMarriage.relationshipTendencies}
            </div>
            <div>
              <strong>Marriage Timing Outlook:</strong> {loveMarriage.marriageTiming}
            </div>
            <div className="col-span-2">
              <strong>Spouse Predicted Profile:</strong> {loveMarriage.partnerCharacteristics}
            </div>
          </div>
        </div>

        {/* 6. Planetary Positions */}
        <div className="space-y-2 print-card p-4">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            {planetsIndex}. Detailed Planetary Alignment Positions
          </h2>
          <table className="w-full border-collapse border border-gray-300 mt-2 text-[10px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Planet</th>
                <th className="border border-gray-300 p-2 text-center">House</th>
                <th className="border border-gray-300 p-2 text-left">Zodiac Sign</th>
                <th className="border border-gray-300 p-2 text-left">Dignity / Placement State</th>
                <th className="border border-gray-300 p-2 text-left">Astrological Influence</th>
              </tr>
            </thead>
            <tbody>
              {planetAnalysis.map((p, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold">{p.planet}</td>
                  <td className="border border-gray-300 p-2 text-center">{p.house}</td>
                  <td className="border border-gray-300 p-2">{p.sign}</td>
                  <td className="border border-gray-300 p-2">{p.dignity}</td>
                  <td className="border border-gray-300 p-2 text-gray-700">{p.effects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 7. Dashas & Yogas */}
        <div className="space-y-4 print-card p-4 print-page-break">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            {dashasIndex}. Active Yogas, Doshas & Dashas
          </h2>
          
          <div className="text-xs">
            <strong>Vimshottari Dasha cycles:</strong>
            <p className="text-gray-700 mt-1">Current period: {dashaAnalysis.currentInfluences}</p>
            <p className="text-gray-700 mt-1">Upcoming period: {dashaAnalysis.futureInfluences}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-200">
            <div>
              <strong className="text-[#3B0A45] block mb-1">Active Yogas:</strong>
              {yogasDoshas.yogas.map((y, i) => (
                <div key={i} className="mb-2">
                  <strong className="text-[11px]">{y.name}</strong> - <span className="text-gray-500 italic">{y.description}</span>
                  <p className="text-gray-700 mt-0.5">{y.effects}</p>
                </div>
              ))}
            </div>
            <div>
              <strong className="text-[#3B0A45] block mb-1">Active Doshas & Remedies:</strong>
              {yogasDoshas.doshas.map((d, i) => (
                <div key={i} className="mb-2">
                  <strong className="text-[11px]">{d.name}</strong> - <span className="text-gray-500 italic">{d.description}</span>
                  <p className="text-gray-700 mt-0.5">{d.effects}</p>
                  <p className="text-gray-600 bg-gray-100 p-1.5 rounded text-[10px] mt-1">Remedy: {d.remedy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Practical Advice */}
        <div className="space-y-4 print-card p-4">
          <h2 className="font-serif text-base font-bold text-[#3B0A45] border-b border-gray-300 pb-1 uppercase">
            {practicalAdviceIndex}. Remedial Guidance & Practical Wisdom
          </h2>
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="border border-gray-200 p-2">
              <strong>Career Guidance:</strong>
              <p className="text-gray-700 mt-0.5">{practicalAdvice.career}</p>
            </div>
            <div className="border border-gray-200 p-2">
              <strong>Business Guidance:</strong>
              <p className="text-gray-700 mt-0.5">{practicalAdvice.business}</p>
            </div>
            <div className="border border-gray-200 p-2">
              <strong>Financial Guidance:</strong>
              <p className="text-gray-700 mt-0.5">{practicalAdvice.finance}</p>
            </div>
            <div className="border border-gray-200 p-2">
              <strong>Relationship Advice:</strong>
              <p className="text-gray-700 mt-0.5">{practicalAdvice.relationship}</p>
            </div>
            <div className="border border-gray-200 p-2 col-span-2">
              <strong>Personal Evolution Advice:</strong>
              <p className="text-gray-700 mt-0.5">{practicalAdvice.personalGrowth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
