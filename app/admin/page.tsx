import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  getBookings,
  getBranches,
  getCategories,
  getGallery,
  getMenuItems,
  getPromotions,
} from "@/lib/store";

/** TỔNG QUAN — số liệu nhanh và lối tắt tới các mục hay dùng. */
export default async function AdminHome() {
  await requireAdmin();

  const [bookings, items, categories, promos, gallery, branches] =
    await Promise.all([
      getBookings(),
      getMenuItems(),
      getCategories(),
      getPromotions(),
      getGallery(),
      getBranches(),
    ]);

  const newBookings = bookings.filter((b) => b.status === "new");

  const stats = [
    { label: "Đơn đặt bàn mới", value: newBookings.length, href: "/admin/dat-ban", highlight: newBookings.length > 0 },
    { label: "Món trong thực đơn", value: items.length, href: "/admin/thuc-don" },
    { label: "Nhóm món", value: categories.length, href: "/admin/thuc-don" },
    { label: "Ưu đãi đang chạy", value: promos.filter((p) => p.published).length, href: "/admin/uu-dai" },
    { label: "Ảnh trong thư viện", value: gallery.length, href: "/admin/khong-gian" },
    { label: "Chi nhánh", value: branches.length, href: "/admin/chi-nhanh" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-900">Tổng quan</h1>
      <p className="mt-1 text-sm text-stone-600">
        Chào mừng trở lại. Mọi thay đổi bạn lưu ở đây sẽ hiện ra website ngay lập tức.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-lg border bg-white p-5 transition-colors hover:border-emerald-600 ${
              s.highlight ? "border-amber-500 bg-amber-50" : "border-stone-200"
            }`}
          >
            <p className="text-3xl font-bold text-stone-900">{s.value}</p>
            <p className="mt-1 text-sm text-stone-600">{s.label}</p>
          </Link>
        ))}
      </div>

      {newBookings.length > 0 ? (
        <section className="mt-9">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-500">
            Đơn đặt bàn chưa xử lý
          </h2>
          <ul className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
            {newBookings.slice(0, 5).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 text-sm">
                <span className="font-medium text-stone-900">{b.name}</span>
                <a href={`tel:${b.phone}`} className="text-emerald-800 hover:underline">
                  {b.phone}
                </a>
                <span className="text-stone-500">
                  {b.date} · {b.time} · {b.guests} người
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/dat-ban"
            className="mt-3 inline-block text-sm font-medium text-emerald-800 hover:underline"
          >
            Xem tất cả đơn →
          </Link>
        </section>
      ) : null}

      <section className="mt-10 rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
          Hướng dẫn nhanh
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-stone-700">
          <li>
            <strong>Đổi ảnh bìa, logo, hotline:</strong> vào{" "}
            <Link href="/admin/cai-dat" className="text-emerald-800 hover:underline">Cài đặt chung</Link>.
          </li>
          <li>
            <strong>Thêm món mới:</strong> vào{" "}
            <Link href="/admin/thuc-don" className="text-emerald-800 hover:underline">Thực đơn</Link>{" "}
            → bấm <em>+ Thêm mới</em> → điền tên, giá, ảnh → bấm <em>Lưu thay đổi</em>.
          </li>
          <li>
            <strong>Tải ảnh/video lên:</strong> ở mỗi ô ảnh, kéo thả file vào hoặc bấm{" "}
            <em>Chọn file</em>. File tối đa 25MB.
          </li>
          <li>
            <strong>Tạm ẩn thay vì xoá:</strong> bỏ tick <em>Đang chạy</em> (ưu đãi) hoặc{" "}
            <em>Còn phục vụ</em> (món ăn) — dữ liệu vẫn giữ nguyên.
          </li>
          <li>
            <strong>Song ngữ:</strong> mỗi ô chữ có hai khung Việt / Anh. Bỏ trống khung tiếng Anh
            thì website tự dùng bản tiếng Việt.
          </li>
        </ul>
      </section>
    </div>
  );
}
