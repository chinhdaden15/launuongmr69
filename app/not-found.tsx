import Link from "next/link";

/** Trang 404 — hiện khi khách vào một đường dẫn không tồn tại. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-forest px-6 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl text-cream sm:text-3xl">
        Không tìm thấy trang
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
        Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Mời bạn quay lại
        trang chủ nhé.
      </p>
      <Link
        href="/vi"
        className="mt-8 rounded-full bg-cream px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-forest transition-colors hover:bg-gold"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
