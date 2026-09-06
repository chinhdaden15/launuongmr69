import { requireAdmin } from "@/lib/auth";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { MENU_CATEGORIES, MENU_ITEMS, MENU_POSTERS } from "@/lib/admin-config";
import { getCategories, getMenuItems, getMenuPosters } from "@/lib/store";

type Row = Record<string, unknown> & { id: string };

/**
 * QUẢN LÝ THỰC ĐƠN — ba phần:
 *   1. Nhóm món      → 6 thẻ ở trang chủ + các tab trên trang Thực đơn
 *   2. Ảnh menu      → nội dung trang Thực đơn, chia theo tab (giá nằm trong ảnh)
 *   3. Món đặc trưng → 4 thẻ có giá ở trang chủ
 */
export default async function AdminMenuPage() {
  await requireAdmin();
  const [categories, posters, items] = await Promise.all([
    getCategories(),
    getMenuPosters(),
    getMenuItems(),
  ]);

  const catOptions = categories.map((c) => ({ id: c.id, label: c.name.vi }));

  return (
    <div className="space-y-14">
      <CollectionEditor
        config={MENU_CATEGORIES}
        initial={categories as unknown as Row[]}
      />

      <CollectionEditor
        config={MENU_POSTERS}
        initial={posters as unknown as Row[]}
        categories={catOptions}
      />

      <CollectionEditor
        config={MENU_ITEMS}
        initial={items as unknown as Row[]}
        categories={catOptions}
      />
    </div>
  );
}
