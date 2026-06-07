import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Report from "@/models/Report";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET details of a specific report
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    await dbConnect();

    // Enforce that users can only fetch their own reports
    const report = await Report.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!report) {
      return NextResponse.json(
        { message: "Astrology report not found or unauthorized access." },
        { status: 404 }
      );
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching individual report:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to load report details." },
      { status: 500 }
    );
  }
}

// DELETE a specific report
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    await dbConnect();

    // Enforce that users can only delete their own reports
    const deletedReport = await Report.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedReport) {
      return NextResponse.json(
        { message: "Astrology report not found or unauthorized delete." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Report deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to delete report." },
      { status: 500 }
    );
  }
}
