import { NextResponse, type NextRequest } from "next/server";
import { AN_ADMIN } from "@/lib/env";

const LOCALES = ["vi", "en"];
const DEFAULT_LOCALE = "vi";

/**
 * Lớp chạy trước mọi trang, làm hai việc:
 *
 * 1. Ẩn trang quản trị trên bản đưa lên mạng (xem AN_ADMIN trong lib/env.ts).
 *    Trả về đúng trang "không tìm thấy" như gõ sai địa chỉ, để người lạ không
 *    biết là website có trang quản trị mà đi dò mật khẩu.
 *
 * 2. Thêm tiền tố ngôn ngữ vào đường dẫn: "/thuc-don" -> "/vi/thuc-don".
 *
 * (Next.js 16 gọi lớp này là "proxy"; các bản trước gọi là "middleware".)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Chặn trang quản trị và phần tải ảnh lên ---
  const laTrangQuanTri =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/upload";

  if (laTrangQuanTri) {
    if (!AN_ADMIN) return NextResponse.next();
    // Chuyển sang một đường dẫn không tồn tại để Next.js dựng trang 404 thật,
    // kèm đúng mã 404 — nhìn y hệt như gõ nhầm địa chỉ bất kỳ.
    return NextResponse.rewrite(new URL("/vi/trang-khong-ton-tai", request.url));
  }

  // --- 2. Thêm tiền tố ngôn ngữ ---
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
    // Mọi đường dẫn TRỪ: API (trừ /api/upload xử lý riêng ở dưới), tài nguyên
    // nội bộ của Next, thư mục uploads và các file có phần mở rộng.
    "/((?!api|_next|uploads|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    "/api/upload",
  ],
};
