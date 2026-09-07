import { NextResponse } from "next/server";
import { recordDeviceVisit } from "@/lib/device-storage";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    const userAgent = request.headers.get("user-agent") || "";

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body can be empty on beacon
    }

    const { deviceId, screenResolution, language } = body;

    const result = await recordDeviceVisit({
      deviceId,
      userAgent,
      screenResolution,
      language,
      ip,
    });

    return NextResponse.json(
      {
        success: true,
        deviceId: result.deviceId,
        isNew: result.isNew,
        totalDevices: result.totalDevices,
        totalVisits: result.totalVisits,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[TrackDevice API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Tracking error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
