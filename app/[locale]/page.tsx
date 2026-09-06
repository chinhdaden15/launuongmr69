import { notFound } from "next/navigation";
import { Hero } from "@/components/site/Hero";
import { AboutSection } from "@/components/site/AboutSection";
import { MenuCategories } from "@/components/site/MenuCategories";
import { FeaturedDishes } from "@/components/site/FeaturedDishes";
import { PromotionsSection } from "@/components/site/PromotionsSection";
import { GalleryStrip } from "@/components/site/GalleryStrip";
import { BranchSection } from "@/components/site/BranchSection";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import {
  getBranches,
  getCategories,
  getGallery,
  getMenuItems,
  getPromotions,
  getSettings,
} from "@/lib/store";

/**
 * TRANG CHỦ — ghép 7 mục theo đúng thứ tự.
 *
 * Muốn ĐỔI THỨ TỰ các mục: kéo khối tương ứng bên dưới lên hoặc xuống.
 * Muốn TẠM ẨN một mục: bọc khối đó trong dấu chú thích JSX.
 * Muốn ĐỔI NỘI DUNG chữ: sửa trong messages/vi.json và messages/en.json.
 * Muốn ĐỔI ẢNH và dữ liệu: vào trang /admin.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [settings, categories, items, promotions, gallery, branches] =
    await Promise.all([
      getSettings(),
      getCategories(),
      getMenuItems(),
      getPromotions({ publishedOnly: true }),
      getGallery(),
      getBranches(),
    ]);

  const featured = items.filter((i) => i.featured).slice(0, 4);

  return (
    <>
      {/* 1 — Ảnh bìa chạy slide */}
      <Hero slides={settings.hero} locale={locale} bookLabel={dict.cta.bookNow} />

      {/* 2 — Giới thiệu quán */}
      <AboutSection
        about={settings.about}
        locale={locale}
        ctaLabel={dict.cta.viewMore}
        ctaHref={`/${locale}/gioi-thieu`}
      />

      {/* 3 — Các nhóm món */}
      <MenuCategories
        categories={categories}
        locale={locale}
        title={dict.home.menuTitle}
        lead={dict.home.menuLead}
        ctaLabel={dict.cta.viewMenu}
      />

      {/* 4 — Món nổi bật */}
      <FeaturedDishes
        items={featured}
        locale={locale}
        title={t({ vi: "Món đặc trưng của Mr.69", en: "Mr.69 signatures" }, locale)}
        lead={t(
          {
            vi: "Những món được gọi nhiều nhất, đại diện cho hương vị của quán.",
            en: "The most-ordered plates — the taste that defines us.",
          },
          locale,
        )}
        soldOutLabel={dict.menu.soldOut}
      />

      {/* 5 — Ưu đãi & sự kiện */}
      <PromotionsSection
        promotions={promotions.slice(0, 3)}
        locale={locale}
        title={dict.home.promoTitle}
        lead={dict.home.promoLead}
        ctaLabel={dict.cta.viewMore}
        viewAllLabel={dict.cta.viewAll}
        emptyLabel={dict.promotions.empty}
      />

      {/* 6 — Thư viện ảnh */}
      <GalleryStrip
        photos={gallery}
        locale={locale}
        title={dict.home.galleryTitle}
        lead={dict.home.galleryLead}
        ctaLabel={dict.cta.viewAll}
        href={`/${locale}/khong-gian`}
      />

      {/* 7 — Chi nhánh */}
      <BranchSection
        branches={branches}
        locale={locale}
        title={dict.home.branchTitle}
        lead={dict.home.branchLead}
        labels={{
          open: dict.branches.open,
          comingSoon: dict.branches.comingSoon,
          hours: dict.branches.hours,
          directions: dict.cta.directions,
          call: dict.cta.call,
        }}
      />
    </>
  );
}
