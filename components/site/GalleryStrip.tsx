import Image from "next/image";
import type { GalleryPhoto, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Button } from "./Button";
import { SwipeRow } from "./SwipeRow";
import { SWIPE_ITEM } from "./swipe-item";

/**
 * MỤC 7 — THƯ VIỆN ẢNH
 * Lưới ảnh so le: ảnh đầu tiên chiếm ô lớn, còn lại ô nhỏ.
 * Trên điện thoại rút gọn còn lưới 2 cột đều nhau.
 */
export function GalleryStrip({
  photos,
  locale,
  title,
  lead,
  eyebrow,
  ctaLabel,
  href,
}: {
  photos: GalleryPhoto[];
  locale: Locale;
  title: string;
  lead: string;
  /** Dòng chữ nhỏ phía trên tiêu đề. Bỏ trống thì không hiện. */
  eyebrow?: string;
  ctaLabel: string;
  href: string;
}) {
  if (!photos.length) return null;

  return (
    <section className="bg-forest py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} tone="cream" />

        <div className="mt-14">
          <SwipeRow
            count={Math.min(photos.length, 6)}
            tone="cream"
            dotLabel="Xem ảnh"
            gridClass="sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-2"
          >
            {photos.slice(0, 6).map((photo, i) => (
            <li
              key={photo.id}
              className={`${SWIPE_ITEM} ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
            <figure
              className={`group relative block h-full overflow-hidden rounded-card ${
                i === 0 ? "aspect-square lg:aspect-auto" : "aspect-square"
              }`}
            >
              <Image
                src={photo.image}
                alt={t(photo.caption, locale)}
                fill
                sizes="(max-width: 1024px) 45vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-shade/0 transition-colors duration-300 group-hover:bg-shade/55" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-xs font-medium text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {t(photo.caption, locale)}
              </figcaption>
            </figure>
            </li>
            ))}
          </SwipeRow>
        </div>

        <div className="mt-12 text-center">
          <Button href={href} variant="cream">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
