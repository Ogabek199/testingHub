import {
  getDeviceStats,
  formatTelegramStatsMessage,
  getMonthlyStats,
  formatMonthlyTelegramStatsMessage,
  markMonthlyReportSent,
} from "./device-storage";

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

export function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");
  }
  return token;
}

export function getDefaultChatId(): string | undefined {
  return process.env.TELEGRAM_CHAT_ID;
}

/**
 * Whitelisted Telegram User IDs permitted to use the bot
 */
export const DEFAULT_ALLOWED_USER_IDS: string[] = [
  "1329024520",
  "5764200653",
];

export function getAllowedUserIds(): string[] {
  const envAllowed = process.env.TELEGRAM_ALLOWED_USERS;
  if (envAllowed) {
    const ids = envAllowed
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    return Array.from(new Set([...DEFAULT_ALLOWED_USER_IDS, ...ids]));
  }
  return DEFAULT_ALLOWED_USER_IDS;
}

export function isUserAllowed(userId?: string | number | null): boolean {
  if (!userId) return false;
  const strId = String(userId).trim();
  return getAllowedUserIds().includes(strId);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Send a message via Telegram Bot API
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options: {
    parse_mode?: "HTML" | "MarkdownV2" | "Markdown";
    reply_markup?: any;
  } = {}
) {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}${token}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: options.parse_mode || "HTML",
      reply_markup: options.reply_markup,
    }),
  });

  return res.json();
}

/**
 * Edit a message via Telegram Bot API (e.g., for refresh button)
 */
export async function editTelegramMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  options: {
    parse_mode?: "HTML" | "MarkdownV2" | "Markdown";
    reply_markup?: any;
  } = {}
) {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}${token}/editMessageText`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options.parse_mode || "HTML",
      reply_markup: options.reply_markup,
    }),
  });

  return res.json();
}

/**
 * Answer a callback query from an inline button
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert: boolean = false
) {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}${token}/answerCallbackQuery`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || "",
      show_alert: showAlert,
    }),
  });
}

/**
 * Send the monthly analytics report to telegram
 */
export async function sendMonthlyTelegramReport(targetChatId?: string | number, targetYearMonth?: string) {
  const chatId = targetChatId || getDefaultChatId();
  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is not configured.");
  }

  const monthlyStats = await getMonthlyStats(targetYearMonth);
  const text = formatMonthlyTelegramStatsMessage(monthlyStats);

  const res = await sendTelegramMessage(chatId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
          { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
        ],
      ],
    },
  });

  if (res.ok) {
    await markMonthlyReportSent(monthlyStats.yearMonth);
  }

  return res;
}

/**
 * Main dispatcher for Telegram bot updates
 */
