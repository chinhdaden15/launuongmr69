import Image from "next/image";
import type { Locale, SiteSettings } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Container } from "./Container";
import { Button } from "./Button";

/**
 * MỤC 3 — GIỚI THIỆU QUÁN
 * Máy tính: ảnh dọc bên trái, chữ bên phải, có khung viền đồng lệch tạo chiều sâu.
 * Điện thoại: ảnh trên, chữ dưới.
 */
export function AboutSection({
  about,
  locale,
  eyebrow,
  ctaLabel,
  ctaHref,
}: {
  about: SiteSettings["about"];
  locale: Locale;
  /** Dòng chữ nhỏ phía trên tiêu đề. Bỏ trống thì không hiện. */
  eyebrow?: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const paragraphs = t(about.body, locale).split("\n\n");

  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          {/* Ảnh + khung viền lệch */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-card border border-accent/45 sm:-inset-5"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-card">
              <Image
                src={about.image}
                alt={t(about.title, locale)}
                fill
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Nội dung */}
          <div>
            {eyebrow ? (
              <p className="eyebrow mb-4 text-accent">{eyebrow}</p>
            ) : null}
            <h2 className="font-display text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[2.85rem]">
              {t(about.title, locale)}
            </h2>
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-[1.8] text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-9">
              <Button href={ctaHref} variant="outline">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
