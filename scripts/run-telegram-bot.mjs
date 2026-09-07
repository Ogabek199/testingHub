import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Load environment variables from .env.local
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

const defaultChatId = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
const dataFile = path.join(rootDir, "data", "visitor_devices.json");

const UZBEK_MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

function getTashkentDate(d = new Date()) {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" }); // YYYY-MM-DD
}

function getTashkentYearMonth(d = new Date()) {
  return getTashkentDate(d).slice(0, 7); // YYYY-MM
}

function formatMonthName(yearMonth) {
  const [year, monthStr] = yearMonth.split("-");
  const monthIdx = parseInt(monthStr, 10) - 1;
  const name = UZBEK_MONTHS[monthIdx] || monthStr;
  return `${year}-yil ${name} oyi`;
}

// Safely read visitor data
function loadData() {
  try {
    if (!fs.existsSync(dataFile)) {
      return {
        devices: {},
        totalVisits: 0,
        dailyVisits: {},
        monthlyVisits: {},
        monthlyUniqueDevices: {},
        monthlyReportsSent: {},
      };
    }
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.devices) parsed.devices = {};
    if (!parsed.dailyVisits) parsed.dailyVisits = {};
    if (!parsed.monthlyVisits) parsed.monthlyVisits = {};
    if (!parsed.monthlyUniqueDevices) parsed.monthlyUniqueDevices = {};
    if (!parsed.monthlyReportsSent) parsed.monthlyReportsSent = {};
    if (typeof parsed.totalVisits !== "number") {
      parsed.totalVisits = Object.values(parsed.devices).reduce(
        (sum, d) => sum + (d.visitCount || 1),
        0
      );
    }
    return parsed;
  } catch (err) {
    console.error("Faylni o'qishda xatolik:", err.message);
    return null;
  }
}

// Safely save visitor data (atomic)
function saveData(data) {
  try {
    const temp = `${dataFile}.tmp.${Date.now()}`;
    fs.writeFileSync(temp, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(temp, dataFile);
  } catch (err) {
    console.error("Faylni saqlashda xatolik:", err.message);
  }
}

// Real-time live statistics
function getLiveStats() {
  const data = loadData();
  if (!data) return null;

  const devices = Object.values(data.devices || {});
  const now = new Date();
  const todayStr = getTashkentDate(now);
  const currentMonth = getTashkentYearMonth(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let todayDevices = 0;
  let past7DaysDevices = 0;
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
    const lastSeenStr = getTashkentDate(lastSeen);
    if (lastSeenStr === todayStr) todayDevices++;
    if (lastSeen >= sevenDaysAgo) past7DaysDevices++;
  }

  const thisMonthUnique = data.monthlyUniqueDevices?.[currentMonth]?.length ||
    devices.filter(d => getTashkentYearMonth(new Date(d.lastSeen)) === currentMonth).length;

  return {
    totalDevices: devices.length,
    totalVisits: data.totalVisits || devices.reduce((sum, d) => sum + (d.visitCount || 1), 0),
    todayDevices,
    todayVisits: data.dailyVisits?.[todayStr] || todayDevices,
    thisMonthDevices: thisMonthUnique,
    thisMonthVisits: data.monthlyVisits?.[currentMonth] || 0,
    past7DaysDevices,
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
}

// Monthly statistics summary
function getMonthlyStats(targetYearMonth) {
  const data = loadData();
  if (!data) return null;

  const now = new Date();
  let yearMonth = targetYearMonth;
  if (!yearMonth) {
    const currentYM = getTashkentYearMonth(now);
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYM = getTashkentYearMonth(prevDate);

    const prevHasActivity = Object.values(data.devices || {}).some(d => {
      return (
        getTashkentYearMonth(new Date(d.firstSeen)) === prevYM ||
        getTashkentYearMonth(new Date(d.lastSeen)) === prevYM
      );
    });

    yearMonth = prevHasActivity ? prevYM : currentYM;
  }

  const monthName = formatMonthName(yearMonth);
  const totalVisits = data.monthlyVisits?.[yearMonth] || 0;

  const matchingIds = new Set(data.monthlyUniqueDevices?.[yearMonth] || []);
  const allDevices = Object.values(data.devices || {});

  for (const d of allDevices) {
    const firstSeenYM = getTashkentYearMonth(new Date(d.firstSeen));
    const lastSeenYM = getTashkentYearMonth(new Date(d.lastSeen));
    if (firstSeenYM === yearMonth || lastSeenYM === yearMonth) {
      matchingIds.add(d.id);
    }
  }

  const activeDevices = allDevices.filter(d => matchingIds.has(d.id));
  const uniqueCount = activeDevices.length > 0 ? activeDevices.length : matchingIds.size;

  const deviceTypes = { mobile: 0, desktop: 0, tablet: 0 };
  const osBreakdown = {};
  const browserBreakdown = {};

  for (const d of activeDevices) {
    if (d.deviceType === "mobile") deviceTypes.mobile++;
    else if (d.deviceType === "tablet") deviceTypes.tablet++;
    else deviceTypes.desktop++;

    const osKey = d.os || "Boshqa";
    osBreakdown[osKey] = (osBreakdown[osKey] || 0) + 1;

    const brKey = d.browser || "Boshqa";
    browserBreakdown[brKey] = (browserBreakdown[brKey] || 0) + 1;
  }

  let daysCount = 0;
  let peakDay = { date: "Mavjud emas", visits: 0 };
  for (const [dayStr, visits] of Object.entries(data.dailyVisits || {})) {
    if (dayStr.startsWith(yearMonth)) {
      daysCount++;
      if (visits > peakDay.visits) {
        peakDay = { date: dayStr, visits };
      }
    }
  }

  const effectiveDays = Math.max(daysCount, 1);
  const averageDailyVisits = Math.round((totalVisits || uniqueCount) / effectiveDays);

  const topOs = Object.entries(osBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      count,
      percentage: uniqueCount > 0 ? ((count / uniqueCount) * 100).toFixed(1) : "0",
    }));

  const topBrowsers = Object.entries(browserBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      count,
      percentage: uniqueCount > 0 ? ((count / uniqueCount) * 100).toFixed(1) : "0",
    }));

  return {
    yearMonth,
    monthName,
    uniqueDevices: uniqueCount,
    totalVisits: Math.max(totalVisits, uniqueCount),
    deviceTypes,
    topOs,
    topBrowsers,
    averageDailyVisits,
    peakDay,
  };
}

