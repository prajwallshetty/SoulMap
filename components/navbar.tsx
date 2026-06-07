"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, PlusCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-serif text-xl font-bold tracking-tight text-[#3B0A45]">
              SoulMap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                  {link.label}
                </Link>
              ))}

              {status === "loading" ? (
                <div className="h-8 w-20 animate-pulse rounded bg-zinc-100" />
              ) : session ? (
                <>
                  <Link href="/dashboard" className="flex items-center space-x-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/new" className="flex items-center space-x-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    <PlusCircle className="h-4 w-4 text-[#E8C47A]" />
                    <span>New Report</span>
                  </Link>
                  <div className="flex items-center space-x-3 border-l border-zinc-200 pl-6">
                    {session.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="h-8 w-8 rounded-full border border-zinc-200"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3B0A45]/20 bg-[#3B0A45]/5 text-[#3B0A45]">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm text-zinc-800 max-w-[120px] truncate">{session.user?.name || "Seeker"}</span>
                    <Button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 h-8 w-8 p-0"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-sm">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-[#3B0A45] hover:bg-[#3B0A45]/90 text-white font-medium rounded-lg h-9 text-sm px-4 shadow-sm transition-all">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — Full-screen overlay drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-50 md:hidden" id="mobile-menu">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={toggleMobileMenu} />
          
          {/* Drawer */}
          <div className="relative bg-white border-b border-zinc-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 space-y-1">
              {/* Nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-zinc-300" />
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-zinc-100 my-2" />

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    <LayoutDashboard className="h-[18px] w-[18px] text-zinc-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/new"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    <PlusCircle className="h-[18px] w-[18px] text-[#E8C47A]" />
                    <span>New Report</span>
                  </Link>

                  {/* User section */}
                  <div className="border-t border-zinc-100 mt-2 pt-3 mx-1">
                    <div className="flex items-center justify-between px-2 py-2">
                      <div className="flex items-center gap-3">
                        {session.user?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={session.user.image}
                            alt="Profile"
                            className="h-9 w-9 rounded-full border border-zinc-200"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3B0A45]/20 bg-[#3B0A45]/5 text-[#3B0A45]">
                            <UserIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{session.user?.name || "Seeker"}</p>
                          <p className="text-xs text-zinc-400 truncate max-w-[180px]">{session.user?.email || ""}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          toggleMobileMenu();
                          signOut({ callbackUrl: "/" });
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 h-9 w-9 p-0 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 px-1">
                  <Link href="/login" onClick={toggleMobileMenu} className="w-full">
                    <Button variant="outline" className="w-full h-11 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[15px]">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={toggleMobileMenu} className="w-full">
                    <Button className="w-full h-11 bg-[#3B0A45] text-white font-semibold hover:bg-[#3B0A45]/90 rounded-lg text-[15px]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
