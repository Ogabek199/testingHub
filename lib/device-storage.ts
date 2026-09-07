import fs from "fs/promises";
import path from "path";

export interface DeviceRecord {
  id: string;
  deviceType: "mobile" | "desktop" | "tablet";
  os: string;
  browser: string;
  screenResolution?: string;
  language?: string;
  ip?: string;
  firstSeen: string; // ISO
  lastSeen: string;  // ISO
  visitCount: number;
}

export interface VisitorStats {
  totalDevices: number;
  todayDevices: number;
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

interface StorageSchema {
  devices: Record<string, DeviceRecord>;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitor_devices.json");

// In-memory cache for fast read/write
let memoryCache: StorageSchema | null = null;
let writeQueue: Promise<void> = Promise.resolve();

/**
 * Ensure storage directory and file exist, then load to cache
 */
async function loadStorage(): Promise<StorageSchema> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf-8");
    memoryCache = JSON.parse(content);
    return memoryCache!;
  } catch {
    // If file doesn't exist or is invalid, initialize fresh
    memoryCache = {
      devices: {},
      createdAt: new Date().toISOString(),
    };
    await persistStorage(memoryCache);
    return memoryCache;
  }
}

/**
 * Persist cache safely to disk
 */
async function persistStorage(data: StorageSchema): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
      await fs.writeFile(tempFile, JSON.stringify(data, null, 2), "utf-8");
      await fs.rename(tempFile, DATA_FILE);
    } catch (err) {
      console.error("[DeviceStorage] Failed to persist storage:", err);
    }
  });
  return writeQueue;
}

/**
 * Parse User-Agent into Device Type, OS, and Browser
 */
export function parseUserAgent(ua: string = ""): {
  deviceType: "mobile" | "desktop" | "tablet";
  os: string;
  browser: string;
} {
  // 1. Device Type
  let deviceType: "mobile" | "desktop" | "tablet" = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = "tablet";
  } else if (
    /mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop|android/i.test(
      ua
    )
  ) {
    deviceType = "mobile";
  }

  // 2. OS Detection
  let os = "Boshqa";
  if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/windows nt/i.test(ua)) {
    os = "Windows";
  } else if (/mac os x/i.test(ua) || /macintosh/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // 3. Browser Detection
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
 * Record or update a device visit
 */
export async function recordDeviceVisit(input: {
  deviceId?: string;
  userAgent?: string;
  screenResolution?: string;
  language?: string;
  ip?: string;
}): Promise<{ deviceId: string; isNew: boolean; totalCount: number }> {
  const storage = await loadStorage();
  const now = new Date().toISOString();

  let deviceId = input.deviceId?.trim();
  const isNew = !deviceId || !storage.devices[deviceId];

  if (!deviceId || isNew) {
    // Generate new unique device ID
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
      firstSeen: now,
      lastSeen: now,
      visitCount: 1,
    };
  } else {
    const existing = storage.devices[deviceId];
    existing.lastSeen = now;
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

  await persistStorage(storage);

  return {
    deviceId,
    isNew,
    totalCount: Object.keys(storage.devices).length,
  };
}

/**
 * Get aggregated statistics for visitor devices
 */
export async function getDeviceStats(): Promise<VisitorStats> {
  const storage = await loadStorage();
  const devices = Object.values(storage.devices);

  const now = new Date();
  const todayStr = getTashkentDateString(now);

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let todayCount = 0;
  let past7DaysCount = 0;

  const deviceTypes = {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  };

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

    // Time-based calculations (Tashkent timezone)
    const lastSeenDate = new Date(d.lastSeen);
    const lastSeenStr = getTashkentDateString(lastSeenDate);

    if (lastSeenStr === todayStr) {
      todayCount++;
    }

    if (lastSeenDate >= sevenDaysAgo) {
      past7DaysCount++;
    }
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
}

/**
 * Format stats into a beautiful Telegram message
 */
export function formatTelegramStatsMessage(stats: VisitorStats): string {
  const total = stats.totalDevices || 0;
  const mob = stats.deviceTypes.mobile;
  const desk = stats.deviceTypes.desktop;
  const tab = stats.deviceTypes.tablet;

  const mobPct = total > 0 ? ((mob / total) * 100).toFixed(1) : "0.0";
  const deskPct = total > 0 ? ((desk / total) * 100).toFixed(1) : "0.0";
  const tabPct = total > 0 ? ((tab / total) * 100).toFixed(1) : "0.0";

  // Top OS list
  const topOs = Object.entries(stats.osBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([os, count]) => `${os}: ${count}`)
    .join(" | ") || "Mavjud emas";

  // Top Browsers list
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

function getTashkentDateString(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" }); // YYYY-MM-DD
}

function maskIp(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.slice(0, 8) + "***";
}
