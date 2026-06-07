import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Report from "@/models/Report";
import { astrologyService } from "@/lib/astrology";

// GET all reports for the current user (only returns metadata to speed up listing)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    await dbConnect();

    const reports = await Report.find(
      { userId: session.user.id },
      { generatedReport: 0 } // Exclude the huge generated report payload to keep it fast
    ).sort({ createdAt: -1 });

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user reports:", error);
    return NextResponse.json(
      { message: "Internal server error. Failed to retrieve reports." },
      { status: 500 }
    );
  }
}

// POST generate and save a new astrology report
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const { fullName, gender, dob, birthTime, birthPlace } = await req.json();

    // Field Validation
    if (!fullName || !gender || !dob || !birthTime || !birthPlace) {
      return NextResponse.json(
        { message: "All birth detail fields are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Call modular Astrology Service to fetch AI calculations
    const generatedReport = await astrologyService.generateReport({
      fullName,
      gender,
      dob,
      birthTime,
      birthPlace,
    });

    if (!generatedReport) {
      return NextResponse.json(
        { message: "Failed to generate report from planetary alignment data." },
        { status: 502 }
      );
    }

    // Save to database
    const newReport = await Report.create({
      userId: session.user.id,
      fullName,
      gender,
      dob,
      birthTime,
      birthPlace,
      generatedReport,
    });

    return NextResponse.json(
      {
        message: "Astrology report generated successfully",
        reportId: newReport._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error generating report API:", error);
    return NextResponse.json(
      { message: error.message || "Failed to generate report. Please try again." },
      { status: 500 }
    );
  }
}
