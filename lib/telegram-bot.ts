import { getDeviceStats, formatTelegramStatsMessage } from "./device-storage";

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

export function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");
  }
  return token;
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

    if (data === "refresh_stats" && chatId && messageId) {
      await answerCallbackQuery(cb.id, "Statistika yangilanmoqda...");
      const stats = await getDeviceStats();
      const text = formatTelegramStatsMessage(stats);
      await editTelegramMessage(chatId, messageId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Yangilash", callback_data: "refresh_stats" }],
          ],
        },
      });
      return true;
    }
  }

  // 2. Handle Text Messages
  const message = update.message;
  if (!message || !message.text) return false;

  const chatId = message.chat.id;
  const rawText = message.text.trim();
  const lower = rawText.toLowerCase();

  // Command: /statistics, /stats, statistics, statistika
  if (
    lower.startsWith("/statistics") ||
    lower.startsWith("/stats") ||
    lower === "statistics" ||
    lower === "statistika"
  ) {
    const stats = await getDeviceStats();
    const responseText = formatTelegramStatsMessage(stats);

    await sendTelegramMessage(chatId, responseText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 Yangilash", callback_data: "refresh_stats" }],
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
• /statistics — Saytga tashrif buyurgan barcha qurilmalar soni va batafsil statistikasi
• /stats — Qisqartirilgan buyruq
• /help — Yordam ma'lumoti

Statistikani ko'rish uchun quyidagi tugmani bosing yoki /statistics buyrug'ini yuboring 👇`;

    await sendTelegramMessage(chatId, helpText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📊 Statistikani ko'rish", callback_data: "refresh_stats" }],
        ],
      },
    });
    return true;
  }

  return false;
}
