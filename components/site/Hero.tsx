"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import type { HeroSlide, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

/**
 * MỤC 2 — ẢNH BÌA TRANG CHỦ (chạy vòng tròn, vuốt tay được)
 *
 * Các ảnh nằm cạnh nhau thành một dải ngang và TRƯỢT sang khi đổi ảnh.
 *
 * Vì sao không bị tua ngược khi hết ảnh cuối:
 *   Dải ảnh được nhân thêm hai bản sao ở hai đầu —
 *     [bản sao ảnh CUỐI] [ảnh 1] [ảnh 2] ... [ảnh N] [bản sao ảnh ĐẦU]
 *   Từ ảnh cuối, dải vẫn trượt tiếp sang phải vào bản sao của ảnh đầu. Trượt
 *   xong, ta nhảy thầm về ảnh đầu thật (tắt hiệu ứng trong đúng một khoảnh
 *   khắc) — mắt không nhận ra vì hai khung hình giống hệt nhau.
 *
 * Vuốt tay: đặt ngón lên ảnh kéo ngang, dải ảnh đi theo ngón tay. Nhấc tay ra,
 *   nếu kéo đủ xa thì sang ảnh kế, chưa đủ thì trượt về chỗ cũ. Kéo dọc thì
 *   nhường cho trang cuộn bình thường.
 *
 * Hai con số điều chỉnh nằm ngay dưới đây.
 */

/** Thời gian dừng ở mỗi ảnh, tính bằng mili giây. */
const GIAY_MOI_ANH = 7000;

/** Thời gian trượt khi TỰ chạy — PHẢI khớp với .hero-track trong globals.css. */
const MS_TRUOT = 900;

/**
 * Nhịp trượt nốt sau khi khách NHẤC TAY.
 *
 * Phải khác hẳn nhịp tự chạy ở trên. Nhịp tự chạy khởi động chậm rồi mới tăng
 * tốc (hợp khi máy tự đổi ảnh), nhưng dùng cho lúc buông tay thì ảnh sẽ khựng
 * lại một nhịp — vì ngón tay đang đi nhanh mà ảnh lại bắt đầu lại từ tốc độ 0.
 * Nhịp dưới đây đi tiếp luôn theo đà rồi chậm dần, nên nối liền với cử chỉ vuốt.
 */
const MS_THA_TAY = 380;
const NHIP_THA_TAY = `transform ${MS_THA_TAY}ms cubic-bezier(0.22, 1, 0.36, 1)`;

/** Vuốt nhanh hơn mức này (pixel mỗi mili giây) thì đổi ảnh dù kéo chưa xa. */
const VUOT_NHANH = 0.35;

