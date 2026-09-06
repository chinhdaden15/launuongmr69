"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type Poster = { id: string; image: string; caption: string };

/**
 * Lưới ảnh menu. Vì giá nằm trong ảnh nên khách cần xem được ảnh thật to —
 * bấm vào ảnh sẽ mở toàn màn hình, dùng phím mũi tên để lật trang, Esc để đóng.
 *
 * Điện thoại 2 cột · máy tính bảng 3 cột · máy tính 4 cột.
 */
export function MenuPosterGrid({ posters }: { posters: Poster[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const close = useCallback(() => setOpenAt(null), []);
  const move = useCallback(
    (step: number) =>
      setOpenAt((i) =>
        i === null ? null : (i + step + posters.length) % posters.length,
      ),
    [posters.length],
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openAt, close, move]);

  if (!posters.length) return null;

  return (
    <>
      {/* Điện thoại 2 cột · máy tính bảng 3 · máy tính 4 · màn rộng 5 (như OM).
          Khi một mục chỉ có vài ảnh thì lưới tự thu hẹp cho cân giữa trang. */}
      <ul
        className={`mx-auto grid gap-4 lg:gap-5 ${
          posters.length <= 2
            ? "max-w-2xl grid-cols-2"
            : posters.length === 3
              ? "max-w-4xl grid-cols-2 sm:grid-cols-3"
              : posters.length === 4
                ? "max-w-5xl grid-cols-2 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }`}
      >
        {posters.map((poster, i) => (
          <li key={poster.id}>
            <button
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={poster.caption}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-card bg-cream-deep shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={poster.image}
                alt={poster.caption}
                fill
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, (max-width: 1280px) 23vw, 19vw"
                className="object-cover"
              />
              {/* Gợi ý bấm để phóng to */}
              <span className="absolute inset-0 flex items-end justify-center bg-shade/0 pb-5 opacity-0 transition-all duration-300 group-hover:bg-shade/35 group-hover:opacity-100">
                <span className="rounded-full bg-cream px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest">
                  Xem to
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openAt !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-shade/96 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-3xl text-cream/80 hover:bg-cream/10 hover:text-cream"
          >
            &times;
          </button>

          {posters.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              aria-label="Trang trước"
              className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full text-3xl text-cream/70 hover:bg-cream/10 hover:text-cream sm:left-6"
            >
              &lsaquo;
            </button>
          ) : null}

          <figure
            className="relative max-h-[88vh] w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/5] max-h-[82vh] w-full">
              <Image
                src={posters[openAt].image}
                alt={posters[openAt].caption}
                fill
                sizes="90vw"
                className="rounded-card object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-cream/70">
              {posters[openAt].caption}
              {posters.length > 1 ? (
                <span className="ml-2 text-cream/40">
                  {openAt + 1}/{posters.length}
                </span>
              ) : null}
            </figcaption>
          </figure>

          {posters.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
              aria-label="Trang sau"
              className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full text-3xl text-cream/70 hover:bg-cream/10 hover:text-cream sm:right-6"
            >
              &rsaquo;
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
