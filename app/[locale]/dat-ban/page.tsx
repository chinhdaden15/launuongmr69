import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/Container";
import { BookingForm } from "@/components/site/BookingForm";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getBranches, getSettings } from "@/lib/store";

export const metadata: Metadata = { title: "Đặt bàn" };

/** TRANG ĐẶT BÀN — form bên trái, thông tin liên hệ nhanh bên phải. */
export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [settings, branches] = await Promise.all([getSettings(), getBranches()]);

  return (
    <>
      <PageHeader
        title={dict.booking.title}
        lead={dict.booking.lead}
        // Lấy ảnh bìa thứ hai — đổi trong Admin → Cài đặt chung → Ảnh bìa
        image={settings.hero[1]?.image ?? settings.hero[0]?.image}
      />

      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.75fr] lg:gap-16">
            <div>
              <BookingForm
                locale={locale}
                branches={branches.map((b) => ({
                  id: b.id,
                  name:
                    t(b.name, locale) +
                    (b.status === "coming-soon" ? ` (${dict.branches.comingSoon})` : ""),
                  disabled: b.status === "coming-soon",
                }))}
                labels={{
                  name: dict.booking.name,
                  phone: dict.booking.phone,
                  email: dict.booking.email,
                  branch: dict.booking.branch,
                  date: dict.booking.date,
                  time: dict.booking.time,
                  guests: dict.booking.guests,
                  note: dict.booking.note,
                  notePlaceholder: dict.booking.notePlaceholder,
                  submit: dict.booking.submit,
                  sending: dict.booking.sending,
                  successTitle: dict.booking.successTitle,
                  successBody: dict.booking.successBody,
                  errorRequired: dict.booking.errorRequired,
                  errorPhone: dict.booking.errorPhone,
                  errorGeneric: dict.booking.errorGeneric,
                }}
              />
            </div>

            <aside className="h-fit rounded-card border border-ink/12 bg-cream-deep p-7">
              <h2 className="eyebrow text-accent">{dict.booking.orCall}</h2>
              <a
                href={`tel:${settings.hotline.replace(/\s/g, "")}`}
                className="mt-3 block font-display text-2xl text-brand hover:underline"
              >
                {settings.hotline}
              </a>

              <p className="mt-6 border-t border-ink/12 pt-6 text-sm leading-relaxed text-ink-soft">
                {t(settings.bookingNote, locale)}
              </p>

              <div className="mt-6 space-y-2.5">
                {settings.zalo ? (
                  <a
                    href={`https://zalo.me/${settings.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full border border-ink/20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-forest hover:text-cream"
                  >
                    Zalo
                  </a>
                ) : null}
                {settings.messenger ? (
                  <a
                    href={settings.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full border border-ink/20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-forest hover:text-cream"
                  >
                    Messenger
                  </a>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
