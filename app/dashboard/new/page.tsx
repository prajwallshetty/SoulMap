"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Compass, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LOADING_STEPS = [
  "Mapping planetary coordinates at your time of birth...",
  "Calibrating your rising sign (Lagna) and Moon Nakshatra...",
  "Running Vedic calculations for the 9 planetary houses...",
  "Assembling Vimshottari Mahadasha and Antardasha cycles...",
  "Evaluating active Yogas (auspicious alignments) and Doshas...",
  "Synthesizing personal, career, and financial predictions...",
  "Synthesizing your final celestial horoscope blueprint..."
];

export default function NewReportPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Form State
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [birthHour, setBirthHour] = useState("12");
  const [birthMinute, setBirthMinute] = useState("00");
  const [birthPeriod, setBirthPeriod] = useState("PM");
  const [birthPlace, setBirthPlace] = useState("");

  // UI State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState("");

  // Authenticate user
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Rotate loading steps every 2.5 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleNextStep1 = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!gender) return setError("Please select your gender.");
    setStep(2);
  };

  const handleNextStep2 = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    if (!dob) return setError("Please enter your date of birth.");
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final Validation
    if (!fullName.trim() || !gender || !dob || !birthPlace.trim()) {
      return setError("Please complete all steps before generating the report.");
    }

    // Combine time parameters into 24h format
    let hour24 = parseInt(birthHour);
    if (birthPeriod === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (birthPeriod === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    const combinedTime = `${hour24.toString().padStart(2, "0")}:${birthMinute}`;

    setLoading(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          gender,
          dob,
          birthTime: combinedTime,
          birthPlace,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate report");
      }

      router.push(`/reports/${data.reportId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during report generation. Please try again.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-grow items-center justify-center min-h-[50vh] bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 text-[#3B0A45] animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // redirecting in useEffect
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 w-full flex-grow flex flex-col gap-4 justify-center bg-[#FAFAFA]">
      {/* Back to Dashboard */}
      {!loading && (
        <div className="mb-2">
          <Button
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                router.push("/dashboard");
              }
            }}
            variant="ghost"
            className="text-zinc-500 hover:text-[#18181B] hover:bg-zinc-100 h-9 text-xs px-3"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            {step > 1 ? "Back" : "Dashboard"}
          </Button>
        </div>
      )}

      {loading ? (
        /* Astrological Minimal Loader */
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[380px] shadow-sm relative overflow-hidden">
          {/* Animated Spinner Core */}
          <div className="relative mb-8 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-[#3B0A45] animate-spin" />
          </div>

          <h3 className="font-serif text-lg font-bold text-[#18181B] tracking-tight mb-2">
            Computing Celestial Alignments
          </h3>
          
          <div className="max-w-md h-12 flex items-center justify-center">
            <p className="text-xs text-zinc-500 font-light italic leading-relaxed animate-fade-in transition-all">
              {LOADING_STEPS[loadingStepIndex]}
            </p>
          </div>

          <p className="text-[10px] text-zinc-400 mt-12 font-light">
            Please keep this tab open. Process takes about 10-15 seconds.
          </p>
        </div>
      ) : (
        /* Birth Details Input Form Card */
        <Card className="bg-white border border-[#E4E4E7] text-[#18181B] shadow-sm rounded-xl">
          <CardHeader className="border-b border-zinc-100 pb-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= 1 ? 'bg-[#3B0A45] text-white shadow-sm' : 'bg-zinc-100 border border-zinc-200 text-zinc-500'}`}>1</div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${step === 1 ? 'text-[#3B0A45]' : 'text-zinc-400'}`}>Profile</span>
              </div>
              <div className="flex-grow h-[1px] bg-zinc-200 mx-2" />
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= 2 ? 'bg-[#3B0A45] text-white shadow-sm' : 'bg-zinc-100 border border-zinc-200 text-zinc-500'}`}>2</div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${step === 2 ? 'text-[#3B0A45]' : 'text-zinc-400'}`}>Time</span>
              </div>
              <div className="flex-grow h-[1px] bg-zinc-200 mx-2" />
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= 3 ? 'bg-[#3B0A45] text-white shadow-sm' : 'bg-zinc-100 border border-zinc-200 text-zinc-500'}`}>3</div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${step === 3 ? 'text-[#3B0A45]' : 'text-zinc-400'}`}>Map</span>
              </div>
            </div>

            <CardTitle className="font-serif text-xl font-bold text-[#18181B]">
              {step === 1 && "Personal Profile"}
              {step === 2 && "Time of Birth"}
              {step === 3 && "Location & Confirm"}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 font-light">
              {step === 1 && "Enter your basic identity details to get started."}
              {step === 2 && "Vedic coordinates rely heavily on precise time calculations."}
              {step === 3 && "Provide your birth location and review details before generating."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-lg text-xs font-light">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: Name and Gender */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white border-[#E4E4E7] text-[#18181B] placeholder-zinc-400 focus-visible:ring-[#3B0A45] h-10 rounded-lg text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Gender
                    </Label>
                    <Select onValueChange={(val) => setGender(val || "")} value={gender} required>
                      <SelectTrigger className="bg-white border-[#E4E4E7] text-[#18181B] focus:ring-[#3B0A45] h-10 rounded-lg text-sm">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E4E4E7] text-[#18181B]">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleNextStep1}
                    className="w-full bg-[#3B0A45] text-white font-medium hover:bg-[#3B0A45]/90 h-10 transition-all mt-6 shadow-sm rounded-lg"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* STEP 2: Date and Time of Birth */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label htmlFor="dob" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="bg-white border-[#E4E4E7] text-[#18181B] placeholder-zinc-400 focus-visible:ring-[#3B0A45] h-10 rounded-lg text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      Time of Birth
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Hour Select */}
                      <Select onValueChange={(val) => setBirthHour(val || "12")} value={birthHour}>
                        <SelectTrigger className="bg-white border-[#E4E4E7] text-[#18181B] focus:ring-[#3B0A45] h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Hr" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E4E4E7] text-[#18181B] max-h-[200px]">
                          {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((hr) => (
                            <SelectItem key={hr} value={hr}>
                              {hr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Minute Select */}
                      <Select onValueChange={(val) => setBirthMinute(val || "00")} value={birthMinute}>
                        <SelectTrigger className="bg-white border-[#E4E4E7] text-[#18181B] focus:ring-[#3B0A45] h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E4E4E7] text-[#18181B] max-h-[200px]">
                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((min) => (
                            <SelectItem key={min} value={min}>
                              {min}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Period Select */}
                      <Select onValueChange={(val) => setBirthPeriod(val || "PM")} value={birthPeriod}>
                        <SelectTrigger className="bg-white border-[#E4E4E7] text-[#18181B] focus:ring-[#3B0A45] h-10 rounded-lg text-sm">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E4E4E7] text-[#18181B]">
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={(e) => { e.preventDefault(); setStep(1); }}
                      variant="outline"
                      className="w-1/3 border-[#E4E4E7] text-zinc-700 hover:bg-zinc-50 h-10 rounded-lg shadow-sm"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep2}
                      className="w-2/3 bg-[#3B0A45] text-white font-medium hover:bg-[#3B0A45]/90 h-10 transition-all rounded-lg shadow-sm"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Location and Confirmation Summary */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label htmlFor="birthPlace" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                      Place of Birth
                    </Label>
                    <Input
                      id="birthPlace"
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra, India"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      className="bg-white border-[#E4E4E7] text-[#18181B] placeholder-zinc-400 focus-visible:ring-[#3B0A45] h-10 rounded-lg text-sm"
                      required
                    />
                    <span className="text-[10px] text-[#71717A] font-light block mt-1">
                      Specify city and country coordinates as closely as possible for alignment calculation.
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-lg bg-zinc-50 border border-[#E4E4E7] space-y-2 text-xs text-zinc-600 font-light">
                    <div className="text-[10px] uppercase font-bold text-[#3B0A45] mb-1.5 tracking-wider">Review Coordinates</div>
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span className="text-zinc-500">Full Name</span>
                      <span className="font-semibold text-[#18181B]">{fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span className="text-zinc-500">Gender</span>
                      <span className="font-semibold text-[#18181B]">{gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span className="text-zinc-500">Date of Birth</span>
                      <span className="font-semibold text-[#18181B]">{dob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Time of Birth</span>
                      <span className="font-semibold text-[#18181B]">{birthHour}:{birthMinute} {birthPeriod}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={(e) => { e.preventDefault(); setStep(2); }}
                      variant="outline"
                      className="w-1/3 border-[#E4E4E7] text-zinc-700 hover:bg-zinc-50 h-10 rounded-lg shadow-sm"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-2/3 bg-[#3B0A45] text-white font-medium hover:bg-[#3B0A45]/90 h-10 transition-all rounded-lg shadow-sm"
                    >
                      Generate Report
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
