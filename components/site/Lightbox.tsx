"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type LightboxPhoto = { id: string; image: string; caption: string };

/**
 * Thư viện ảnh có xem phóng to.
 * Bấm vào ảnh để mở lớn, dùng phím mũi tên hoặc vuốt để chuyển, Esc để đóng.
 */
export function Lightbox({ photos }: { photos: LightboxPhoto[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const close = useCallback(() => setOpenAt(null), []);
  const move = useCallback(
    (step: number) =>
      setOpenAt((i) => (i === null ? null : (i + step + photos.length) % photos.length)),
    [photos.length],
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

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpenAt(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-card"
              aria-label={photo.caption}
            >
              <Image
                src={photo.image}
                alt={photo.caption}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 23vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-shade/0 transition-colors group-hover:bg-shade/45" />
              <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-xs font-medium text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openAt !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-shade/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-2xl text-cream/80 hover:text-cream"
            aria-label="Đóng"
          >
            &times;
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-2 flex h-12 w-12 items-center justify-center text-3xl text-cream/70 hover:text-cream sm:left-6"
            aria-label="Ảnh trước"
          >
            &lsaquo;
          </button>

          <figure
            className="relative max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={photos[openAt].image}
                alt={photos[openAt].caption}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-cream/75">
              {photos[openAt].caption}
              <span className="ml-2 text-cream/40">
                {openAt + 1}/{photos.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-2 flex h-12 w-12 items-center justify-center text-3xl text-cream/70 hover:text-cream sm:right-6"
            aria-label="Ảnh sau"
          >
            &rsaquo;
          </button>
        </div>
      ) : null}
    </>
  );
}
