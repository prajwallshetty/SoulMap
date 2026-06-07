import React from "react";
import Link from "next/link";
import { Moon, Compass, Award, ChevronRight, Layout, Sparkles, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-between w-full bg-[#FAFAFA] text-[#18181B] overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="w-full max-w-7xl px-5 pt-16 pb-12 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-1 text-xs font-medium text-[#71717A] mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8C47A]" />
            <span>Premium Vedic Astrological Synthesis</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[28px] font-bold tracking-tight text-[#18181B] sm:text-5xl lg:text-6xl leading-[1.15]">
            Unlock Your Cosmic Destiny with <span className="text-[#3B0A45]">soulMap</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base text-[#71717A] leading-relaxed max-w-xl font-light">
            Embark on a journey of self-discovery. Combine ancient Vedic wisdom with a sophisticated planetary calculations engine to generate highly precise, professional, and detailed birth chart reports.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/dashboard/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-6 py-5 text-sm font-semibold bg-[#3B0A45] hover:bg-[#3B0A45]/90 text-white rounded-lg shadow-sm transition-all">
                Generate Your Free Kundli
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 py-5 text-sm border-[#E4E4E7] text-[#18181B] bg-white hover:bg-zinc-50 rounded-lg shadow-sm transition-all">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Illustration: Clean CSS-based Stripe/Linear style Dashboard Mockup */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center items-center">
          <div className="w-full max-w-lg rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-md text-left text-xs text-[#71717A] relative">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <div className="h-2 w-2 rounded-full bg-yellow-400" />
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 font-mono text-[10px] text-zinc-400">soulmap.app/native_report</span>
              </div>
              <span className="text-[10px] bg-[#E8C47A]/10 text-[#3B0A45] font-semibold px-2 py-0.5 rounded border border-[#E8C47A]/20">Active Cycles</span>
            </div>

            {/* Grid Layout Mock */}
            <div className="grid grid-cols-3 gap-3">
              {/* Left Mock Sidebar */}
              <div className="col-span-1 border-r border-[#E4E4E7] pr-3 space-y-3 hidden sm:block">
                <div className="font-semibold text-[#18181B] mb-2">Workspace</div>
                <div className="flex items-center gap-1.5 text-[#18181B] font-medium bg-zinc-50 p-1.5 rounded">
                  <Layout className="h-3 w-3 text-[#3B0A45]" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded hover:bg-zinc-50 transition-colors">
                  <FileText className="h-3 w-3" />
                  <span>Kundli Report</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded hover:bg-zinc-50 transition-colors">
                  <Compass className="h-3 w-3" />
                  <span>House Map</span>
                </div>
              </div>

              {/* Main Content Area Mock */}
              <div className="col-span-3 sm:col-span-2 space-y-4">
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#18181B]">Native: Siddharth K.</h4>
                  <p className="text-[10px] text-zinc-400">Born: 1992-05-14 • New Delhi, IN</p>
                </div>

                {/* Score panel */}
                <div className="border border-[#E4E4E7] rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-[#18181B]">Cosmic Index Strength</span>
                    <span className="text-[#3B0A45] font-mono font-bold">84%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3B0A45] rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>

                {/* Grid items */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border border-[#E4E4E7] rounded-lg bg-zinc-50/50">
                    <div className="text-[10px] uppercase text-zinc-400">Lagna (Rising)</div>
                    <div className="font-serif font-bold text-[#18181B] text-xs">Aries (Mesha)</div>
                  </div>
                  <div className="p-2 border border-[#E4E4E7] rounded-lg bg-zinc-50/50">
                    <div className="text-[10px] uppercase text-zinc-400">Moon Sign</div>
                    <div className="font-serif font-bold text-[#18181B] text-xs">Leo (Simha)</div>
                  </div>
                </div>

                {/* Planet bar chart */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-[#18181B]">Graha Balas (Planetary Strengths)</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-10 text-[9px]">Jupiter</span>
                      <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#E8C47A] rounded-full" style={{ width: "91%" }} />
                      </div>
                      <span className="text-[9px] font-mono">91</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10 text-[9px]">Sun</span>
                      <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3B0A45] rounded-full" style={{ width: "80%" }} />
                      </div>
                      <span className="text-[9px] font-mono">80</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full border-t border-[#E4E4E7] bg-white no-print">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E4E4E7]">
          <div className="pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#3B0A45]">9 Planets</div>
            <div className="text-[11px] text-[#71717A] mt-1 uppercase tracking-wider font-medium">Analyzed in Depth</div>
          </div>
          <div className="pt-5 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#E8C47A]">27 Nakshatras</div>
            <div className="text-[11px] text-[#71717A] mt-1 uppercase tracking-wider font-medium">Detailed Star Analysis</div>
          </div>
          <div className="pt-5 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#3B0A45]">Dasha Periods</div>
            <div className="text-[11px] text-[#71717A] mt-1 uppercase tracking-wider font-medium">Timeline Predictions</div>
          </div>
          <div className="pt-5 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#E8C47A]">100% Free</div>
            <div className="text-[11px] text-[#71717A] mt-1 uppercase tracking-wider font-medium">No Credit Card Needed</div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="w-full bg-[#FFFFFF] py-24 border-y border-[#E4E4E7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl">
              Deep Astrological Synthesis
            </h2>
            <p className="mt-4 text-base text-[#71717A] font-light leading-relaxed">
              Unlike generic horoscopes, soulMap performs a complex synthesis of Vedic metrics using advanced parameters.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-8 hover-border-gold transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-[#3B0A45]/5 flex items-center justify-center text-[#3B0A45] mb-6 border border-[#3B0A45]/10">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#18181B] font-serif">Lagna & Planetary Alignments</h3>
                <p className="mt-3 text-sm text-[#71717A] leading-relaxed font-light">
                  Analyze your rising sign (Lagna), Sun sign, Moon sign, and Nakshatra placements to define your foundational energy blueprint.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-8 hover-border-gold transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-[#E8C47A]/10 flex items-center justify-center text-[#3B0A45] mb-6 border border-[#E8C47A]/20">
                  <Moon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#18181B] font-serif">Dasha Period Timelines</h3>
                <p className="mt-3 text-sm text-[#71717A] leading-relaxed font-light">
                  Calculate the planetary dasha periods (Vimshottari Dasha) to outline current and future lifecycle influences, helping you plan career and relationship choices.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-8 hover-border-gold transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-[#3B0A45]/5 flex items-center justify-center text-[#3B0A45] mb-6 border border-[#3B0A45]/10">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#18181B] font-serif">Yogas, Doshas & Remedies</h3>
                <p className="mt-3 text-sm text-[#71717A] leading-relaxed font-light">
                  Detect the presence of major cosmic combinations (Yogas) and blockages (Doshas). Receive practical remedies like mantra meditation and daily habits to guide you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="w-full py-24 max-w-7xl px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl">
            How to Reveal Your Blueprint
          </h2>
          <p className="mt-4 text-base text-[#71717A] font-light">
            Three simple steps to unlock a highly personalized astrological document.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-[#E4E4E7] z-0" />
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="h-14 w-14 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center font-serif text-lg font-bold text-[#3B0A45] shadow-sm">
              1
            </div>
            <h3 className="mt-6 text-lg font-semibold text-[#18181B] font-serif">Submit Birth Information</h3>
            <p className="mt-2 text-sm text-[#71717A] font-light max-w-xs leading-relaxed">
              Provide your name, birthdate, precise birth time, and coordinates (place of birth).
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="h-14 w-14 rounded-full bg-white border border-[#E8C47A] flex items-center justify-center font-serif text-lg font-bold text-[#3B0A45] shadow-sm">
              2
            </div>
            <h3 className="mt-6 text-lg font-semibold text-[#18181B] font-serif">Celestial Blueprint Synthesis</h3>
            <p className="mt-2 text-sm text-[#71717A] font-light max-w-xs leading-relaxed">
              Our engine processes birth details, calculates planetary alignments, and synthesizes a comprehensive personal horoscope.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="h-14 w-14 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center font-serif text-lg font-bold text-[#3B0A45] shadow-sm">
              3
            </div>
            <h3 className="mt-6 text-lg font-semibold text-[#18181B] font-serif">Review & Export Report</h3>
            <p className="mt-2 text-sm text-[#71717A] font-light max-w-xs leading-relaxed">
              Explore your detailed career, finance, love, and health sections. Save or export them instantly as a PDF.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="w-full bg-white py-24 border-t border-[#E4E4E7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl">
              Seekers Stories
            </h2>
            <p className="mt-4 text-base text-[#71717A] font-light">
              See how soulMap has brought clarity, purpose, and direction to people worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-8 flex flex-col justify-between shadow-sm">
              <p className="text-[#18181B] font-light text-sm italic leading-relaxed">
                &ldquo;I was skeptical of digital astrology reports initially, but the career timing section was eerily precise. It predicted a major shift in early 2026, which aligned exactly with my new tech leadership role.&rdquo;
              </p>
              <div className="mt-8 border-t border-[#E4E4E7] pt-4 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#3B0A45]/5 border border-[#3B0A45]/10 flex items-center justify-center font-bold text-xs text-[#3B0A45]">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B]">Siddharth K.</h4>
                  <p className="text-[10px] text-[#71717A]">Software Architect</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-8 flex flex-col justify-between shadow-sm">
              <p className="text-[#18181B] font-light text-sm italic leading-relaxed">
                &ldquo;The personality analysis outlined my communication style and emotional tendencies with 100% accuracy. It helped me recognize the roots of my anxiety and adjust my daily lifestyle.&rdquo;
              </p>
              <div className="mt-8 border-t border-[#E4E4E7] pt-4 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#E8C47A]/10 border border-[#E8C47A]/30 flex items-center justify-center font-bold text-xs text-[#3B0A45]">
                  AM
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B]">Ananya M.</h4>
                  <p className="text-[10px] text-[#71717A]">Creative Designer</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-8 flex flex-col justify-between shadow-sm">
              <p className="text-[#18181B] font-light text-sm italic leading-relaxed">
                &ldquo;This tool is a masterpiece! The PDF layout is clean and professional. I printed out the PDF reports for my whole family, and we spent hours discussing the planet analyses.&rdquo;
              </p>
              <div className="mt-8 border-t border-[#E4E4E7] pt-4 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#3B0A45]/5 border border-[#3B0A45]/10 flex items-center justify-center font-bold text-xs text-[#3B0A45]">
                  JH
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B]">Julius H.</h4>
                  <p className="text-[10px] text-[#71717A]">Business Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="w-full py-16 sm:py-24 max-w-4xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-[#71717A] font-light">
            Answers to your queries about our Celestial Synthesis Engine.
          </p>
        </div>

        <div className="space-y-4">
          <details className="group border border-[#E4E4E7] rounded-xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#18181B]">
              <h3 className="font-medium text-base font-serif">Is this report based on Vedic or Western Astrology?</h3>
              <span className="shrink-0 rounded-full bg-zinc-50 p-1.5 text-zinc-400 group-open:rotate-180 transition-transform border border-[#E4E4E7]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-sm text-[#71717A] font-light border-t border-zinc-100 pt-4">
              This system is built specifically around the Vedic (Sidereal) system of astrology, also known as Jyotish. It analyzes factors like the Lagna (rising sign), Moon Rashi, Nakshatras, and planetary Dasha cycles rather than relying on solar charts.
            </p>
          </details>

          <details className="group border border-[#E4E4E7] rounded-xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#18181B]">
              <h3 className="font-medium text-base font-serif">How accurate are the planetary calculation estimations?</h3>
              <span className="shrink-0 rounded-full bg-zinc-50 p-1.5 text-zinc-400 group-open:rotate-180 transition-transform border border-[#E4E4E7]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-sm text-[#71717A] font-light border-t border-zinc-100 pt-4">
              soulMap leverages a state-of-the-art cosmic calculations engine to estimate planetary positions based on standard coordinates and date/time inputs. The engine is modular, meaning we plan to integrate Swiss Ephemeris mathematical APIs in future updates for exact-degree planetary charting.
            </p>
          </details>

          <details className="group border border-[#E4E4E7] rounded-xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#18181B]">
              <h3 className="font-medium text-base font-serif">Is my birth data private?</h3>
              <span className="shrink-0 rounded-full bg-zinc-50 p-1.5 text-zinc-400 group-open:rotate-180 transition-transform border border-[#E4E4E7]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-sm text-[#71717A] font-light border-t border-zinc-100 pt-4">
              Absolutely. We value your privacy. Your birth details and reports are linked to your secure user account on MongoDB, and we never share your demographic or birth details with third-party advertisers.
            </p>
          </details>

          <details className="group border border-[#E4E4E7] rounded-xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#18181B]">
              <h3 className="font-medium text-base font-serif">Can I download and print my report?</h3>
              <span className="shrink-0 rounded-full bg-zinc-50 p-1.5 text-zinc-400 group-open:rotate-180 transition-transform border border-[#E4E4E7]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-sm text-[#71717A] font-light border-t border-zinc-100 pt-4">
              Yes. Every report includes a PDF Download button. This applies high-quality print stylesheets to remove background menus and export a beautifully formatted physical or digital astrology document.
            </p>
          </details>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-zinc-50 border-t border-[#E4E4E7] py-16 sm:py-24 px-5 sm:px-6 text-center flex flex-col items-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] max-w-xl">
          Are You Ready to Hear the Stars?
        </h2>
        <p className="mt-4 text-base text-[#71717A] max-w-md font-light">
          Unlock your planetary map, understand your obstacles, and find your true career path today.
        </p>
        <Link href="/dashboard/new" className="mt-8">
          <Button size="lg" className="px-8 bg-[#3B0A45] hover:bg-[#3B0A45]/90 text-white font-medium shadow-sm transition-all h-12 rounded-lg">
            Generate Astrology Report
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
