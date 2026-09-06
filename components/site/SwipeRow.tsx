"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * DẢI THẺ VUỐT NGANG — dùng chung cho các mục trên trang chủ.
 *
 * ĐIỆN THOẠI: các thẻ nằm ngang, mỗi lần xem một thẻ, thẻ kế tiếp ló ra một
 *   chút ở mép phải để khách biết còn nữa mà vuốt. Bên dưới có hàng chấm cho
 *   biết đang ở thẻ thứ mấy, bấm vào chấm là nhảy tới thẻ đó.
 * MÁY TÍNH BẢNG TRỞ LÊN: quay về lưới bình thường, hàng chấm tự ẩn.
 *
 * Cách dùng: bọc danh sách thẻ trong <SwipeRow>, mỗi thẻ là một <li> có thêm
 * lớp SWIPE_ITEM (nhập từ ./swipe-item). Xem MenuCategories.tsx làm ví dụ.
 */

export function SwipeRow({
  count,
  children,
  gridClass,
  tone = "ink",
  dotLabel = "Xem mục",
}: {
  /** Số thẻ — dùng để vẽ đúng số chấm. */
  count: number;
  children: ReactNode;
  /** Lớp lưới áp dụng từ máy tính bảng trở lên, ví dụ "sm:grid-cols-2 lg:grid-cols-3". */
  gridClass: string;
  /** "cream" khi nền mục là màu tối, để hàng chấm sáng lên cho thấy rõ. */
  tone?: "ink" | "cream";
  dotLabel?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  /** Bề rộng một thẻ cộng khoảng cách — đo trực tiếp nên luôn đúng dù đổi cỡ thẻ. */
  function stepWidth(el: HTMLUListElement) {
    const [a, b] = [el.children[0], el.children[1]] as HTMLElement[];
    return b ? b.offsetLeft - a.offsetLeft : el.clientWidth;
  }

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / stepWidth(el));
    setCurrent(Math.max(0, Math.min(count - 1, i)));
  }

  function goTo(i: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: stepWidth(el) * i, behavior: "smooth" });
  }

  const dotOn = tone === "cream" ? "bg-gold" : "bg-brand";
  const dotOff = tone === "cream" ? "bg-cream/30" : "bg-ink/25";

  return (
    <div>
      <ul
        ref={ref}
        onScroll={onScroll}
        className={`no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 ${gridClass}`}
      >
        {children}
      </ul>

      {count > 1 ? (
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${dotLabel} ${i + 1}`}
              aria-current={i === current}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? `w-7 ${dotOn}` : `w-1.5 ${dotOff}`
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
