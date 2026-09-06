"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import type { Locale } from "@/lib/types";

export type NavItem = { label: string; href: string };

/**
 * MỤC 1 — THANH ĐIỀU HƯỚNG
 * Máy tính: menu chia hai bên, logo ở giữa (giống trang tham khảo).
 * Điện thoại: logo trái, nút ba gạch phải, menu trượt toàn màn hình.
 * Nền trong suốt khi ở đầu trang, chuyển sang nền đặc khi cuộn xuống.
 */
export function Header({
  nav,
  logo,
  brandName,
  bookLabel,
  locale,
}: {
  nav: NavItem[];
  logo: string;
  brandName: string;
  bookLabel: string;
  locale: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu khi chuyển sang trang khác. So sánh ngay lúc render thay vì
  // dùng useEffect để tránh một lượt vẽ thừa (menu nhấp nháy khi đổi trang).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Khoá cuộn nền khi menu điện thoại đang mở.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const half = Math.ceil(nav.length / 2);
  const left = nav.slice(0, half);
  const right = nav.slice(half);
  const otherLocale: Locale = locale === "vi" ? "en" : "vi";
  const switchHref = `/${otherLocale}${pathname.replace(/^\/(vi|en)/, "")}`;

  /**
   * Bấm vào một mục mà mình đang đứng sẵn ở đó (logo khi đang ở trang chủ,
   * "Trang chủ" khi đang ở trang chủ...) thì trình duyệt chẳng làm gì cả, khách
   * tưởng nút hỏng. Trường hợp đó ta cuộn lên đầu trang cho họ.
   */
  const veDauTrang = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href) return; // sang trang khác — để Next.js lo
    e.preventDefault();
    setOpen(false); // đóng menu điện thoại nếu đang mở
    // Không ghi behavior để dùng theo cài đặt scroll-behavior trong globals.css,
    // nhờ vậy máy nào bật "giảm chuyển động" thì nhảy thẳng, không cuộn mượt.
    window.scrollTo({ top: 0 });
  };

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href));

  const linkCls = (href: string) =>
    `whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.11em] transition-colors xl:text-[13px] xl:tracking-[0.13em] ${
      isActive(href) ? "text-gold" : "text-cream/85 hover:text-gold"
    }`;

  return (
    <header
      // Nền xanh đặc ở mọi lúc — không dùng lớp mờ, để chữ luôn rõ.
      // Khi cuộn xuống thì thêm bóng đổ cho tách khỏi nội dung bên dưới.
      className={`fixed inset-x-0 top-0 z-50 bg-forest transition-shadow duration-300 ${
        scrolled || open ? "shadow-lg shadow-forest/35" : ""
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1560px] items-center justify-between gap-4 px-5 sm:px-8 lg:h-[92px]">
        {/* --- Máy tính: nửa menu bên trái --- */}
        <nav className="hidden flex-1 items-center gap-4 lg:flex xl:gap-7" aria-label="Chính">
          {left.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => veDauTrang(e, item.href)}
              className={linkCls(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* --- Logo --- */}
        <Link
          href={`/${locale}`}
          onClick={(e) => veDauTrang(e, `/${locale}`)}
          className="shrink-0 lg:mx-6"
          aria-label={brandName}
        >
          <Image
            src={logo}
            alt={brandName}
            width={150}
            height={60}
            priority
            className="h-11 w-auto lg:h-14"
          />
        </Link>

        {/* --- Máy tính: nửa menu bên phải + nút đặt bàn --- */}
        <div className="hidden flex-1 items-center justify-end gap-4 lg:flex xl:gap-7">
          {right.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => veDauTrang(e, item.href)}
              className={linkCls(item.href)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={switchHref}
            className="ml-1 shrink-0 rounded-full border border-cream/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-cream/80 transition-colors hover:border-gold hover:text-gold"
          >
            {otherLocale}
          </Link>
          <Link
            href={`/${locale}/dat-ban`}
            onClick={(e) => veDauTrang(e, `/${locale}/dat-ban`)}
            className="shrink-0 whitespace-nowrap rounded-full bg-cream px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest transition-colors hover:bg-gold xl:px-5 xl:text-[12px] xl:tracking-[0.14em]"
          >
            {bookLabel}
          </Link>
        </div>

        {/* --- Điện thoại: đổi ngôn ngữ + nút ba gạch --- */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href={switchHref}
            className="rounded-full border border-cream/35 px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-cream/80"
          >
            {otherLocale}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Mở menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={`h-[2px] w-6 bg-cream transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-cream transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-6 bg-cream transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* --- Menu trượt trên điện thoại --- */}
      <div
        className={`overflow-hidden bg-forest transition-[max-height] duration-400 lg:hidden ${open ? "max-h-[80vh]" : "max-h-0"}`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-8 pt-2" aria-label="Menu di động">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => veDauTrang(e, item.href)}
              className={`border-b border-cream/10 py-3.5 text-sm font-medium uppercase tracking-[0.13em] ${
                isActive(item.href) ? "text-gold" : "text-cream/85"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/dat-ban`}
            onClick={(e) => veDauTrang(e, `/${locale}/dat-ban`)}
            className="mt-5 rounded-full bg-cream px-5 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-forest transition-colors hover:bg-gold"
          >
            {bookLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
