import { requireAdmin } from "@/lib/auth";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { PROMOTIONS } from "@/lib/admin-config";
import { getPromotions } from "@/lib/store";

/** QUẢN LÝ ƯU ĐÃI & COMBO */
export default async function AdminPromotionsPage() {
  await requireAdmin();
  const promotions = await getPromotions();

  return (
    <CollectionEditor
      config={PROMOTIONS}
      initial={promotions as unknown as (Record<string, unknown> & { id: string })[]}
    />
  );
}
