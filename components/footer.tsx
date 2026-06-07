import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-12 text-zinc-500 no-print mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center">
              <span className="font-serif text-lg font-bold tracking-tight text-[#3B0A45]">
                soul<span className="text-[#E8C47A]">Map</span>
              </span>
            </Link>
            <p className="mt-2 text-center text-xs text-zinc-400 md:text-left">
              Unlocking the ancient wisdom of Vedic astrology through sophisticated cosmic alignment synthesis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/#features" className="hover:text-zinc-900 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-zinc-900 transition-colors">
              How It Works
            </Link>
            <Link href="/#faq" className="hover:text-zinc-900 transition-colors">
              FAQ
            </Link>
            <a href="#" className="hover:text-zinc-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-900 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <div>
            &copy; {new Date().getFullYear()} SoulMap. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-[#3B0A45] fill-[#3B0A45]" /> for seekers of truth.
          </div>
        </div>
      </div>
    </footer>
  );
}
