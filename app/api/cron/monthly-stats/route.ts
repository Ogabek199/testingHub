import { NextResponse } from "next/server";
import { sendMonthlyTelegramReport } from "@/lib/telegram-bot";
import { isMonthlyReportSent, getTashkentYearMonth } from "@/lib/device-storage";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "true";
    const targetMonth = url.searchParams.get("month") || undefined;

    // Check if current/target month already sent
    const now = new Date();
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = getTashkentYearMonth(prevDate);
    const monthToCheck = targetMonth || prevMonth;

    const alreadySent = await isMonthlyReportSent(monthToCheck);

    if (alreadySent && !force) {
      return NextResponse.json({
        success: true,
        message: `${monthToCheck} oyi uchun hisobot allaqachon yuborilgan. Majburiy yuborish uchun ?force=true qo'shing.`,
        month: monthToCheck,
        alreadySent: true,
      });
    }

    const result = await sendMonthlyTelegramReport(undefined, monthToCheck);

    return NextResponse.json({
      success: true,
      message: `${monthToCheck} oylik hisoboti Telegramga muvaffaqiyatli yuborildi!`,
      month: monthToCheck,
      telegramResult: result,
    });
  } catch (error: any) {
    console.error("[Monthly Cron API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