export function Hero({
  slides,
  locale,
  bookLabel,
}: {
  slides: HeroSlide[];
  locale: Locale;
  bookLabel: string;
}) {
  const total = slides.length;
  const loop = total > 1;

  // Vị trí trên dải đã nhân bản: 0 = bản sao ảnh cuối, 1..N = ảnh thật,
  // N+1 = bản sao ảnh đầu.
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [dangVuot, setDangVuot] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  /**
   * Điểm đặt ngón tay.
   *  theoNgang — bật lên khi đã chắc đây là vuốt ngang chứ không phải cuộn dọc
   *  xTruoc/tTruoc — vị trí và thời điểm của lần dịch chuyển TRƯỚC lần cuối
   *  xCuoi/tCuoi   — của lần dịch chuyển gần nhất
   *
   * Phải giữ lại mốc lùi một nhịp thì mới tính được ngón tay đang đi nhanh hay
   * chậm lúc buông. Nếu chỉ so lần cuối với lúc nhấc tay thì hai điểm đó gần
   * như trùng nhau, tốc độ luôn ra 0 và cú búng nhanh sẽ không được nhận ra.
   */
  const chamRef = useRef<{
    x: number;
    y: number;
    theoNgang: boolean;
    xTruoc: number;
    tTruoc: number;
    xCuoi: number;
    tCuoi: number;
  } | null>(null);

  /** Đồng hồ trả dải ảnh về nhịp tự chạy sau khi đã trượt nốt xong. */
  const traNhipRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(traNhipRef.current), []);

  const atClone = loop && (pos === 0 || pos === total + 1);
  const offset = loop ? pos : 0;

  // Tự sang ảnh kế tiếp. Vì phụ thuộc `pos` nên mỗi lần đổi ảnh — kể cả khi
  // khách tự bấm chấm hay vuốt tay — đồng hồ được đặt lại từ đầu.
  useEffect(() => {
    if (!loop || atClone || dangVuot) return;
    const timer = setTimeout(() => setPos((p) => p + 1), GIAY_MOI_ANH);
    return () => clearTimeout(timer);
  }, [pos, loop, atClone, dangVuot]);

  // Trượt xong vào bản sao thì nhảy thầm về ảnh thật tương ứng.
  //
  // Dùng đồng hồ đếm chứ KHÔNG dùng sự kiện "trượt xong" (transitionend), vì
  // máy nào bật chế độ giảm chuyển động thì không có hiệu ứng trượt, sự kiện đó
  // không bao giờ xảy ra và dải ảnh sẽ trượt luôn ra ngoài màn hình.
  useEffect(() => {
    if (!atClone || dangVuot) return;
    const timer = setTimeout(() => {
      setAnimate(false);
      setPos((p) => (p === 0 ? total : 1));
    }, MS_TRUOT + 60);
    return () => clearTimeout(timer);
  }, [atClone, dangVuot, total]);

  // Đợi trình duyệt vẽ xong vị trí mới rồi mới bật lại hiệu ứng trượt. Bật sớm
  // quá thì cú nhảy sẽ thành một đường trượt dài nhìn thấy được.
  //
  // Dùng đồng hồ đếm chứ KHÔNG dùng requestAnimationFrame, vì hàm đó ngừng chạy
  // khi trang không được vẽ (tab chạy nền, cửa sổ bị che). Nếu dùng nó thì hiệu
  // ứng trượt sẽ không bao giờ bật lại và các ảnh sau đó đều nhảy cóc.
  useEffect(() => {
    if (animate) return;
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [animate]);

  if (!total) return null;

  const panels = loop ? [slides[total - 1], ...slides, slides[0]] : slides;

  /** Ảnh thật đang hiển thị (dùng để tô đậm chấm tương ứng). */
  const activeSlide = loop ? (pos - 1 + total) % total : 0;

  /** Vị trí dải ảnh, cộng thêm đoạn ngón tay đã kéo được. */
  function viTriDai(keoPx = 0) {
    return keoPx
      ? `translate3d(calc(${-offset * 100}% + ${keoPx}px), 0, 0)`
      : `translate3d(${-offset * 100}%, 0, 0)`;
  }

  // ------------------------------------------------------------- vuốt tay
  function batDauCham(e: TouchEvent<HTMLElement>) {
    if (!loop) return;
    const ngon = e.touches[0];
    // Chưa gọi setDangVuot ở đây — chạm vào màn hình chưa chắc đã là vuốt ảnh,
    // có thể chỉ là bấm nút. Đợi tới khi biết chắc là kéo ngang mới báo cho
    // React, đỡ được một lượt vẽ lại ngay lúc ngón tay bắt đầu di chuyển.
    chamRef.current = {
      x: ngon.clientX,
      y: ngon.clientY,
      theoNgang: false,
      xTruoc: ngon.clientX,
      tTruoc: e.timeStamp,
      xCuoi: ngon.clientX,
      tCuoi: e.timeStamp,
    };
  }

  function dangKeo(e: TouchEvent<HTMLElement>) {
    const cham = chamRef.current;
    const el = trackRef.current;
    if (!cham || !el) return;

    const ngon = e.touches[0];
    const dx = ngon.clientX - cham.x;
    const dy = ngon.clientY - cham.y;

    if (!cham.theoNgang) {
      // Chưa đi đủ xa để biết khách định kéo ngang hay dọc.
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // Kéo dọc — nhường cho trang cuộn như bình thường.
        chamRef.current = null;
        setDangVuot(false);
        return;
      }
      cham.theoNgang = true;
      setDangVuot(true);
      // Tắt hiệu ứng để dải ảnh bám sát ngón tay, không bị trễ.
      clearTimeout(traNhipRef.current);
      el.style.transition = "none";
    }

    el.style.transform = viTriDai(dx);
    cham.xTruoc = cham.xCuoi;
    cham.tTruoc = cham.tCuoi;
    cham.xCuoi = ngon.clientX;
    cham.tCuoi = e.timeStamp;
  }

  function nhacTay(e: TouchEvent<HTMLElement>) {
    const cham = chamRef.current;
    const el = trackRef.current;
    chamRef.current = null;
    setDangVuot(false);
    if (!cham || !el) return;

    if (!cham.theoNgang) {
      el.style.transition = "";
      return;
    }

    const xKet = e.changedTouches[0]?.clientX ?? cham.x;
    const dx = xKet - cham.x;

    // Tốc độ ngón tay ở khoảnh khắc buông ra. Nếu khách dừng lại một lúc rồi
    // mới nhấc thì tốc độ gần bằng 0, lúc đó chỉ xét quãng đường đã kéo.
    const dt = Math.max(1, e.timeStamp - cham.tTruoc);
    const vanToc = (xKet - cham.xTruoc) / dt;

    // Phải kéo được ít nhất 15% bề ngang màn hình, HOẶC búng nhanh một cái.
    const nguong = Math.max(45, el.clientWidth * 0.15);
    const bungTrai = vanToc <= -VUOT_NHANH && dx < -15;
    const bungPhai = vanToc >= VUOT_NHANH && dx > 15;

    // Trượt nốt bằng nhịp riêng của cử chỉ vuốt, không dùng nhịp tự chạy.
    el.style.transition = NHIP_THA_TAY;
    clearTimeout(traNhipRef.current);
    traNhipRef.current = setTimeout(() => {
      const t = trackRef.current;
      if (t) t.style.transition = "";
    }, MS_THA_TAY + 40);

    if (dx <= -nguong || bungTrai) setPos((p) => Math.min(total + 1, p + 1));
    else if (dx >= nguong || bungPhai) setPos((p) => Math.max(0, p - 1));
    // Kéo chưa đủ xa và cũng không búng — trượt về chỗ cũ.
    else el.style.transform = viTriDai();
  }

  function huyCham() {
    const el = trackRef.current;
    chamRef.current = null;
    setDangVuot(false);
    if (el) {
      el.style.transition = NHIP_THA_TAY;
      el.style.transform = viTriDai();
      clearTimeout(traNhipRef.current);
      traNhipRef.current = setTimeout(() => {
        const t = trackRef.current;
        if (t) t.style.transition = "";
      }, MS_THA_TAY + 40);
    }
  }

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden lg:h-screen">
      <div
        ref={trackRef}
        // touch-pan-y: cho trang cuộn dọc bình thường, còn kéo ngang thì
        // dành cho dải ảnh này xử lý.
        className={`hero-track flex h-full w-full touch-pan-y ${animate ? "" : "hero-track--instant"}`}
        style={{ transform: viTriDai() }}
        onTouchStart={batDauCham}
        onTouchMove={dangKeo}
        onTouchEnd={nhacTay}
        onTouchCancel={huyCham}
      >
        {panels.map((slide, i) => (
          <div
            key={`${slide.id}-${i}`}
            className="relative h-full w-full shrink-0"
            // Ảnh không hiển thị thì khoá lại, tránh bàn phím Tab nhảy vào
            // những cái nút đang nằm ngoài màn hình.
            inert={i !== offset}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={i === offset || i === 1}
              sizes="100vw"
              className="object-cover"
              // Chặn thao tác kéo ảnh sẵn có của trình duyệt, nếu không thì
              // vuốt ngang trên máy tính bảng sẽ thành kéo-thả tấm ảnh.
              draggable={false}
            />

            {/* Lớp phủ tối để chữ luôn đọc được dù ảnh sáng hay tối */}
            <div className="absolute inset-0 bg-gradient-to-b from-shade/85 via-shade/62 to-shade/92" />
            <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden />

            <div className="relative z-10 flex h-full items-center justify-center px-5 pt-20 text-center">
              <div className="max-w-3xl">
                <p className="eyebrow mb-5 text-gold">
                  {t(slide.eyebrow, locale)}
                </p>

                <h1 className="font-display text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-7xl">
                  {t(slide.title, locale)
                    .split("\n")
                    .map((line, k) => (
                      <span key={k} className="block">
                        {line}
                      </span>
                    ))}
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
                  {t(slide.subtitle, locale)}
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <Link
                    href={`/${locale}${slide.ctaHref}`}
                    className="w-full rounded-full bg-brand px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-brand-light sm:w-auto"
                  >
                    {t(slide.ctaLabel, locale)}
                  </Link>
                  <Link
                    href={`/${locale}/dat-ban`}
                    className="w-full rounded-full border border-cream/50 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-forest sm:w-auto"
                  >
                    {bookLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chấm chuyển ảnh */}
      {loop ? (
        <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setPos(i + 1)}
              aria-label={`Ảnh bìa ${i + 1}`}
              aria-current={i === activeSlide}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? "w-8 bg-gold"
                  : "w-1.5 bg-cream/50 hover:bg-cream/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
