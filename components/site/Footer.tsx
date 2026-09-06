import Image from "next/image";
import Link from "next/link";
import type { Branch, Locale, SiteSettings } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Container } from "./Container";
import {
  IconFacebook,
  IconMessenger,
  IconTikTok,
  IconZalo,
} from "./BrandIcons";
import type { NavItem } from "./Header";

/**
 * MỤC 9 — CHÂN TRANG
 * Ba cột trên máy tính (thương hiệu · khám phá · chi nhánh), xếp dọc trên điện thoại.
 * Danh sách chi nhánh lấy thẳng từ dữ liệu nên thêm cơ sở mới là tự hiện ở đây.
 */
export function Footer({
  settings,
  branches,
  nav,
  locale,
  labels,
}: {
  settings: SiteSettings;
  branches: Branch[];
  nav: NavItem[];
  locale: Locale;
  labels: {
    explore: string;
    branches: string;
    contact: string;
    hotline: string;
    rights: string;
    comingSoon: string;
  };
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest pt-16 text-cream/75 lg:pt-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.7fr_1.4fr] lg:gap-16">
          {/* Cột 1 — thương hiệu */}
          <div>
            <Image
              src={settings.logo}
              alt={settings.brandName}
              width={160}
              height={64}
              className="h-14 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              {t(settings.tagline, locale)} — {settings.brandName}
            </p>

            <div className="mt-6 space-y-1.5 text-sm">
              <p>
                <span className="text-cream/50">{labels.hotline}: </span>
                <a
                  href={`tel:${settings.hotline.replace(/\s/g, "")}`}
                  className="font-medium text-gold hover:underline"
                >
                  {settings.hotline}
                </a>
              </p>
              <p>
                <span className="text-cream/50">Email: </span>
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-gold hover:underline"
                >
                  {settings.email}
                </a>
              </p>
            </div>

            {/* Logo mạng xã hội — nút nào chưa khai báo link thì tự ẩn */}
            <div className="mt-6 flex gap-2.5">
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
                    aria-label={label}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 p-2.5 text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon />
                  </a>
                ))}
            </div>
          </div>

          {/* Cột 2 — khám phá */}
          <nav aria-label={labels.explore}>
            <h3 className="eyebrow mb-5 text-gold">{labels.explore}</h3>
            <ul className="space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-gold hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cột 3 — chi nhánh */}
          <div>
            <h3 className="eyebrow mb-5 text-gold">{labels.branches}</h3>
            <ul className="grid gap-6 sm:grid-cols-2">
              {branches.map((branch) => (
                <li key={branch.id} className="text-sm">
                  <p className="font-display text-base text-cream">
                    {t(branch.name, locale)}
                    {branch.status === "coming-soon" ? (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-gold">
                        ({labels.comingSoon})
                      </span>
                    ) : null}
                  </p>
                  {branch.hours.map((h, i) => (
                    <p key={i} className="mt-1 text-cream/60">
                      {h.time}
                    </p>
                  ))}
                  <p className="mt-1.5 leading-relaxed text-cream/70">
                    {t(branch.address, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/12 py-7 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.brandName}. {labels.rights}
          </p>
          <p>launuongmr69.com</p>
        </div>
      </Container>
    </footer>
  );
}
