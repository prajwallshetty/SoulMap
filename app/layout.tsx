import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/session-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BottomNav from "@/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoulMap - Premium Vedic Astrology & Horoscope Reports",
  description: "Receive a professional, highly detailed, personalized Vedic astrology report based on your birth details.",
  keywords: ["astrology", "vedic astrology", "horoscope", "kundli", "birth chart", "rashi", "nakshatra", "jyotish"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow relative z-10 flex flex-col w-full pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

