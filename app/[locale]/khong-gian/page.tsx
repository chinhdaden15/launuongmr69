import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/Container";
import { Lightbox } from "@/components/site/Lightbox";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getGallery } from "@/lib/store";
import type { GalleryPhoto } from "@/lib/types";

export const metadata: Metadata = { title: "Không gian" };

const ALBUMS: GalleryPhoto["album"][] = ["khong-gian", "mon-an", "su-kien"];

/** TRANG KHÔNG GIAN — thư viện ảnh chia theo album, bấm vào xem phóng to. */
export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const photos = await getGallery();

  return (
    <>
      <PageHeader
        title={dict.gallery.title}
        lead={dict.gallery.lead}
        image="/uploads/gal-1.jpg"
      />

      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative space-y-16">
          {ALBUMS.map((album) => {
            const list = photos.filter((p) => p.album === album);
            if (!list.length) return null;
            return (
              <div key={album}>
                <h2 className="mb-7 border-b border-ink/12 pb-4 font-display text-2xl uppercase tracking-wide text-ink lg:text-3xl">
                  {dict.gallery.albums[album]}
                </h2>
                <Lightbox
                  photos={list.map((p) => ({
                    id: p.id,
                    image: p.image,
                    caption: t(p.caption, locale),
                  }))}
                />
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}