// Live stats formatting
function formatLiveMessage(stats) {
  if (!stats) return "⚠️ Hozircha statistika mavjud emas.";

  const total = stats.totalDevices;
  const visits = stats.totalVisits;
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
👥 <b>Jami noyob qurilmalar:</b> <code>${total}</code> ta
👁 <b>Jami sahifa ochilishlari:</b> <code>${visits}</code> ta
━━━━━━━━━━━━━━━━━━━━
📅 <b>Bugungi tashriflar:</b> <code>${stats.todayDevices}</code> ta qurilma (${stats.todayVisits} marta)
🗓 <b>Shu oyda kirganlar:</b> <code>${stats.thisMonthDevices}</code> ta qurilma (${stats.thisMonthVisits} marta)
📈 <b>So'nggi 7 kunda:</b> <code>${stats.past7DaysDevices}</code> ta qurilma

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

// Monthly report formatting
function formatMonthlyMessage(monthly) {
  if (!monthly) return "⚠️ Oylik hisobot ma'lumotlari topilmadi.";

  const total = monthly.uniqueDevices;
  const mob = monthly.deviceTypes.mobile;
  const desk = monthly.deviceTypes.desktop;
  const tab = monthly.deviceTypes.tablet;

  const mobPct = total > 0 ? ((mob / total) * 100).toFixed(1) : "0.0";
  const deskPct = total > 0 ? ((desk / total) * 100).toFixed(1) : "0.0";
  const tabPct = total > 0 ? ((tab / total) * 100).toFixed(1) : "0.0";

  const osList = monthly.topOs.map(o => `├ ${o.name}: <b>${o.count}</b> ta (${o.percentage}%)`).join("\n") || "├ Ma'lumot yo'q";
  const browserList = monthly.topBrowsers.map(b => `├ ${b.name}: <b>${b.count}</b> ta (${b.percentage}%)`).join("\n") || "├ Ma'lumot yo'q";

  return `🗓 <b>testingHub — Oylik Rasmiy Hisobot</b>
━━━━━━━━━━━━━━━━━━━━
📌 <b>Davr:</b> <b>${monthly.monthName}</b> (${monthly.yearMonth})

👥 <b>Oy davomida kirgan noyob qurilmalar:</b> <code>${monthly.uniqueDevices}</code> ta
👁 <b>Jami tashriflar (sahifa ko'rishlar):</b> <code>${monthly.totalVisits}</code> marta
⚡️ <b>O'rtacha kunlik tashriflar:</b> ~<code>${monthly.averageDailyVisits}</code> marta
🔥 <b>Eng faol kun:</b> ${monthly.peakDay.date} (<code>${monthly.peakDay.visits}</code> tashrif)

📱 <b>Foydalanuvchilar qurilmasi:</b>
├ 📱 <b>Mobile:</b> ${mob} ta (${mobPct}%)
├ 💻 <b>Desktop:</b> ${desk} ta (${deskPct}%)
└ 📟 <b>Tablet:</b> ${tab} ta (${tabPct}%)

💻 <b>Top Operatsion tizimlar:</b>
${osList}

🌐 <b>Top Brauzerlar:</b>
${browserList}
━━━━━━━━━━━━━━━━━━━━
✅ <i>Hisobot har oyning boshida avtomatik ravishda tayyorlanadi va testingHub ma'murlariga yetkaziladi.</i>`;
}

// Telegram API Helpers
async function sendMessage(chatId, text, replyMarkup) {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Xabar jo'natishda xatolik:", err.message);
    return null;
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

// Check and auto-send monthly report to TELEGRAM_CHAT_ID once a month
async function checkAndSendMonthlyReport() {
  if (!defaultChatId) return;

  const now = new Date();
  const todayStr = getTashkentDate(now);
  const dayOfMonth = parseInt(todayStr.split("-")[2], 10);

  // Send report during the first days of new month (day 1-3)
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const targetYearMonth = getTashkentYearMonth(prevDate);

  const data = loadData();
  if (!data) return;

  if (!data.monthlyReportsSent) data.monthlyReportsSent = {};

  if (!data.monthlyReportsSent[targetYearMonth]) {
    console.log(`[Auto Monthly Report] ${targetYearMonth} uchun avtomatik oylik hisobot yuborilmoqda...`);
    const monthlyStats = getMonthlyStats(targetYearMonth);
    const text = formatMonthlyMessage(monthlyStats);

    const res = await sendMessage(defaultChatId, text, {
      inline_keyboard: [
        [
          { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
          { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
        ],
      ],
    });

    if (res && res.ok) {
      data.monthlyReportsSent[targetYearMonth] = true;
      saveData(data);
      console.log(`✅ [Auto Monthly Report] ${targetYearMonth} hisoboti Telegramga muvaffaqiyatli yuborildi!`);
    }
  }
}

// Telegram Update Processing
async function processUpdate(update) {
  // 1. Callback query
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message?.chat?.id;
    const messageId = cb.message?.message_id;

    if (cb.data === "refresh_stats" && chatId && messageId) {
      await answerCallback(cb.id, "Statistika yangilanmoqda...");
      const stats = getLiveStats();
      const text = formatLiveMessage(stats);
      await editMessage(chatId, messageId, text, {
        inline_keyboard: [
          [
            { text: "🔄 Yangilash", callback_data: "refresh_stats" },
            { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
          ],
        ],
      });
      return;
    }

    if (cb.data === "monthly_stats" && chatId && messageId) {
      await answerCallback(cb.id, "Oylik hisobot tayyorlanmoqda...");
      const monthly = getMonthlyStats();
      const text = formatMonthlyMessage(monthly);
      await editMessage(chatId, messageId, text, {
        inline_keyboard: [
          [
            { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
            { text: "🔄 Yangilash", callback_data: "monthly_stats" },
          ],
        ],
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

  // Monthly stats
  if (
    lower.startsWith("/monthly") ||
    lower.startsWith("/month") ||
    lower === "oylik" ||
    lower === "oylik hisobot"
  ) {
    const monthly = getMonthlyStats();
    const replyText = formatMonthlyMessage(monthly);
    await sendMessage(chatId, replyText, {
      inline_keyboard: [
        [
          { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
          { text: "🔄 Yangilash", callback_data: "monthly_stats" },
        ],
      ],
    });
    return;
  }

  // Live stats
  if (
    lower.startsWith("/statistics") ||
    lower.startsWith("/stats") ||
    lower === "statistics" ||
    lower === "statistika"
  ) {
    const stats = getLiveStats();
    const replyText = formatLiveMessage(stats);
    await sendMessage(chatId, replyText, {
      inline_keyboard: [
        [
          { text: "🔄 Yangilash", callback_data: "refresh_stats" },
          { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
        ],
      ],
    });
    return;
  }

  // Help / Start
  if (lower.startsWith("/start") || lower.startsWith("/help")) {
    const welcome = `👋 <b>Assalomu alaykum!</b>

Men <b>testingHub</b> loyihasining monitoring botiman.

📌 <b>Buyruqlar:</b>
• /statistics — Saytga kirgan barcha qurilmalar va jami sahifa ochilishlari
• /monthly — O'tgan oy yakunlari va to'liq oylik tahlil
• /stats — Qisqartirilgan buyruq
• /help — Yordam

🔔 <i>Bot har oyning 1-sanasida oylik rasmiy hisobotni avtomatik ravishda testingHub guruhiga jo'natadi.</i>

Kerakli bo'limni tanlang:`;

    await sendMessage(chatId, welcome, {
      inline_keyboard: [
        [
          { text: "📊 Hozirgi statistika", callback_data: "refresh_stats" },
          { text: "🗓 Oylik hisobot", callback_data: "monthly_stats" },
        ],
      ],
    });
    return;
  }
}

// Long-polling loop
let offset = 0;

async function startPolling() {
  console.log("🚀 testingHub Telegram Bot ishga tushdi (@testingHubUzBot)");
  console.log("📡 Telegramdan yangilanishlar kutilmoqda... (/statistics yoki /monthly yuboring)");
  if (defaultChatId) {
    console.log(`🔔 Oylik hisobotlar yuboriladigan Chat ID: ${defaultChatId}\n`);
  }

  // Initial webhook cleanup
  try {
    await fetch(`${TELEGRAM_API}/deleteWebhook?drop_pending_updates=true`);
  } catch {}

  // Check monthly report on start
  await checkAndSendMonthlyReport();

  // Run periodic monthly check every 30 minutes
  setInterval(() => {
    checkAndSendMonthlyReport().catch(e => console.error("Monthly check error:", e.message));
  }, 30 * 60 * 1000);

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
