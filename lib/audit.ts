import { dbConnect } from "./mongodb";
import AuditLog from "../models/AuditLog";

interface LogParams {
  userId?: string;
  userEmail: string;
  action: string;
  details: string;
  req?: Request;
}

export async function logActivity({ userId, userEmail, action, details, req }: LogParams) {
  try {
    let ipAddress = "";
    let userAgent = "";

    if (req) {
      const xForwardedFor = req.headers.get("x-forwarded-for");
      if (xForwardedFor) {
        ipAddress = xForwardedFor.split(",")[0].trim();
      } else {
        ipAddress = "127.0.0.1";
      }
      userAgent = req.headers.get("user-agent") || "";
    }

    await dbConnect();
    await AuditLog.create({
      userId: userId || undefined,
      userEmail: userEmail.toLowerCase(),
      action,
      details,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
