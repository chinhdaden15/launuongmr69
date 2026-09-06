import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/Container";
import { MenuBrowser } from "@/components/site/MenuBrowser";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getCategories, getMenuPosters } from "@/lib/store";

export const metadata: Metadata = { title: "Thực đơn" };

/**
 * TRANG THỰC ĐƠN (bố cục giống OM Nướng)
 *
 * Thanh chọn mục ở trên: MENU · KHAI VỊ · LẨU · NƯỚNG · ĂN VẶT · MÓN THÊM · GIẢI KHÁT
 *   - MENU  : hiện toàn bộ ảnh menu
 *   - Mục khác: chỉ hiện ảnh thuộc mục đó
 *
 * Giá nằm sẵn trong ảnh do quán tự thiết kế. Bấm vào ảnh để phóng to.
 * Thêm / sửa / xếp thứ tự ảnh: /admin → Thực đơn → Ảnh menu.
 * Thêm / đổi tên các mục: /admin → Thực đơn → Nhóm món.
 */
export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [categories, posters] = await Promise.all([
    getCategories(),
    getMenuPosters(),
  ]);

  // Chỉ đưa lên thanh chọn những mục thật sự đã có ảnh.
  const tabs = categories
    .filter((c) => posters.some((p) => p.categoryId === c.id))
    .map((c) => ({ id: c.id, label: t(c.name, locale) }));

  return (
    <>
      <PageHeader
        title={dict.menu.title}
        lead={dict.menu.lead}
        image="/uploads/cat-nuong.jpg"
      />

      <MenuBrowser
        tabs={tabs}
        allLabel={dict.menu.all}
        emptyLabel={dict.menu.empty}
        posters={posters.map((p) => ({
          id: p.id,
          categoryId: p.categoryId,
          image: p.image,
          caption: t(p.caption, locale),
        }))}
      />

      {/* Dải mời đặt bàn ở cuối trang */}
      <section className="bg-cream pb-20 lg:pb-28">
        <Container>
          <div className="relative aspect-[21/9] overflow-hidden rounded-card sm:aspect-[21/7]">
            <Image
              src="/uploads/hero-1.jpg"
              alt=""
              fill
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-shade/65" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="font-display text-2xl text-cream sm:text-3xl lg:text-4xl">
                {t(
                  { vi: "Giữ bàn trước cho chắc", en: "Reserve your table" },
                  locale,
                )}
              </p>
              <a
                href={`/${locale}/dat-ban`}
                className="mt-5 rounded-full bg-cream px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-forest transition-colors hover:bg-gold"
              >
                {dict.cta.bookNow}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
