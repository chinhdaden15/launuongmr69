import Image from "next/image";
import Link from "next/link";
import type { Locale, MenuCategory } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Button } from "./Button";
import { SwipeRow } from "./SwipeRow";
import { SWIPE_ITEM } from "./swipe-item";

/**
 * MỤC 4 — CÁC NHÓM MÓN (bố cục giống OM Nướng)
 *
 * Ảnh bo góc ở trên, tên nhóm màu xanh ở dưới ảnh, mô tả dưới cùng.
 * Trên điện thoại các thẻ nằm ngang cho khách vuốt (xem SwipeRow.tsx).
 */
export function MenuCategories({
  categories,
  locale,
  title,
  lead,
  eyebrow,
  ctaLabel,
}: {
  categories: MenuCategory[];
  locale: Locale;
  title: string;
  lead: string;
  /** Dòng chữ nhỏ phía trên tiêu đề. Bỏ trống thì không hiện. */
  eyebrow?: string;
  ctaLabel: string;
}) {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />

        <div className="mt-12 lg:mt-14">
          <SwipeRow
            count={categories.length}
            dotLabel="Xem nhóm món"
            gridClass="sm:grid-cols-2 sm:gap-x-7 sm:gap-y-11 lg:grid-cols-3"
          >
            {categories.map((cat) => (
              <li key={cat.id} className={SWIPE_ITEM}>
                <Link href={`/${locale}/thuc-don`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                    <Image
                      src={cat.image}
                      alt={t(cat.name, locale)}
                      fill
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-brand transition-colors group-hover:text-brand-dark lg:text-[1.7rem]">
                    {t(cat.name, locale)}
                  </h3>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                    {t(cat.desc, locale)}
                  </p>
                </Link>
              </li>
            ))}
          </SwipeRow>
        </div>

        <div className="mt-12 text-center lg:mt-14">
          <Button href={`/${locale}/thuc-don`}>{ctaLabel}</Button>
        </div>
      </Container>
    </section>
  );
}
