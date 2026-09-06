"use client";

import { useEffect, useState } from "react";
import {
  IconDienThoai,
  IconMessenger,
  IconTikTok,
  IconZalo,
} from "./BrandIcons";

/**
 * MỤC 10 — NÚT LIÊN HỆ NỔI
 *
 * Cột nút tròn cố định bên phải màn hình: Gọi · Zalo · Messenger · TikTok ·
 * Lên đầu trang. Nút nào chưa khai báo đường dẫn trong Admin → Cài đặt chung
 * thì tự ẩn đi.
 *
 * Mỗi nút dùng đúng logo và đúng màu thương hiệu của bên đó, để khách nhìn là
 * nhận ra ngay mà không cần đọc chữ.
 */
export function FloatingContact({
  hotline,
  zalo,
  messenger,
  tiktok,
}: {
  hotline: string;
  zalo: string;
  messenger: string;
  tiktok: string;
}) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 44px là cỡ tối thiểu để ngón tay bấm không bị trượt.
  const nut =
    "flex h-12 w-12 items-center justify-center rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 lg:h-11 lg:w-11 lg:p-2.5";

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2.5 lg:bottom-8 lg:right-6">
      {hotline ? (
        <a
          href={`tel:${hotline.replace(/\s/g, "")}`}
          aria-label={`Gọi ${hotline}`}
          title={hotline}
          className={`${nut} animate-pulse bg-brand text-cream`}
        >
          <IconDienThoai />
        </a>
      ) : null}

      {zalo ? (
        <a
          href={`https://zalo.me/${zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Zalo"
          title="Zalo"
          className={`${nut} bg-[#0068FF] text-white`}
        >
          <IconZalo />
        </a>
      ) : null}

      {messenger ? (
        <a
          href={messenger}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Messenger"
          title="Messenger"
          className={`${nut} bg-[#0084FF] text-white`}
        >
          <IconMessenger />
        </a>
      ) : null}

      {tiktok ? (
        <a
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Xem kênh TikTok"
          title="TikTok"
          className={`${nut} bg-black text-white`}
        >
          <IconTikTok />
        </a>
      ) : null}

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Lên đầu trang"
        className={`${nut} bg-forest text-cream ${showTop ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden className="h-full w-full">
          <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
