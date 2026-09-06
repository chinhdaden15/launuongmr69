import { requireAdmin } from "@/lib/auth";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { BRANCHES } from "@/lib/admin-config";
import { getBranches } from "@/lib/store";

/** QUẢN LÝ CHI NHÁNH */
export default async function AdminBranchesPage() {
  await requireAdmin();
  const branches = await getBranches();

  return (
    <CollectionEditor
      config={BRANCHES}
      initial={branches as unknown as (Record<string, unknown> & { id: string })[]}
    />
  );
}
