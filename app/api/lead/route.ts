import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Ism va telefon raqami majburiy!" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const messageText = `🎯 <b>Yangi QA Testing So'rovi!</b>
━━━━━━━━━━━━━━━━━━━
🆔 <b>So'rov ID:</b> <code>${leadId || "QA-" + Date.now()}</code>
👤 <b>Mijoz:</b> ${name}
📞 <b>Telefon:</b> ${phone}
${email ? `📧 <b>Email:</b> ${email}\n` : ""}${company ? `🏢 <b>Kompaniya:</b> ${company}\n` : ""}${telegram ? `💬 <b>Telegram:</b> ${telegram.startsWith("@") ? telegram : "@" + telegram}\n` : ""}
🛠 <b>Xizmatlar:</b> ${services || "Ko'rsatilmagan"}
💰 <b>Smeta narxi:</b> ${price || "Ko'rsatilmagan"}
⏱ <b>Taxminiy muddat:</b> ${duration || "Ko'rsatilmagan"}
${comment ? `\n📝 <b>Loyiha haqida:</b>\n<i>${comment}</i>\n` : ""}━━━━━━━━━━━━━━━━━━━
📅 <b>Vaqt:</b> ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

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
          console.error("Telegram API Error:", tgData);
        }
      } catch (tgErr) {
        console.error("Telegram request failed:", tgErr);
      }
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
