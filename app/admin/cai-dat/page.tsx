import { requireAdmin } from "@/lib/auth";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { getSettings } from "@/lib/store";

/** CÀI ĐẶT CHUNG */
export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return <SettingsEditor initial={settings} />;
}
