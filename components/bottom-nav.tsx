"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Compass, FileText, User, LogIn } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden no-print">
      {/* Safe area + glass bar */}
      <div className="bg-white/90 backdrop-blur-md border-t border-zinc-200/80 shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-end justify-around px-2 h-[68px] pb-[env(safe-area-inset-bottom,6px)]">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-end gap-0.5 pt-2 pb-1 min-w-[56px] group"
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive("/") ? "bg-[#3B0A45]/8" : ""}`}>
              <Home className={`h-[20px] w-[20px] transition-colors ${isActive("/") ? "text-[#3B0A45]" : "text-zinc-400 group-active:text-zinc-600"}`} strokeWidth={isActive("/") ? 2.2 : 1.8} />
            </div>
            <span className={`text-[10px] leading-tight font-medium transition-colors ${isActive("/") ? "text-[#3B0A45]" : "text-zinc-400"}`}>Home</span>
          </Link>

          {/* Reports */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-end gap-0.5 pt-2 pb-1 min-w-[56px] group"
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive("/dashboard") ? "bg-[#3B0A45]/8" : ""}`}>
              <FileText className={`h-[20px] w-[20px] transition-colors ${isActive("/dashboard") ? "text-[#3B0A45]" : "text-zinc-400 group-active:text-zinc-600"}`} strokeWidth={isActive("/dashboard") ? 2.2 : 1.8} />
            </div>
            <span className={`text-[10px] leading-tight font-medium transition-colors ${isActive("/dashboard") ? "text-[#3B0A45]" : "text-zinc-400"}`}>Reports</span>
          </Link>

          {/* Generate */}
          <Link
            href="/dashboard/new"
            className="flex flex-col items-center justify-end gap-0.5 pt-2 pb-1 min-w-[56px] group"
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive("/dashboard/new") ? "bg-[#3B0A45]/8" : ""}`}>
              <Compass className={`h-[20px] w-[20px] transition-colors ${isActive("/dashboard/new") ? "text-[#3B0A45]" : "text-zinc-400 group-active:text-zinc-600"}`} strokeWidth={isActive("/dashboard/new") ? 2.2 : 1.8} />
            </div>
            <span className={`text-[10px] leading-tight font-medium transition-colors ${isActive("/dashboard/new") ? "text-[#3B0A45]" : "text-zinc-400"}`}>Generate</span>
          </Link>

          {/* Profile or Login */}
          {status === "loading" ? (
            <div className="flex flex-col items-center justify-end gap-0.5 pt-2 pb-1 min-w-[56px]">
              <div className="h-5 w-5 rounded-full bg-zinc-100 animate-pulse m-1.5" />
              <span className="text-[10px] text-zinc-300">···</span>
            </div>
          ) : session ? (
            <Link
              href="/dashboard"
              className="flex flex-col items-center justify-end gap-0.5 pt-2 pb-1 min-w-[56px] group"
            >
              <div className="p-1.5 rounded-xl">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className={`h-[22px] w-[22px] rounded-full transition-all ${
                      pathname?.startsWith("/dashboard/profile") 
                        ? "ring-2 ring-[#3B0A45] ring-offset-1" 
                        : "border border-zinc-200 group-active:border-zinc-400"
                    }`}
                  />
                ) : (
                  <User className={`h-[20px] w-[20px] transition-colors ${
                    pathname?.startsWith("/dashboard/profile") ? "text-[#3B0A45]" : "text-zinc-400 group-active:text-zinc-600"
                  }`} strokeWidth={1.8} />
                )}
              </div>
              <span className={`text-[10px] leading-tight font-medium transition-colors ${
                pathname?.startsWith("/dashboard/profile") ? "text-[#3B0A45]" : "text-zinc-400"
              }`}>Profile</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center justify-end gap-0.5 pt-2 pb-1 min-w-[56px] group"
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive("/login") ? "bg-[#3B0A45]/8" : ""}`}>
                <LogIn className={`h-[20px] w-[20px] transition-colors ${isActive("/login") ? "text-[#3B0A45]" : "text-zinc-400 group-active:text-zinc-600"}`} strokeWidth={isActive("/login") ? 2.2 : 1.8} />
              </div>
              <span className={`text-[10px] leading-tight font-medium transition-colors ${isActive("/login") ? "text-[#3B0A45]" : "text-zinc-400"}`}>Log In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
