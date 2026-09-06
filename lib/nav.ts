import type { Dictionary } from "./i18n";
import type { Locale } from "./types";

/** Danh sách mục điều hướng dùng chung cho header và footer. */
export function buildNav(dict: Dictionary, locale: Locale) {
  const p = (path: string) => `/${locale}${path}`;
  return [
    { label: dict.nav.home, href: p("") || `/${locale}` },
    { label: dict.nav.about, href: p("/gioi-thieu") },
    { label: dict.nav.menu, href: p("/thuc-don") },
    { label: dict.nav.gallery, href: p("/khong-gian") },
    { label: dict.nav.promotions, href: p("/uu-dai") },
    { label: dict.nav.branches, href: p("/chi-nhanh") },
    { label: dict.nav.contact, href: p("/lien-he") },
  ];
}
