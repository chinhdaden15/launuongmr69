import type { MetadataRoute } from "next";
import { getPromotions } from "@/lib/store";

const BASE = "https://launuongmr69.com";
const LOCALES = ["vi", "en"] as const;
const PAGES = [
  "", "/gioi-thieu", "/thuc-don", "/khong-gian",
  "/uu-dai", "/chi-nhanh", "/dat-ban", "/lien-he",
];

/** Sơ đồ website để Google tìm thấy đủ các trang. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const promos = await getPromotions({ publishedOnly: true });
  const now = new Date();

  const staticPages = LOCALES.flatMap((locale) =>
    PAGES.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );

  const promoPages = LOCALES.flatMap((locale) =>
    promos.map((p) => ({
      url: `${BASE}/${locale}/uu-dai/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...promoPages];
}
