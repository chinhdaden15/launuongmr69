import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getPromotions } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const promo = (await getPromotions()).find((p) => p.slug === slug);
  if (!promo || !isLocale(locale)) return { title: "Ưu đãi" };
  return {
    title: t(promo.title, locale),
    description: t(promo.excerpt, locale),
  };
}

export async function generateStaticParams() {
  const promos = await getPromotions({ publishedOnly: true });
  return promos.flatMap((p) =>
    ["vi", "en"].map((locale) => ({ locale, slug: p.slug })),
  );
}

/** TRANG CHI TIẾT ƯU ĐÃI — ảnh lớn, nội dung đầy đủ, nút đặt bàn ở cuối. */
export default async function PromotionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const promo = (await getPromotions({ publishedOnly: true })).find(
    (p) => p.slug === slug,
  );
  if (!promo) notFound();

  return (
    <article>
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden lg:h-[58vh]">
        <Image
          src={promo.image}
          alt={t(promo.title, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-shade/76" />
        <div className="absolute inset-x-0 bottom-0 pb-10 pt-24">
          <Container>
            <span className="inline-block rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
              {t(promo.badge, locale)}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
              {t(promo.title, locale)}
            </h1>
          </Container>
        </div>
      </div>

      <section className="relative overflow-hidden bg-cream py-14 lg:py-20">
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-ink lg:text-xl">
              {t(promo.excerpt, locale)}
            </p>

            <div className="mt-8 space-y-4 border-t border-ink/12 pt-8">
              {t(promo.body, locale)
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i} className="text-base leading-[1.85] text-ink-soft">
                    {line}
                  </p>
                ))}
            </div>

            <p className="mt-8 text-[11px] uppercase tracking-wider text-ink-soft/75">
              {dict.promotions.validUntil}{" "}
              {new Date(promo.endDate).toLocaleDateString(
                locale === "vi" ? "vi-VN" : "en-GB",
              )}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 border-t border-ink/12 pt-10">
              <Button href={`/${locale}/dat-ban`}>{dict.cta.bookNow}</Button>
              <Link
                href={`/${locale}/uu-dai`}
                className="inline-flex items-center gap-2 px-2 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft hover:text-ink"
              >
                &larr; {dict.cta.back}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
