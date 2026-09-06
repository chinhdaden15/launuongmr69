import { requireAdmin } from "@/lib/auth";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { GALLERY } from "@/lib/admin-config";
import { getGallery } from "@/lib/store";

/** QUẢN LÝ THƯ VIỆN ẢNH */
export default async function AdminGalleryPage() {
  await requireAdmin();
  const gallery = await getGallery();

  return (
    <CollectionEditor
      config={GALLERY}
      initial={gallery as unknown as (Record<string, unknown> & { id: string })[]}
    />
  );
}
