import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "./mongodb";
import User from "../models/User";
import { logActivity } from "./audit";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          // Log failed login
          await logActivity({
            userId: user._id.toString(),
            userEmail: user.email,
            action: "user.login_failed",
            details: "Credentials sign-in: Incorrect password attempt",
          });
          throw new Error("Incorrect password");
        }

        // Log successful login
        await logActivity({
          userId: user._id.toString(),
          userEmail: user.email,
          action: "user.login",
          details: "Credentials sign-in: Successful login",
        });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || "",
          role: user.role || "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return "/login?error=OAuthEmailMissing";
        }
        try {
          await dbConnect();
          const emailLower = user.email.toLowerCase();
          const existingUser = await User.findOne({ email: emailLower });
          
          if (!existingUser) {
            // Create user in database for Google sign-in
            const newUser = await User.create({
              name: user.name || "Google User",
              email: emailLower,
              image: user.image || "",
              role: "user", // Default role
            });
            // Log Google registration
            await logActivity({
              userId: newUser._id.toString(),
              userEmail: emailLower,
              action: "user.register",
              details: "Google sign-in: Registered new user",
            });
          } else {
            // Log Google login
            await logActivity({
              userId: existingUser._id.toString(),
              userEmail: emailLower,
              action: "user.login",
              details: "Google sign-in: Successful login",
            });
          }
          return true;
        } catch (error: any) {
          console.error("Error saving Google user to DB:", error);
          const errorMessage = error?.message || "Unknown database error";
          return `/login?error=OAuthDbError&message=${encodeURIComponent(errorMessage)}`;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role || "user";
          }
        } catch (error) {
          console.error("Error resolving user ID/role in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
