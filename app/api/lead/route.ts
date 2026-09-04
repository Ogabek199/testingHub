import { NextResponse } from "next/server";

// In-memory rate limiting: max 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();


function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) {
    return true;
  }
  entry.count++;
  return false;
}

function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    // Rate limiter check
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Juda ko'p so'rov yuborildi. Iltimos, 1 daqiqadan so'ng qayta urinib ko'ring." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      phone,
      email,
      company,
      telegram,
      comment,
      services,
      price,
      duration,
      leadId,
      honeypot,
    } = body;

    // Anti-spam check
    if (honeypot) {
      return NextResponse.json({ success: false, error: "Spam detected" }, { status: 400 });
    }

    // Validation
    const cleanName = (name || "").trim().slice(0, 100);
    const cleanPhone = (phone || "").trim().slice(0, 30);
    const cleanEmail = (email || "").trim().slice(0, 100);
    const cleanCompany = (company || "").trim().slice(0, 100);
    const cleanTelegram = (telegram || "").trim().slice(0, 100);
    const cleanComment = (comment || "").trim().slice(0, 2000);

    if (!cleanName || !cleanPhone) {
      return NextResponse.json(
        { success: false, error: "Ism va telefon raqami majburiy!" },
        { status: 400 }
      );
    }


    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error: "Telegram bot konfiguratsiyasi serverda topilmadi (TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan).",
          leadId,
        },
        { status: 500 }
      );
    }

    const safeLeadId = escapeHtml(leadId || "QA-" + Date.now());
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const rawTg = telegram ? (telegram.startsWith("@") ? telegram : "@" + telegram) : "";
    const safeTelegram = escapeHtml(rawTg);
    const safeServices = escapeHtml(services || "Ko'rsatilmagan");
    const safePrice = escapeHtml(price || "Ko'rsatilmagan");
    const safeDuration = escapeHtml(duration || "Ko'rsatilmagan");
    const safeComment = escapeHtml(comment);

    const nowFormatted = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const messageText = `🎯 <b>Yangi QA Testing So'rovi!</b>
━━━━━━━━━━━━━━━━━━━
🆔 <b>So'rov ID:</b> <code>${safeLeadId}</code>
👤 <b>Mijoz:</b> ${safeName}
📞 <b>Telefon:</b> ${safePhone}
${safeEmail ? `📧 <b>Email:</b> ${safeEmail}\n` : ""}${safeCompany ? `🏢 <b>Kompaniya:</b> ${safeCompany}\n` : ""}${safeTelegram ? `💬 <b>Telegram:</b> ${safeTelegram}\n` : ""}
🛠 <b>Xizmatlar:</b> ${safeServices}
💰 <b>Smeta narxi:</b> ${safePrice}
⏱ <b>Taxminiy muddat:</b> ${safeDuration}
${safeComment ? `\n📝 <b>Loyiha haqida:</b>\n<i>${safeComment}</i>\n` : ""}━━━━━━━━━━━━━━━━━━━
📅 <b>Vaqt:</b> ${escapeHtml(nowFormatted)}`;

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      });

      const tgData = await tgRes.json();
      if (!tgData.ok) {
        console.error("Telegram API Error response:", tgData);
        return NextResponse.json(
          {
            success: false,
            error: tgData.description || "Telegramga xabar yuborishda xatolik yuz berdi",
            leadId,
          },
          { status: 502 }
        );
      }
    } catch (tgErr: any) {
      console.error("Telegram network request failed:", tgErr);
      return NextResponse.json(
        {
          success: false,
          error: "Telegram serveri bilan bog'lanishda xatolik",
          leadId,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, leadId });
  } catch (error: any) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

