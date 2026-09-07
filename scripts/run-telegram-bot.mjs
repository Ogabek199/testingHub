import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load environment variables from .env.local
const envPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN topilmadi (.env.local faylini tekshiring)");
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${token}`;

// Helper: load visitor storage
const dataFile = path.join(rootDir, "data", "visitor_devices.json");

function getStats() {
  try {
    if (!fs.existsSync(dataFile)) {
      return {
        totalDevices: 0,
        todayDevices: 0,
        past7DaysDevices: 0,
        deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
        osBreakdown: {},
        browserBreakdown: {},
        lastUpdated: new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
      };
    }
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const devices = Object.values(data.devices || {});

    const now = new Date();
    const todayStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let todayCount = 0;
    let past7DaysCount = 0;
    const deviceTypes = { mobile: 0, desktop: 0, tablet: 0 };
    const osBreakdown = {};
    const browserBreakdown = {};

    for (const d of devices) {
      if (d.deviceType === "mobile") deviceTypes.mobile++;
      else if (d.deviceType === "tablet") deviceTypes.tablet++;
      else deviceTypes.desktop++;

      const osKey = d.os || "Boshqa";
      osBreakdown[osKey] = (osBreakdown[osKey] || 0) + 1;

      const brKey = d.browser || "Boshqa";
      browserBreakdown[brKey] = (browserBreakdown[brKey] || 0) + 1;

      const lastSeen = new Date(d.lastSeen);
      const lastSeenStr = lastSeen.toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
      if (lastSeenStr === todayStr) todayCount++;
      if (lastSeen >= sevenDaysAgo) past7DaysCount++;
    }

    return {
      totalDevices: devices.length,
      todayDevices: todayCount,
      past7DaysDevices: past7DaysCount,
      deviceTypes,
      osBreakdown,
      browserBreakdown,
      lastUpdated: new Date().toLocaleString("uz-UZ", {
        timeZone: "Asia/Tashkent",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch (e) {
    console.error("Xatolik statistikani o'qishda:", e);
    return null;
  }
}

function formatMessage(stats) {
  if (!stats) return "⚠️ Hozircha statistika mavjud emas.";

  const total = stats.totalDevices;
  const mob = stats.deviceTypes.mobile;
  const desk = stats.deviceTypes.desktop;
  const tab = stats.deviceTypes.tablet;

  const mobPct = total > 0 ? ((mob / total) * 100).toFixed(1) : "0.0";
  const deskPct = total > 0 ? ((desk / total) * 100).toFixed(1) : "0.0";
  const tabPct = total > 0 ? ((tab / total) * 100).toFixed(1) : "0.0";

  const topOs = Object.entries(stats.osBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([os, count]) => `${os}: ${count}`)
    .join(" | ") || "Mavjud emas";

  const topBrowsers = Object.entries(stats.browserBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([br, count]) => `${br}: ${count}`)
    .join(" | ") || "Mavjud emas";

  return `📊 <b>testingHub — Sayt Statistikasi</b>
━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami kirgan qurilmalar:</b> <code>${total}</code> ta
📅 <b>Bugun kirganlar:</b> <code>${stats.todayDevices}</code> ta
🗓 <b>So'nggi 7 kunda:</b> <code>${stats.past7DaysDevices}</code> ta

📱 <b>Qurilma turlari:</b>
├ 📱 <b>Mobile:</b> ${mob} ta (${mobPct}%)
├ 💻 <b>Desktop:</b> ${desk} ta (${deskPct}%)
└ 📟 <b>Tablet:</b> ${tab} ta (${tabPct}%)

💻 <b>Operatsion tizimlar:</b>
${topOs}

🌐 <b>Brauzerlar:</b>
${topBrowsers}
━━━━━━━━━━━━━━━━━━━━
🕒 <i>Yangilangan: ${stats.lastUpdated}</i>`;
}

async function sendMessage(chatId, text, replyMarkup) {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });
  } catch (err) {
    console.error("Xabar jo'natishda xatolik:", err.message);
  }
}

async function editMessage(chatId, messageId, text, replyMarkup) {
  try {
    await fetch(`${TELEGRAM_API}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });
  } catch (err) {
    console.error("Xabarni tahrirlashda xatolik:", err.message);
  }
}

async function answerCallback(callbackId, text) {
  try {
    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackId,
        text: text || "",
      }),
    });
  } catch (err) {
    console.error("Callback javobida xatolik:", err.message);
  }
}

async function processUpdate(update) {
  // 1. Callback query
  if (update.callback_query) {
    const cb = update.callback_query;
    if (cb.data === "refresh_stats" && cb.message) {
      await answerCallback(cb.id, "Statistika yangilanmoqda...");
      const stats = getStats();
      const text = formatMessage(stats);
      await editMessage(cb.message.chat.id, cb.message.message_id, text, {
        inline_keyboard: [[{ text: "🔄 Yangilash", callback_data: "refresh_stats" }]],
      });
      return;
    }
  }

  // 2. Text message
  const msg = update.message;
  if (!msg || !msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const lower = text.toLowerCase();

  console.log(`[Telegram Update] Chat ${chatId}: "${text}"`);

  if (
    lower.startsWith("/statistics") ||
    lower.startsWith("/stats") ||
    lower === "statistics" ||
    lower === "statistika"
  ) {
    const stats = getStats();
    const replyText = formatMessage(stats);
    await sendMessage(chatId, replyText, {
      inline_keyboard: [[{ text: "🔄 Yangilash", callback_data: "refresh_stats" }]],
    });
    return;
  }

  if (lower.startsWith("/start") || lower.startsWith("/help")) {
    const welcome = `👋 <b>Assalomu alaykum!</b>

Men <b>testingHub</b> loyihasining monitoring botiman.

📌 <b>Buyruqlar:</b>
• /statistics — Saytga kirgan barcha qurilmalar soni va hisoboti
• /stats — Qisqartirilgan buyruq
• /help — Yordam

Statistikani ko'rish uchun quyidagi tugmani bosing:`;

    await sendMessage(chatId, welcome, {
      inline_keyboard: [[{ text: "📊 Statistikani ko'rish", callback_data: "refresh_stats" }]],
    });
    return;
  }
}

// Long-polling loop
let offset = 0;

async function startPolling() {
  console.log("🚀 testingHub Telegram Bot ishga tushdi (@testingHubUzBot)");
  console.log("📡 Telegramdan yangilanishlar kutilmoqda... (/statistics yoki /stats yuboring)\n");

  // Clear any existing webhook to enable polling
  try {
    await fetch(`${TELEGRAM_API}/deleteWebhook?drop_pending_updates=true`);
  } catch {}

  while (true) {
    try {
      const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${offset}&timeout=25`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await processUpdate(update);
        }
      }
    } catch (err) {
      console.error("Polling error:", err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startPolling();
