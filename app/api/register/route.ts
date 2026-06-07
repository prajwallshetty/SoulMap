import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { logActivity } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please provide all required fields (Name, Email, Password)" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Bootstrap first user as admin
    const userCount = await User.countDocuments({});
    const role = userCount === 0 ? "admin" : "user";

    // Create user
    const newUser = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      role,
    });

    // Write audit log
    await logActivity({
      userId: newUser._id.toString(),
      userEmail: emailLower,
      action: "user.register",
      details: `Credentials registration: Registered new account with role '${role}'`,
      req,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in registration endpoint:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
