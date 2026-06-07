import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

// Middleware helper to check admin role
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return { authorized: false };
  }
  return { authorized: true };
}

// GET: Fetch audit logs with optional filtering
export async function GET(req: Request) {
  try {
    const { authorized } = await checkAdmin();
    if (!authorized) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    await dbConnect();

    const query: any = {};
    if (action) {
      query.action = action;
    }
    if (search) {
      query.userEmail = { $regex: search, $options: "i" };
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Error fetching audit logs in admin endpoint:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
