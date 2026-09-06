import Image from "next/image";
import type { Locale, MenuItem } from "@/lib/types";
import { formatPrice, t } from "@/lib/i18n";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { SwipeRow } from "./SwipeRow";
import { SWIPE_ITEM } from "./swipe-item";

/**
 * MỤC 5 — MÓN NỔI BẬT
 * Dải thẻ trượt ngang trên điện thoại (vuốt được), lưới 4 cột trên máy tính.
 * Món nào bật "Nổi bật" trong admin sẽ hiện ở đây.
 */
export function FeaturedDishes({
  items,
  locale,
  title,
  lead,
  eyebrow,
  soldOutLabel,
}: {
  items: MenuItem[];
  locale: Locale;
  title: string;
  lead: string;
  /** Dòng chữ nhỏ phía trên tiêu đề. Bỏ trống thì không hiện. */
  eyebrow?: string;
  soldOutLabel: string;
}) {
  if (!items.length) return null;

  return (
    <section className="bg-cream-deep py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      </Container>

      {/* Trượt ngang trên điện thoại, lưới trên máy tính */}
      <Container className="mt-12">
        <SwipeRow
          count={items.length}
          dotLabel="Xem món"
          gridClass="sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        >
          {items.map((item) => (
            <li
              key={item.id}
              className={`${SWIPE_ITEM} overflow-hidden rounded-card bg-cream shadow-sm`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={t(item.name, locale)}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 23vw"
                  className="object-cover"
                />
                {!item.available ? (
                  <span className="absolute left-3 top-3 rounded-full bg-forest/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream">
                    {soldOutLabel}
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg leading-snug text-ink">
                  {t(item.name, locale)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                  {t(item.desc, locale)}
                </p>
                <div className="mt-4 flex items-baseline gap-2 border-t border-ink/10 pt-3.5">
                  <span className="font-display text-lg text-brand">
                    {formatPrice(item.price, locale)}
                  </span>
                  <span className="text-xs text-ink-soft">
                    {t(item.unit, locale)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </SwipeRow>
      </Container>
    </section>
  );
}
