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
  text?: string
) {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}${token}/answerCallbackQuery`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || "",
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

    if (!chatId || !messageId) return false;

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
  const rawText = message.text.trim();
  const lower = rawText.toLowerCase();

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

Men <b>testingHub</b> loyihasining rasmiy monitoring botiman.

📌 <b>Mavjud buyruqlar:</b>
• /statistics — Saytga tashrif buyurgan barcha qurilmalar va jami tashriflar hisoboti
• /monthly — O'tgan oy yakunlari va to'liq oylik analitika hisoboti
• /stats — Qisqartirilgan buyruq
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
