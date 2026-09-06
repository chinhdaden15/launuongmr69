import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/Container";
import { GalleryStrip } from "@/components/site/GalleryStrip";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getGallery, getSettings } from "@/lib/store";

export const metadata: Metadata = { title: "Về Mr.69" };

/** TRANG GIỚI THIỆU — câu chuyện quán + ba giá trị cốt lõi + ảnh không gian. */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [settings, gallery] = await Promise.all([
    getSettings(),
    getGallery("khong-gian"),
  ]);

  const values = [
    {
      title: { vi: "Nguyên liệu trong ngày", en: "Fresh every day" },
      body: {
        vi: "Thịt và hải sản nhập mỗi sáng, không trữ qua đêm. Rau củ lấy từ chợ đầu mối trước giờ mở cửa.",
        en: "Meat and seafood arrive each morning, never held overnight. Produce comes from the market before we open.",
      },
    },
    {
      title: { vi: "Ướp tối thiểu 6 tiếng", en: "Six hours minimum" },
      body: {
        vi: "Mỗi phần thịt được ướp theo công thức riêng và để đủ thời gian thấm trước khi lên vỉ.",
        en: "Every cut rests in our own marinade long enough to take it in before it meets the coals.",
      },
    },
    {
      title: { vi: "Than thật, lửa thật", en: "Real charcoal, real fire" },
      body: {
        vi: "Không dùng bếp điện. Mùi than là thứ làm nên vị nướng mà không thiết bị nào thay được.",
        en: "No electric plates. That charcoal smell is the one thing no appliance can fake.",
      },
    },
  ];

  return (
    <>
      <PageHeader
        title={t(settings.about.title, locale)}
        lead={t(settings.tagline, locale)}
        image={settings.about.image}
      />

      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <div className="mx-auto max-w-3xl space-y-5">
            {t(settings.about.body, locale)
              .split("\n\n")
              .map((p, i) => (
                <p
                  key={i}
                  className={`leading-[1.85] text-ink-soft ${i === 0 ? "text-lg text-ink lg:text-xl" : "text-base"}`}
                >
                  {p}
                </p>
              ))}
          </div>

          <div className="mt-16 grid gap-8 border-t border-ink/12 pt-14 sm:grid-cols-3 lg:gap-12">
            {values.map((v, i) => (
              <div key={i}>
                <span className="font-display text-4xl text-accent">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl text-ink">
                  {t(v.title, locale)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {t(v.body, locale)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <GalleryStrip
        photos={gallery}
        locale={locale}
        title={dict.home.galleryTitle}
        lead={dict.home.galleryLead}
        ctaLabel={dict.cta.viewAll}
        href={`/${locale}/khong-gian`}
      />
    </>
  );
}
