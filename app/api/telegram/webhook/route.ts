import { NextResponse } from "next/server";
import { handleTelegramUpdate, getBotToken } from "@/lib/telegram-bot";
import { getDeviceStats } from "@/lib/device-storage";

export async function POST(request: Request) {
  try {
    const update = await request.json();
    await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[Telegram Webhook Error]:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const setWebhook = url.searchParams.get("setWebhook");

  // If user accesses ?setWebhook=https://your-domain.com/api/telegram/webhook
  if (setWebhook) {
    try {
      const token = getBotToken();
      const res = await fetch(
        `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(
          setWebhook
        )}`
      );
      const data = await res.json();
      return NextResponse.json({ success: true, telegramResponse: data });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  // Otherwise return status and quick stats overview
  const stats = await getDeviceStats();
  return NextResponse.json({
    status: "Telegram webhook endpoint is active",
    botUsername: "testingHubUzBot",
    supportedCommands: ["/statistics", "/stats", "/help", "/start"],
    currentStats: stats,
  });
}
