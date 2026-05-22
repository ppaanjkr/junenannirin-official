import { NextResponse } from "next/server";
import { testDriveFolder } from "@/lib/google/drive";

export async function GET() {
  try {
    const folder = await testDriveFolder();

    return NextResponse.json({
      success: true,
      folder,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err?.message,
    });
  }
}