import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/Container";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getPromotions } from "@/lib/store";

export const metadata: Metadata = { title: "Ưu đãi & Combo" };

/** TRANG ƯU ĐÃI — danh sách toàn bộ chương trình đang chạy. */
export default async function PromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const promotions = await getPromotions({ publishedOnly: true });

  return (
    <>
      <PageHeader
        title={dict.promotions.title}
        lead={dict.promotions.lead}
        // Lấy ảnh chương trình đầu tiên — đổi trong Admin → Ưu đãi & Combo
        image={promotions.find((p) => p.image)?.image}
      />

      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          {promotions.length === 0 ? (
            <p className="py-16 text-center text-ink-soft">{dict.promotions.empty}</p>
          ) : (
            <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promo) => (
                <li key={promo.id} className="group flex flex-col overflow-hidden rounded-card bg-cream-deep">
                  <Link
                    href={`/${locale}/uu-dai/${promo.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden"
                  >
                    <Image
                      src={promo.image}
                      alt={t(promo.title, locale)}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                      {t(promo.badge, locale)}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-lg leading-snug text-ink lg:text-xl">
                      <Link
                        href={`/${locale}/uu-dai/${promo.slug}`}
                        className="transition-colors hover:text-brand"
                      >
                        {t(promo.title, locale)}
                      </Link>
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                      {t(promo.excerpt, locale)}
                    </p>
                    <p className="mt-5 border-t border-ink/10 pt-4 text-[11px] uppercase tracking-wider text-ink-soft/75">
                      {dict.promotions.validUntil}{" "}
                      {new Date(promo.endDate).toLocaleDateString(
                        locale === "vi" ? "vi-VN" : "en-GB",
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
