"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Parse error from NextAuth redirect URL if any (like ?error=OAuthSignin)
  useEffect(() => {
    const err = searchParams?.get("error");
    if (err) {
      if (err === "CredentialsSignin") {
        setError("Invalid email or password. Please try again.");
      } else if (err === "OAuthSignin") {
        setError("Failed to sign in with Google. Please verify that your Google Client ID and Client Secret are correct.");
      } else if (err === "AccessDenied") {
        setError("Access denied. This usually means your database connection failed during login, or your Google OAuth credentials are misconfigured. Please check server logs.");
      } else if (err === "OAuthEmailMissing") {
        setError("Sign in failed because your Google account does not have a verified email address associated with it.");
      } else if (err === "OAuthDbError") {
        const details = searchParams?.get("message") || "Database connection or write error";
        setError(`Database Error: ${details}. Please ensure you have set MONGODB_URI in your Vercel Environment Variables and configured your MongoDB Atlas Network Access (IP Access List) to allow access from anywhere (0.0.0.0/0).`);
      } else {
        setError(`An authentication error occurred (${err}). Please try again.`);
      }
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Google Login failed.");
      setGoogleLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-grow items-center justify-center min-h-[60vh] bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 text-[#3B0A45] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-grow items-center justify-center px-4 py-20 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-xl p-8 shadow-sm">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#18181B] tracking-tight">
            Welcome to SoulMap
          </h2>
          <p className="text-sm text-[#71717A] mt-1 font-light">
            Log in to read your Vedic astrological blueprint
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 p-3.5 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white border-[#E4E4E7] text-[#18181B] placeholder-zinc-400 focus-visible:ring-[#3B0A45] rounded-lg"
                required
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white border-[#E4E4E7] text-[#18181B] placeholder-zinc-400 focus-visible:ring-[#3B0A45] rounded-lg"
                required
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3B0A45] text-white font-medium hover:bg-[#3B0A45]/95 h-10 transition-all shadow-sm rounded-lg mt-2"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Signing In...
              </span>
            ) : (
              "Sign In with Email"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E4E7]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-zinc-400 font-light">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          type="button"
          className="w-full border-[#E4E4E7] text-zinc-700 hover:bg-zinc-50 h-10 flex items-center justify-center gap-2 rounded-lg"
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span>Sign In with Google</span>
        </Button>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-[#71717A] font-light">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#3B0A45] hover:underline font-medium transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-grow items-center justify-center min-h-[60vh] bg-[#FAFAFA]">
          <Loader2 className="h-8 w-8 text-[#3B0A45] animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
