import Image from "next/image";
import type { Branch, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { SwipeRow } from "./SwipeRow";
import { SWIPE_ITEM } from "./swipe-item";

/**
 * MỤC 8 — CHI NHÁNH
 * Mỗi cơ sở là một thẻ: ảnh mặt tiền, tên, giờ mở cửa, địa chỉ, nút chỉ đường.
 * Cơ sở "sắp mở" hiện nhãn riêng và làm mờ nhẹ.
 */
export function BranchSection({
  branches,
  locale,
  title,
  lead,
  eyebrow,
  labels,
}: {
  branches: Branch[];
  locale: Locale;
  title: string;
  lead: string;
  /** Dòng chữ nhỏ phía trên tiêu đề. Bỏ trống thì không hiện. */
  eyebrow?: string;
  labels: {
    open: string;
    comingSoon: string;
    hours: string;
    directions: string;
    call: string;
  };
}) {
  if (!branches.length) return null;

  return (
    <section className="bg-cream-deep py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />

        <div className="mt-14">
          <SwipeRow
            count={branches.length}
            dotLabel="Xem chi nhánh"
            gridClass="sm:grid-cols-2 sm:gap-6 lg:gap-8"
          >
            {branches.map((branch) => {
            const soon = branch.status === "coming-soon";
            return (
              <li key={branch.id} className={SWIPE_ITEM}>
              <article
                className={`flex h-full flex-col overflow-hidden rounded-card bg-cream shadow-sm ${soon ? "opacity-80" : ""}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={branch.image}
                    alt={t(branch.name, locale)}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="object-cover"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      soon ? "bg-forest/90 text-cream" : "bg-gold text-ink"
                    }`}
                  >
                    {soon ? labels.comingSoon : labels.open}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <h3 className="font-display text-xl text-ink lg:text-2xl">
                    {t(branch.name, locale)}
                  </h3>

                  <dl className="mt-4 space-y-2 text-sm text-ink-soft">
                    {branch.hours.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <dt className="shrink-0 font-medium text-ink">
                          {t(h.label, locale)}:
                        </dt>
                        <dd>{h.time}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                    {t(branch.address, locale)}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
                    <a
                      href={`tel:${branch.phone.replace(/\s/g, "")}`}
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand hover:underline"
                    >
                      {labels.call}: {branch.phone}
                    </a>
                    {branch.mapLink ? (
                      <a
                        href={branch.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft hover:text-ink hover:underline"
                      >
                        {labels.directions}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
              </li>
            );
          })}
          </SwipeRow>
        </div>
      </Container>
    </section>
  );
}
