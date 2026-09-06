import type { Bilingual, Locale } from "./types";
import vi from "@/messages/vi.json";
import en from "@/messages/en.json";

export const LOCALES = ["vi", "en"] as const;
export const DEFAULT_LOCALE: Locale = "vi";

const dictionaries = { vi, en } as const;
export type Dictionary = typeof vi;

export function isLocale(v: string | undefined): v is Locale {
  return v === "vi" || v === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

/** Lấy đúng ngôn ngữ từ một trường song ngữ; tự lùi về tiếng Việt nếu bản dịch còn trống. */
export function t(field: Bilingual | undefined, locale: Locale): string {
  if (!field) return "";
  const value = field[locale];
  return value && value.trim() ? value : field.vi;
}

/** 359000 -> "359.000đ" */
export function formatPrice(price: number, locale: Locale): string {
  if (!price) return locale === "vi" ? "Theo thời giá" : "Market price";
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

/** Ghép đường dẫn có tiền tố ngôn ngữ: ("/thuc-don", "en") -> "/en/thuc-don" */
export function localePath(href: string, locale: Locale): string {
  if (href.startsWith("http") || href.startsWith("#")) return href;
  return `/${locale}${href === "/" ? "" : href}`;
}
