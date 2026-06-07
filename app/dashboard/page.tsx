"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Eye, Trash2, PlusCircle, User as UserIcon, Loader2, FileText, Compass, Settings, BookOpen, Layout, History, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface ReportMeta {
  _id: string;
  fullName: string;
  gender: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Authenticate user
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch report list
  useEffect(() => {
    if (status === "authenticated") {
      const fetchReports = async () => {
        try {
          const res = await fetch("/api/reports");
          if (!res.ok) throw new Error("Failed to load reports");
          const data = await res.json();
          setReports(data.reports || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load your report history.");
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this astrology report? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete report");

      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center items-center min-h-[50vh] bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 text-[#3B0A45] animate-spin mb-4" />
        <p className="text-sm text-zinc-500">Loading your workspace...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // redirecting in useEffect
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8 bg-[#FAFAFA] text-[#18181B]">
      {/* 1. Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E4E4E7] pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#18181B]">
            Workspace / <span className="text-[#3B0A45]">{session?.user?.name || "Seeker"}</span>
          </h1>
          <p className="text-xs text-[#71717A] mt-1 font-light">
            Manage your soulMap configurations and review past reports.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/new">
            <Button className="bg-[#3B0A45] hover:bg-[#3B0A45]/90 text-white font-medium rounded-lg h-9 text-xs px-4 shadow-sm transition-all flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Welcome Card / Banner */}
      <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-base font-bold text-[#18181B]">Begin Your Astrological Alignment</h3>
          <p className="text-xs text-[#71717A] font-light leading-relaxed max-w-xl">
            Input birth coordinates and times to compute birth chart geometries, Dasha periods, and transit insights.
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button variant="outline" className="border-[#E4E4E7] text-zinc-700 hover:bg-zinc-50 h-9 text-xs px-4 rounded-lg shadow-sm">
            Generate Kundli
          </Button>
        </Link>
      </div>

      {/* 3. Grid Layout (Desktop Sidebar Nav + Main Dashboard Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2 hidden lg:block">
          <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-3 mb-2">Navigation</div>
          
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-[#E4E4E7] text-[#3B0A45] shadow-sm">
            <Layout className="h-4 w-4 text-[#3B0A45]" />
            <span>Dashboard</span>
          </Link>

          <Link href="/dashboard/new" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Compass className="h-4 w-4 text-zinc-400" />
            <span>New Kundli</span>
          </Link>

          <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-3 pt-6 pb-2">Profile & Help</div>

          <div className="flex flex-col gap-1 p-3 bg-white border border-[#E4E4E7] rounded-xl text-xs space-y-2.5">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase">Account</span>
              <div className="font-semibold truncate text-[#18181B] mt-0.5">{session?.user?.email}</div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase">Subscription</span>
              <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-zinc-50 px-2 py-0.5 font-medium text-[10px] text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8C47A]" />
                Standard Seeker
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Recent Reports Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#18181B] flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-zinc-400" />
                Recent Reports
              </h2>
              <span className="text-[10px] border border-[#E4E4E7] bg-white text-zinc-500 px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                {reports.length} {reports.length === 1 ? "Report" : "Reports"}
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-xs">
                {error}
              </div>
            )}

            {reports.length === 0 ? (
              /* Empty State */
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-12 text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-zinc-50 border border-[#E4E4E7] flex items-center justify-center text-zinc-400 mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#18181B] mb-1">No Reports Found</h3>
                <p className="text-xs text-zinc-500 max-w-sm font-light mb-6 leading-relaxed">
                  Provide birth parameters to compile your first complete Vedic astrology report.
                </p>
                <Link href="/dashboard/new">
                  <Button className="bg-[#3B0A45] hover:bg-[#3B0A45]/90 text-white font-medium rounded-lg h-9 text-xs px-4 shadow-sm">
                    <PlusCircle className="mr-1.5 h-4 w-4" />
                    Generate First Report
                  </Button>
                </Link>
              </div>
            ) : (
              /* Reports Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <Card key={report._id} className="bg-white border border-[#E4E4E7] hover:border-[#3B0A45] transition-all duration-200 shadow-sm flex flex-col justify-between rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-serif text-base text-[#18181B] font-bold">{report.fullName}</CardTitle>
                      <CardDescription className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Generated: {new Date(report.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 space-y-2 text-xs text-zinc-600 font-light border-t border-zinc-50 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>Born: {report.dob}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>Time: {report.birthTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">Place: {report.birthPlace}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[#E4E4E7] pt-3 pb-3 flex gap-2 justify-end bg-zinc-50/50 rounded-b-xl">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-red-600 hover:bg-red-50 h-8 text-xs rounded-lg"
                        disabled={deletingId === report._id}
                        onClick={() => handleDelete(report._id)}
                      >
                        {deletingId === report._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                        ) : (
                          <>
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Delete
                          </>
                        )}
                      </Button>
                      <Link href={`/reports/${report._id}`}>
                        <Button
                          size="sm"
                          className="bg-white border border-[#E4E4E7] hover:bg-zinc-50 text-zinc-700 h-8 text-xs rounded-lg shadow-sm"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5 text-[#3B0A45]" />
                          View Report
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 4. Insights Section (Premium transit note with Gold accent marker) */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#18181B] flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-zinc-400" />
              Daily Transit Insight
            </h2>
            <div className="rounded-xl border-l-4 border-l-[#E8C47A] border border-[#E4E4E7] bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#18181B]">Guru Transit (Jupiter)</span>
                <span className="text-[10px] bg-[#E8C47A]/10 text-[#3B0A45] px-2 py-0.5 rounded font-medium border border-[#E8C47A]/20">Auspicious</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Jupiter currently influences your 9th house (Bhagyabhava), indicating a positive phase for learning, wisdom, and planning long-term investments. Traditional Jyotish recommends beginning academic study or engaging in charity on Thursdays to maximize this alignment.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
