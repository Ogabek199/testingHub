/**
 * TestingHub Form Formatting & Validation Utilities
 * Fully localized for UZ | RU | EN
 */

export type FormLanguage = "uz" | "ru" | "en";

/**
 * Format a person's name: Capitalize each word, remove numbers and disallowed symbols
 */
export function formatPersonName(value: string): string {
  // Allow letters (including Cyrillic, Uzbek o', g' characters), spaces, and apostrophes
  const cleaned = value.replace(/[^a-zA-Zа-яА-ЯёЁўЎқҚғҒҳҲ'\s-]/g, "");
  
  // Capitalize first letter of each word
  return cleaned.replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase());
}

/**
 * Validate person name with 3-language support
 */
export function validatePersonName(
  name: string,
  lang: FormLanguage = "uz"
): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Имя обязательно для заполнения"
          : lang === "en"
          ? "Name is required"
          : "Ism majburiy maydon",
    };
  }
  if (trimmed.length < 2) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Имя должно содержать минимум 2 буквы"
          : lang === "en"
          ? "Name must contain at least 2 letters"
          : "Ism kamida 2 ta harfdan iborat bo'lishi kerak",
    };
  }
  if (!/^[a-zA-Zа-яА-ЯёЁўЎқҚғҒҳҲ'\s-]+$/.test(trimmed)) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Имя может содержать только буквы"
          : lang === "en"
          ? "Name can contain only letters"
          : "Ismda faqat harflar ishlatilishi mumkin",
    };
  }
  return { isValid: true };
}

/**
 * Format phone number for Uzbekistan: +998 (XX) XXX-XX-XX
 */
export function formatPhoneNumber(value: string): string {
  if (!value || !value.trim()) return "";

  const clean = value.trim();
  if (clean === "+" || clean === "+9" || clean === "+99" || clean === "+998") {
    return "";
  }

  const digits = clean.replace(/\D/g, "");
  if (!digits) return "";

  let local = digits;
  if (local.startsWith("998")) {
    local = local.substring(3);
  }

  // If user only had 998 and no local digits, allow clearing
  if (local.length === 0) {
    return "";
  }

  local = local.substring(0, 9);

  let res = "+998";
  if (local.length > 0) {
    res += ` (${local.substring(0, 2)}`;
  }
  if (local.length >= 2) {
    res += ")";
  }
  if (local.length >= 3) {
    res += ` ${local.substring(2, 5)}`;
  }
  if (local.length >= 6) {
    res += `-${local.substring(5, 7)}`;
  }
  if (local.length >= 8) {
    res += `-${local.substring(7, 9)}`;
  }

  return res;
}

/**
 * Validate phone number with 3-language support
 */
export function validatePhoneNumber(
  phone: string,
  lang: FormLanguage = "uz"
): { isValid: boolean; error?: string } {
  const digits = phone.replace(/\D/g, "");
  if (!digits || digits === "998") {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Номер телефона обязателен для заполнения"
          : lang === "en"
          ? "Phone number is required"
          : "Telefon raqamini kiritish majburiy",
    };
  }

  let local = digits;
  if (local.startsWith("998")) {
    local = local.substring(3);
  }

  if (local.length < 9) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? `Номер телефона не полный (${local.length}/9 цифр). Укажите полностью: +998 (XX) XXX-XX-XX`
          : lang === "en"
          ? `Phone number is incomplete (${local.length}/9 digits). Please enter: +998 (XX) XXX-XX-XX`
          : `Telefon raqami to'liq emas (${local.length}/9 raqam). To'liq kiriting: +998 (XX) XXX-XX-XX`,
    };
  }

  return { isValid: true };
}

/**
 * Format email: lowercase and trimmed
 */
export function formatEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Validate email address with 3-language support
 */
export function validateEmail(
  email: string,
  required: boolean = false,
  lang: FormLanguage = "uz"
): { isValid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    if (required) {
      return {
        isValid: false,
        error:
          lang === "ru"
            ? "Электронная почта обязательна"
            : lang === "en"
            ? "Email address is required"
            : "Elektron pochta manzili majburiy",
      };
    }
    return { isValid: true };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Неверный формат email (например: client@company.com)"
          : lang === "en"
          ? "Invalid email format (e.g. client@company.com)"
          : "Elektron pochta formati noto'g'ri (masalan: misol@domain.uz)",
    };
  }

  return { isValid: true };
}

/**
 * Format Telegram username: always ensure single '@' prefix
 */
export function formatTelegramUsername(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const cleaned = trimmed.replace(/[^a-zA-Z0-9_@]/g, "");
  const withoutAts = cleaned.replace(/^@+/, "");
  return withoutAts ? `@${withoutAts}` : "@";
}

/**
 * Validate Telegram username with 3-language support
 */
export function validateTelegramUsername(
  tg: string,
  required: boolean = false,
  lang: FormLanguage = "uz"
): { isValid: boolean; error?: string } {
  const trimmed = tg.trim();
  if (!trimmed || trimmed === "@") {
    if (required) {
      return {
        isValid: false,
        error:
          lang === "ru"
            ? "Telegram профиль обязателен"
            : lang === "en"
            ? "Telegram username is required"
            : "Telegram profilini kiritish majburiy",
      };
    }
    return { isValid: true };
  }

  const withoutAt = trimmed.replace(/^@/, "");
  if (withoutAt.length < 4) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Имя пользователя Telegram должно быть не менее 4 символов"
          : lang === "en"
          ? "Telegram username must be at least 4 characters"
          : "Telegram username kamida 4 ta belgidan iborat bo'lishi kerak",
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(withoutAt)) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Разрешены только латинские буквы, цифры и _"
          : lang === "en"
          ? "Only latin letters, numbers, and _ are allowed"
          : "Faqat lotin harflari, raqamlar va _ belgisi ruxsat etilgan",
    };
  }

  return { isValid: true };
}

/**
 * Format Company name
 */
export function formatCompanyName(value: string): string {
  return value.slice(0, 100);
}

/**
 * Validate Company name
 */
export function validateCompanyName(
  company: string,
  required: boolean = false,
  lang: FormLanguage = "uz"
): { isValid: boolean; error?: string } {
  const trimmed = company.trim();
  if (!trimmed && required) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Название компании обязательно"
          : lang === "en"
          ? "Company name is required"
          : "Kompaniya nomini kiritish majburiy",
    };
  }
  return { isValid: true };
}

/**
 * Format Comment / Project details
 */
export function formatComment(value: string): string {
  return value.slice(0, 1000);
}

/**
 * Validate Comment
 */
export function validateComment(
  comment: string,
  required: boolean = false,
  lang: FormLanguage = "uz"
): { isValid: boolean; error?: string } {
  const trimmed = comment.trim();
  if (!trimmed && required) {
    return {
      isValid: false,
      error:
        lang === "ru"
          ? "Описание проекта обязательно"
          : lang === "en"
          ? "Project description is required"
          : "Loyiha haqida qisqacha ma'lumot kiritish majburiy",
    };
  }
  return { isValid: true };
}
