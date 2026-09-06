import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { BranchSection } from "@/components/site/BranchSection";
import { Container } from "@/components/site/Container";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { getBranches } from "@/lib/store";

export const metadata: Metadata = { title: "Chi nhánh" };

/** TRANG CHI NHÁNH — danh sách cơ sở + bản đồ nhúng của cơ sở đang hoạt động. */
export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const branches = await getBranches();

  const withMap = branches.filter((b) => b.mapEmbed);

  return (
    <>
      <PageHeader
        title={dict.branches.title}
        lead={dict.branches.lead}
        // Lấy ảnh mặt tiền của cơ sở đầu tiên có ảnh — đổi trong Admin → Chi nhánh
        image={branches.find((b) => b.image)?.image}
      />

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

      {withMap.length ? (
        <section className="bg-cream pb-20 lg:pb-28">
          <Container>
            <div className="space-y-10">
              {withMap.map((branch) => (
                <div key={branch.id}>
                  <h3 className="mb-4 font-display text-xl text-ink">
                    {t(branch.name, locale)}
                  </h3>
                  <div
                    className="aspect-video w-full overflow-hidden rounded-card border border-ink/12 [&_iframe]:h-full [&_iframe]:w-full"
                    // Mã nhúng bản đồ do chủ quán tự dán vào trang admin.
                    dangerouslySetInnerHTML={{ __html: branch.mapEmbed }}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
