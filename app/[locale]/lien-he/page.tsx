import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import {
  IconFacebook,
  IconMessenger,
  IconTikTok,
  IconZalo,
} from "@/components/site/BrandIcons";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getBranches, getSettings } from "@/lib/store";

export const metadata: Metadata = { title: "Liên hệ" };

/** TRANG LIÊN HỆ — hotline, email, mạng xã hội và danh sách cơ sở. */
export default async function ContactPage({
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
        title={dict.contact.title}
        lead={dict.contact.lead}
        // Lấy ảnh bìa cuối — đổi trong Admin → Cài đặt chung → Ảnh bìa
        image={settings.hero.at(-1)?.image}
      />

      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display text-2xl text-ink lg:text-3xl">
                {settings.brandName} — {t(settings.tagline, locale)}
              </h2>

              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="eyebrow text-accent">{dict.contact.hotline}</dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${settings.hotline.replace(/\s/g, "")}`}
                      className="font-display text-2xl text-brand hover:underline"
                    >
                      {settings.hotline}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="eyebrow text-accent">{dict.contact.email}</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-base text-ink hover:text-brand hover:underline"
                    >
                      {settings.email}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="eyebrow text-accent">{dict.contact.social}</dt>
                  <dd className="mt-3 flex flex-wrap gap-3">
                    {[
                      { href: settings.facebook, label: "Facebook", Icon: IconFacebook },
                      { href: settings.zalo ? `https://zalo.me/${settings.zalo}` : "", label: "Zalo", Icon: IconZalo },
                      { href: settings.messenger, label: "Messenger", Icon: IconMessenger },
                      { href: settings.tiktok, label: "TikTok", Icon: IconTikTok },
                    ]
                      .filter((m) => m.href)
                      .map(({ href, label, Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 rounded-full border border-ink/25 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-forest hover:text-cream"
                        >
                          <span className="h-4 w-4">
                            <Icon />
                          </span>
                          {label}
                        </a>
                      ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-10">
                <Button href={`/${locale}/dat-ban`}>{dict.cta.bookNow}</Button>
              </div>
            </div>

            <div>
              <h3 className="eyebrow mb-6 text-accent">{dict.branches.title}</h3>
              <ul className="space-y-7">
                {branches.map((branch) => (
                  <li key={branch.id} className="border-l-2 border-accent/50 pl-5">
                    <p className="font-display text-lg text-ink">
                      {t(branch.name, locale)}
                      {branch.status === "coming-soon" ? (
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-brand">
                          ({dict.branches.comingSoon})
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {t(branch.address, locale)}
                    </p>
                    {branch.hours.map((h, i) => (
                      <p key={i} className="mt-1 text-sm text-ink-soft">
                        {t(h.label, locale)}: {h.time}
                      </p>
                    ))}
                    <a
                      href={`tel:${branch.phone.replace(/\s/g, "")}`}
                      className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
                    >
                      {branch.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
