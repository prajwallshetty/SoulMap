import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "./mongodb";
import User from "../models/User";

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
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || "",
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
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email?.toLowerCase() });
          
          if (!existingUser) {
            // Create user in database for Google sign-in
            await User.create({
              name: user.name,
              email: user.email?.toLowerCase(),
              image: user.image || "",
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user to DB:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // If we don't have the ID yet (e.g. initial Google login token update), retrieve it from the DB
      if (!token.id && token.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("Error resolving user ID in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
