import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["vi", "en"];
const DEFAULT_LOCALE = "vi";

/**
 * Thêm tiền tố ngôn ngữ vào đường dẫn: "/thuc-don" -> "/vi/thuc-don".
 * Bỏ qua trang admin, API và file tĩnh.
 *
 * (Next.js 16 gọi lớp này là "proxy"; các bản trước gọi là "middleware".)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Chạy trên mọi đường dẫn TRỪ: admin, api, tài nguyên nội bộ của Next,
    // thư mục uploads và các file có phần mở rộng (ảnh, ico, txt...).
    "/((?!admin|api|_next|uploads|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
