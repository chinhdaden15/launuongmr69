import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingContact } from "@/components/site/FloatingContact";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { buildNav } from "@/lib/nav";
import { getBranches, getSettings } from "@/lib/store";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [settings, branches] = await Promise.all([getSettings(), getBranches()]);
  const nav = buildNav(dict, locale);

  return (
    <>
      <Header
        nav={nav}
        logo={settings.logo}
        brandName={settings.brandName}
        bookLabel={dict.cta.bookNow}
        locale={locale}
      />

      {/* Thẻ main để trình đọc màn hình nhảy thẳng tới nội dung */}
      <main id="noi-dung">{children}</main>

      <Footer
        settings={settings}
        branches={branches}
        nav={nav}
        locale={locale}
        labels={{
          explore: dict.footer.explore,
          branches: dict.footer.branches,
          contact: dict.footer.contact,
          hotline: dict.footer.hotline,
          rights: dict.footer.rights,
          comingSoon: dict.branches.comingSoon,
        }}
      />

      <FloatingContact
        hotline={settings.hotline}
        zalo={settings.zalo}
        messenger={settings.messenger}
        tiktok={settings.tiktok}
      />
    </>
  );
}
