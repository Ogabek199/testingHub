import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export interface DeviceRecord {
  id: string;
  deviceType: "mobile" | "desktop" | "tablet";
  os: string;
  browser: string;
  screenResolution?: string;
  language?: string;
  ip?: string;
  firstSeen: string; // ISO string
  lastSeen: string;  // ISO string
  visitCount: number;
}

export interface VisitorStats {
  totalDevices: number;
  totalVisits: number;
  todayDevices: number;
  todayVisits: number;
  thisMonthDevices: number;
  thisMonthVisits: number;
  past7DaysDevices: number;
  deviceTypes: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  osBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  lastUpdated: string;
}

export interface MonthlyStats {
  yearMonth: string; // "YYYY-MM"
  monthName: string; // Masalan: "Avgust 2026"
  uniqueDevices: number;
  totalVisits: number;
  deviceTypes: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topOs: Array<{ name: string; count: number; percentage: string }>;
  topBrowsers: Array<{ name: string; count: number; percentage: string }>;
  averageDailyVisits: number;
  peakDay: { date: string; visits: number };
}

interface StorageSchema {
  devices: Record<string, DeviceRecord>;
  totalVisits?: number;
  dailyVisits?: Record<string, number>; // "YYYY-MM-DD" -> visits
  monthlyVisits?: Record<string, number>; // "YYYY-MM" -> visits
  monthlyUniqueDevices?: Record<string, string[]>; // "YYYY-MM" -> array of deviceIds
  monthlyReportsSent?: Record<string, boolean>; // "YYYY-MM" -> boolean
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitor_devices.json");

let memoryCache: StorageSchema | null = null;
let lastFileMtime: number = 0;
let writePromise: Promise<void> = Promise.resolve();

/**
 * Get current Tashkent date string (YYYY-MM-DD)
 */
export function getTashkentDateString(d: Date = new Date()): string {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
}

/**
 * Get current Tashkent Year-Month string (YYYY-MM)
 */
export function getTashkentYearMonth(d: Date = new Date()): string {
  const dateStr = getTashkentDateString(d);
  return dateStr.slice(0, 7);
}

/**
 * Month names in Uzbek
 */
const UZBEK_MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

export function formatUzbekMonthName(yearMonth: string): string {
  const [year, monthStr] = yearMonth.split("-");
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = UZBEK_MONTHS[monthIdx] || monthStr;
  return `${year}-yil ${monthName} oyi`;
}

/**
 * Load storage safely with automatic file modification detection
 */
async function loadStorage(): Promise<StorageSchema> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    if (fsSync.existsSync(DATA_FILE)) {
      const stats = await fs.stat(DATA_FILE);
      // If file has been modified externally or cache is empty, re-read
      if (!memoryCache || stats.mtimeMs > lastFileMtime) {
        const content = await fs.readFile(DATA_FILE, "utf-8");
        memoryCache = JSON.parse(content);
        lastFileMtime = stats.mtimeMs;
      }
    } else {
      memoryCache = {
        devices: {},
        totalVisits: 0,
        dailyVisits: {},
        monthlyVisits: {},
        monthlyUniqueDevices: {},
        monthlyReportsSent: {},
        createdAt: new Date().toISOString(),
      };
      await persistStorage(memoryCache);
    }
  } catch (err) {
    console.error("[DeviceStorage] Error loading storage:", err);
  }

  if (!memoryCache) {
    memoryCache = {
      devices: {},
      totalVisits: 0,
      dailyVisits: {},
      monthlyVisits: {},
      monthlyUniqueDevices: {},
      monthlyReportsSent: {},
      createdAt: new Date().toISOString(),
    };
  }

  const cache = memoryCache;

  // Ensure all schema objects exist
  if (!cache.devices) cache.devices = {};
  if (!cache.dailyVisits) cache.dailyVisits = {};
  if (!cache.monthlyVisits) cache.monthlyVisits = {};
  if (!cache.monthlyUniqueDevices) cache.monthlyUniqueDevices = {};
  if (!cache.monthlyReportsSent) cache.monthlyReportsSent = {};
  if (typeof cache.totalVisits !== "number") {
    cache.totalVisits = Object.values(cache.devices).reduce(
      (sum, d) => sum + (d.visitCount || 1),
      0
    );
  }

  return cache;
}

/**
 * Persist cache safely and atomically to disk
 */
