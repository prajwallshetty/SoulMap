import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Report from "@/models/Report";
import { logActivity } from "@/lib/audit";

// Middleware helper to check admin role
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return { authorized: false, session: null };
  }
  return { authorized: true, session };
}

// GET: Fetch all users with report counts
export async function GET() {
  try {
    const { authorized } = await checkAdmin();
    if (!authorized) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });

    const usersWithReportCount = await Promise.all(
      users.map(async (user) => {
        const reportCount = await Report.countDocuments({ userId: user._id });
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          reportCount,
        };
      })
    );

    return NextResponse.json({ users: usersWithReportCount });
  } catch (error: any) {
    console.error("Error fetching users in admin endpoint:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Update user role
export async function PATCH(req: Request) {
  try {
    const { authorized, session } = await checkAdmin();
    if (!authorized || !session) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ message: "Invalid request parameters" }, { status: 400 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ message: "You cannot change your own role." }, { status: 400 });
    }

    await dbConnect();
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const oldRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    // Log the admin action
    await logActivity({
      userId: session.user.id,
      userEmail: session.user.email || "admin",
      action: "admin.role_update",
      details: `Updated user ${targetUser.email} role from '${oldRole}' to '${role}'`,
      req,
    });

    return NextResponse.json({
      message: `User role updated to ${role} successfully`,
      user: {
        id: targetUser._id.toString(),
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error updating user role in admin endpoint:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Delete user and their reports
export async function DELETE(req: Request) {
  try {
    const { authorized, session } = await checkAdmin();
    if (!authorized || !session) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
    }

    await dbConnect();
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Delete associated reports
    const reportDeleteResult = await Report.deleteMany({ userId });

    // Log the admin action
    await logActivity({
      userId: session.user.id,
      userEmail: session.user.email || "admin",
      action: "admin.user_delete",
      details: `Deleted user ${targetUser.email} and all their ${reportDeleteResult.deletedCount} reports`,
      req,
    });

    return NextResponse.json({
      message: "User and all their associated reports deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user in admin endpoint:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
