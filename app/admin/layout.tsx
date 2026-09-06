import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";
import { CHI_XEM } from "@/lib/env";
import { NutDeploy } from "@/components/admin/NutDeploy";
import { logoutAction } from "./actions";

export const metadata = { title: "Quản trị Mr.69" };

const MENU = [
  { href: "/admin", label: "Tổng quan", icon: "▦" },
  { href: "/admin/dat-ban", label: "Đơn đặt bàn", icon: "✉" },
  { href: "/admin/thuc-don", label: "Thực đơn", icon: "🍲" },
  { href: "/admin/uu-dai", label: "Ưu đãi & Combo", icon: "★" },
  { href: "/admin/khong-gian", label: "Thư viện ảnh", icon: "▣" },
  { href: "/admin/chi-nhanh", label: "Chi nhánh", icon: "◉" },
  { href: "/admin/cai-dat", label: "Cài đặt chung", icon: "⚙" },
];

/**
 * Khung trang quản trị: thanh bên trái + vùng nội dung.
 *
 * Khi chưa đăng nhập, khung này lùi lại và chỉ hiện nội dung trần —
 * đủ cho trang đăng nhập. Mỗi trang bên trong tự gọi requireAdmin()
 * nên không có đường nào lọt vào mà không qua mật khẩu.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isLoggedIn())) {
    return (
      <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        {/* Thanh bên */}
        <aside className="shrink-0 border-b border-stone-200 bg-white lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r">
          <div className="px-5 py-5">
            <p className="text-lg font-bold tracking-tight">Mr.69</p>
            <p className="text-[11px] uppercase tracking-widest text-stone-400">
              Trang quản trị
            </p>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
              >
                <span aria-hidden className="w-4 text-center text-stone-400">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Nút tạm để đẩy nội dung lên Vercel — chỉ hiện khi chạy trên máy.
              Bỏ đi khi đã chuyển dữ liệu sang Supabase. */}
          {!CHI_XEM ? <NutDeploy /> : null}

          <div className="hidden border-t border-stone-200 px-3 py-4 lg:block">
            <Link
              href="/vi"
              target="_blank"
              className="block rounded px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
            >
              ↗ Xem website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded px-3 py-2 text-left text-sm text-stone-600 hover:bg-stone-100"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-7 lg:px-9 lg:py-10">
          {CHI_XEM ? (
            <div className="mb-7 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900">
                Đây là bản đang chạy trên mạng — chỉ xem, không lưu được
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80">
                Máy chủ Vercel không cho ghi file, nên bấm Lưu sẽ không ăn. Muốn
                sửa nội dung thì mở dự án ở máy mình, sửa trong trang admin ở đó
                rồi đưa lên lại. Nếu muốn sửa được trực tiếp trên mạng thì cần
                chuyển dữ liệu sang Supabase.
              </p>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