async function persistStorage(data: StorageSchema): Promise<void> {
  writePromise = writePromise.then(async () => {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tempFile = `${DATA_FILE}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
      const payload = JSON.stringify(data, null, 2);
      await fs.writeFile(tempFile, payload, "utf-8");
      await fs.rename(tempFile, DATA_FILE);
      const stat = await fs.stat(DATA_FILE);
      lastFileMtime = stat.mtimeMs;
    } catch (err) {
      console.error("[DeviceStorage] Failed to persist storage:", err);
    }
  });
  return writePromise;
}

/**
 * Parse User-Agent into Device Type, OS, and Browser
 */
export function parseUserAgent(ua: string = ""): {
  deviceType: "mobile" | "desktop" | "tablet";
  os: string;
  browser: string;
} {
  let deviceType: "mobile" | "desktop" | "tablet" = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = "tablet";
  } else if (
    /mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop|android/i.test(ua)
  ) {
    deviceType = "mobile";
  }

  let os = "Boshqa";
  if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/windows nt/i.test(ua)) {
    os = "Windows";
  } else if (/mac os x|macintosh/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  let browser = "Boshqa";
  if (/edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/samsungbrowser/i.test(ua)) {
    browser = "Samsung Internet";
  } else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  return { deviceType, os, browser };
}

/**
 * Record a visit and update analytics accurately
 */
export async function recordDeviceVisit(input: {
  deviceId?: string;
  userAgent?: string;
  screenResolution?: string;
  language?: string;
  ip?: string;
}): Promise<{ deviceId: string; isNew: boolean; totalDevices: number; totalVisits: number }> {
  const storage = await loadStorage();
  const now = new Date();
  const nowIso = now.toISOString();
  const todayStr = getTashkentDateString(now);
  const currentMonth = getTashkentYearMonth(now);

  let deviceId = input.deviceId?.trim();
  const isNew = !deviceId || !storage.devices[deviceId];

  if (!deviceId || isNew) {
    deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  const { deviceType, os, browser } = parseUserAgent(input.userAgent || "");

  if (isNew) {
    storage.devices[deviceId] = {
      id: deviceId,
      deviceType,
      os,
      browser,
      screenResolution: input.screenResolution || "",
      language: input.language || "uz",
      ip: input.ip ? maskIp(input.ip) : undefined,
      firstSeen: nowIso,
      lastSeen: nowIso,
      visitCount: 1,
    };
  } else {
    const existing = storage.devices[deviceId];
    existing.lastSeen = nowIso;
    existing.visitCount = (existing.visitCount || 1) + 1;
    if (input.screenResolution && !existing.screenResolution) {
      existing.screenResolution = input.screenResolution;
    }
    if (input.language) existing.language = input.language;
    if (input.ip) existing.ip = maskIp(input.ip);
    if (existing.browser === "Boshqa" && browser !== "Boshqa") {
      existing.browser = browser;
    }
  }

  // Increment aggregate visit counters
  storage.totalVisits = (storage.totalVisits || 0) + 1;
  storage.dailyVisits![todayStr] = (storage.dailyVisits![todayStr] || 0) + 1;
  storage.monthlyVisits![currentMonth] = (storage.monthlyVisits![currentMonth] || 0) + 1;

  // Track unique devices for current month
  if (!storage.monthlyUniqueDevices![currentMonth]) {
    storage.monthlyUniqueDevices![currentMonth] = [];
  }
  if (!storage.monthlyUniqueDevices![currentMonth].includes(deviceId)) {
    storage.monthlyUniqueDevices![currentMonth].push(deviceId);
  }

  await persistStorage(storage);

  return {
    deviceId,
    isNew,
    totalDevices: Object.keys(storage.devices).length,
    totalVisits: storage.totalVisits,
  };
}

/**
 * Get aggregated statistics for visitor devices and site visits
 */
export async function getDeviceStats(): Promise<VisitorStats> {
  const storage = await loadStorage();
  const devices = Object.values(storage.devices);

  const now = new Date();
  const todayStr = getTashkentDateString(now);
  const currentMonth = getTashkentYearMonth(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let todayDevices = 0;
  let past7DaysDevices = 0;

  const deviceTypes = { mobile: 0, desktop: 0, tablet: 0 };
  const osBreakdown: Record<string, number> = {};
  const browserBreakdown: Record<string, number> = {};

  for (const d of devices) {
    // Type counts
    if (d.deviceType === "mobile") deviceTypes.mobile++;
    else if (d.deviceType === "tablet") deviceTypes.tablet++;
    else deviceTypes.desktop++;

    // OS counts
    const osKey = d.os || "Boshqa";
    osBreakdown[osKey] = (osBreakdown[osKey] || 0) + 1;

    // Browser counts
    const brKey = d.browser || "Boshqa";
    browserBreakdown[brKey] = (browserBreakdown[brKey] || 0) + 1;

    // Last seen dates
    const lastSeenDate = new Date(d.lastSeen);
    const lastSeenStr = getTashkentDateString(lastSeenDate);

    if (lastSeenStr === todayStr) {
      todayDevices++;
    }

    if (lastSeenDate >= sevenDaysAgo) {
      past7DaysDevices++;
    }
  }

  const thisMonthUnique = storage.monthlyUniqueDevices?.[currentMonth]?.length || 
    devices.filter(d => getTashkentYearMonth(new Date(d.lastSeen)) === currentMonth).length;

  const thisMonthVisits = storage.monthlyVisits?.[currentMonth] || 0;
  const todayVisits = storage.dailyVisits?.[todayStr] || todayDevices;

  return {
    totalDevices: devices.length,
    totalVisits: storage.totalVisits || devices.reduce((acc, d) => acc + (d.visitCount || 1), 0),
    todayDevices,
    todayVisits,
    thisMonthDevices: thisMonthUnique,
    thisMonthVisits,
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

/**
 * Calculate Monthly Statistics for a given month or the previous month
 */
export async function getMonthlyStats(targetYearMonth?: string): Promise<MonthlyStats> {
  const storage = await loadStorage();
  const now = new Date();

  // If not specified, check previous month; if empty, use current month
  let yearMonth = targetYearMonth;
  if (!yearMonth) {
    const currentYM = getTashkentYearMonth(now);
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYM = getTashkentYearMonth(prevMonthDate);

    const prevHasActivity = Object.values(storage.devices).some(d => {
      return (
        getTashkentYearMonth(new Date(d.firstSeen)) === prevYM ||
        getTashkentYearMonth(new Date(d.lastSeen)) === prevYM
      );
    });

    yearMonth = prevHasActivity ? prevYM : currentYM;
  }

  const monthName = formatUzbekMonthName(yearMonth);
  const totalVisits = storage.monthlyVisits?.[yearMonth] || 0;

  // Filter devices seen in that month
  const matchingDeviceIds = new Set<string>(storage.monthlyUniqueDevices?.[yearMonth] || []);
  const allDevices = Object.values(storage.devices);

  for (const d of allDevices) {
    const firstSeenYM = getTashkentYearMonth(new Date(d.firstSeen));
    const lastSeenYM = getTashkentYearMonth(new Date(d.lastSeen));
    if (firstSeenYM === yearMonth || lastSeenYM === yearMonth) {
      matchingDeviceIds.add(d.id);
    }
  }

  const activeDevices = allDevices.filter(d => matchingDeviceIds.has(d.id));
  const uniqueCount = activeDevices.length > 0 ? activeDevices.length : (matchingDeviceIds.size || 0);

  const deviceTypes = { mobile: 0, desktop: 0, tablet: 0 };
  const osBreakdown: Record<string, number> = {};
  const browserBreakdown: Record<string, number> = {};

  for (const d of activeDevices) {
    if (d.deviceType === "mobile") deviceTypes.mobile++;
    else if (d.deviceType === "tablet") deviceTypes.tablet++;
    else deviceTypes.desktop++;

    const osKey = d.os || "Boshqa";
    osBreakdown[osKey] = (osBreakdown[osKey] || 0) + 1;

    const brKey = d.browser || "Boshqa";
    browserBreakdown[brKey] = (browserBreakdown[brKey] || 0) + 1;
  }

  // Daily visits in this month to find peak day & average
  let daysCount = 0;
  let peakDay = { date: "Mavjud emas", visits: 0 };
  for (const [dayStr, visits] of Object.entries(storage.dailyVisits || {})) {
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

/**
 * Check if monthly report has been dispatched to Telegram
 */
export async function isMonthlyReportSent(yearMonth: string): Promise<boolean> {
  const storage = await loadStorage();
  return Boolean(storage.monthlyReportsSent?.[yearMonth]);
}

/**
 * Mark monthly report as sent to avoid repeated messages
 */
export async function markMonthlyReportSent(yearMonth: string): Promise<void> {
  const storage = await loadStorage();
  if (!storage.monthlyReportsSent) {
    storage.monthlyReportsSent = {};
  }
  storage.monthlyReportsSent[yearMonth] = true;
  await persistStorage(storage);
}

/**
 * Format live stats into a beautiful Telegram message
 */
export function formatTelegramStatsMessage(stats: VisitorStats): string {
  const total = stats.totalDevices || 0;
  const visits = stats.totalVisits || 0;
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

/**
 * Format monthly summary report for Telegram
 */
export function formatMonthlyTelegramStatsMessage(monthly: MonthlyStats): string {
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

function maskIp(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.slice(0, 8) + "***";
}
