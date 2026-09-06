import type { MetadataRoute } from "next";

/** Cho phép Google lập chỉ mục toàn bộ website, trừ trang quản trị. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: "https://launuongmr69.com/sitemap.xml",
  };
}