export async function handleTelegramUpdate(update: any): Promise<boolean> {
  if (!update) return false;

  // 1. Handle Inline Button Clicks (callback_query)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data = cb.data;
    const chatId = cb.message?.chat?.id;
    const messageId = cb.message?.message_id;
    const fromId = cb.from?.id;

    if (!chatId || !messageId) return false;

    // Security check: Whitelist verification for button clicks
    if (!isUserAllowed(fromId)) {
      await answerCallbackQuery(
        cb.id,
        "⛔️ Ruxsat berilmagan! Ushbu bot faqat tasdiqlangan ma'murlar uchun.",
        true
      );
      return true;
    }

    if (data === "refresh_stats") {
      await answerCallbackQuery(cb.id, "Statistika yangilanmoqda...");
      const stats = await getDeviceStats();
      const text = formatTelegramStatsMessage(stats);
      await editTelegramMessage(chatId, messageId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔄 Yangilash", callback_data: "refresh_stats" },
              { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
            ],
          ],
        },
      });
      return true;
    }

    if (data === "monthly_stats") {
      await answerCallbackQuery(cb.id, "Oylik hisobot tayyorlanmoqda...");
      const monthlyStats = await getMonthlyStats();
      const text = formatMonthlyTelegramStatsMessage(monthlyStats);
      await editTelegramMessage(chatId, messageId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
              { text: "🔄 Yangilash", callback_data: "monthly_stats" },
            ],
          ],
        },
      });
      return true;
    }
  }

  // 2. Handle Text Messages
  const message = update.message || update.channel_post;
  if (!message || !message.text) return false;

  const chatId = message.chat.id;
  const fromId = message.from?.id;
  const rawText = message.text.trim();
  const lower = rawText.toLowerCase();

  // Command: /id or /myid (Public command so anyone can see their ID to request access)
  if (lower === "/id" || lower === "/myid") {
    await sendTelegramMessage(
      chatId,
      `🆔 <b>Sizning Telegram ID raqamingiz:</b> <code>${fromId || chatId}</code>\n\n` +
      `<i>Ushbu ID raqamni TestingHub ma'muriga taqdim etib botga ruxsat olishingiz mumkin.</i>`,
      { parse_mode: "HTML" }
    );
    return true;
  }

  // Security check: Whitelist verification for text commands
  if (!isUserAllowed(fromId)) {
    const userName =
      [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") ||
      message.from?.username ||
      "Foydalanuvchi";

    await sendTelegramMessage(
      chatId,
      `⛔️ <b>Kirish taqiqlangan!</b>\n\n` +
      `Hurmatli <b>${escapeHtml(userName)}</b>, sizda <b>TestingHub</b> botidan foydalanish huquqi yo'q.\n\n` +
      `🆔 <b>Sizning Telegram ID:</b> <code>${fromId || "noma'lum"}</code>\n\n` +
      `🔒 <i>Xavfsizlik maqsadida ushbu bot faqat ruxsat berilgan ma'murlar uchun ishlaydi. Botdan foydalanish uchun ID raqamingizni administratorga taqdim eting.</i>`,
      { parse_mode: "HTML" }
    );
    return true;
  }

  // Command: /monthly, /oylik, /month
  if (
    lower.startsWith("/monthly") ||
    lower.startsWith("/oylik") ||
    lower.startsWith("/month") ||
    lower === "oylik" ||
    lower === "oylik hisobot" ||
    lower === "monthly"
  ) {
    const monthlyStats = await getMonthlyStats();
    const responseText = formatMonthlyTelegramStatsMessage(monthlyStats);

    await sendTelegramMessage(chatId, responseText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
            { text: "🔄 Yangilash", callback_data: "monthly_stats" },
          ],
        ],
      },
    });
    return true;
  }

  // Command: /statistics, /statistika, /stats, /stat, statistics, statistika
  if (
    lower.startsWith("/statistics") ||
    lower.startsWith("/statistika") ||
    lower.startsWith("/stats") ||
    lower.startsWith("/stat") ||
    lower === "statistics" ||
    lower === "statistika" ||
    lower === "stats" ||
    lower === "stat"
  ) {
    const stats = await getDeviceStats();
    const responseText = formatTelegramStatsMessage(stats);

    await sendTelegramMessage(chatId, responseText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔄 Yangilash", callback_data: "refresh_stats" },
            { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
          ],
        ],
      },
    });
    return true;
  }

  // Command: /start or /help
  if (lower.startsWith("/start") || lower.startsWith("/help")) {
    const helpText = `👋 <b>Assalomu alaykum!</b>

Men <b>TestingHub</b> loyihasining rasmiy monitoring botiman.
Siz tasdiqlangan ma'mursiz (✅ Ruxsat faol).

📌 <b>Mavjud buyruqlar:</b>
• /statistics — Saytga tashrif buyurgan barcha qurilmalar va jami tashriflar hisoboti
• /monthly — O'tgan oy yakunlari va to'liq oylik analitika hisoboti
• /stats — Qisqartirilgan buyruq
• /id — O'z Telegram ID raqamingizni ko'rish
• /help — Yordam ma'lumoti

🔔 <i>Bot har oy boshida avtomatik tarzda oylik hisobotni guruhga yetkazib beradi.</i>

Kerakli bo'limni tanlang 👇`;

    await sendTelegramMessage(chatId, helpText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
            { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
          ],
        ],
      },
    });
    return true;
  }

  return false;
}
