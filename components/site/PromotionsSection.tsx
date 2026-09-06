import Image from "next/image";
import Link from "next/link";
import type { Locale, Promotion } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Button } from "./Button";
import { SwipeRow } from "./SwipeRow";
import { SWIPE_ITEM } from "./swipe-item";

/**
 * MỤC 6 — ƯU ĐÃI & SỰ KIỆN
 * Thẻ lớn: ảnh bên trên, nhãn màu đồng, tiêu đề và mô tả ngắn.
 * Ưu đãi đầu tiên được làm nổi chiếm 2 cột trên máy tính.
 */
export function PromotionsSection({
  promotions,
  locale,
  title,
  lead,
  eyebrow,
  ctaLabel,
  viewAllLabel,
  emptyLabel,
}: {
  promotions: Promotion[];
  locale: Locale;
  title: string;
  lead: string;
  /** Dòng chữ nhỏ phía trên tiêu đề. Bỏ trống thì không hiện. */
  eyebrow?: string;
  ctaLabel: string;
  viewAllLabel: string;
  emptyLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />

        {promotions.length === 0 ? (
          <p className="mt-12 text-center text-ink-soft">{emptyLabel}</p>
        ) : (
          <div className="mt-14">
            <SwipeRow
              count={promotions.length}
              dotLabel="Xem ưu đãi"
              gridClass="sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            >
              {promotions.map((promo) => (
              <li key={promo.id} className={SWIPE_ITEM}>
              <article
                className="group flex h-full flex-col overflow-hidden rounded-card bg-cream-deep"
              >
                <Link
                  href={`/${locale}/uu-dai/${promo.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden"
                >
                  <Image
                    src={promo.image}
                    alt={t(promo.title, locale)}
                    fill
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                    {t(promo.badge, locale)}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <h3 className="font-display text-xl leading-snug text-ink lg:text-2xl">
                    <Link
                      href={`/${locale}/uu-dai/${promo.slug}`}
                      className="transition-colors hover:text-brand"
                    >
                      {t(promo.title, locale)}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {t(promo.excerpt, locale)}
                  </p>
                  <Link
                    href={`/${locale}/uu-dai/${promo.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand"
                  >
                    {ctaLabel}
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </article>
              </li>
              ))}
            </SwipeRow>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button href={`/${locale}/uu-dai`} variant="outline">
            {viewAllLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
