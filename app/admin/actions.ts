"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, isLoggedIn, login, logout } from "@/lib/auth";
import { CHI_XEM, LOI_CHI_XEM } from "@/lib/env";
import {
  getBookings,
  saveBookings,
  saveBranches,
  saveCategories,
  saveGallery,
  saveMenuItems,
  saveMenuPosters,
  savePromotions,
  saveSettings,
} from "@/lib/store";
import type { Booking, SiteSettings } from "@/lib/types";

/** Làm mới toàn bộ trang công khai sau khi lưu, để thay đổi hiện ra ngay. */
function refreshSite() {
  revalidatePath("/", "layout");
}

async function requireAuth() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

// ------------------------------------------------------------ đăng nhập
export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    return { error: "Mật khẩu không đúng. Kiểm tra lại file .env.local." };
  }
  await login();
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

// ------------------------------------------------------- lưu dữ liệu
const SAVERS: Record<string, (v: never) => Promise<void>> = {
  "menu-categories": saveCategories as never,
  "menu-items": saveMenuItems as never,
  "menu-posters": saveMenuPosters as never,
  promotions: savePromotions as never,
  branches: saveBranches as never,
  gallery: saveGallery as never,
};

/** Lưu nguyên một danh sách (món ăn, chi nhánh, ưu đãi...). */
export async function saveCollectionAction(name: string, json: string) {
  await requireAuth();
  if (CHI_XEM) return { error: LOI_CHI_XEM };
  const saver = SAVERS[name];
  if (!saver) return { error: "Không tìm thấy mục dữ liệu này." };

  try {
    await saver(JSON.parse(json) as never);
    refreshSite();
    return { ok: true as const };
  } catch (err) {
    console.error("Lỗi khi lưu", name, err);
    return { error: "Lưu không thành công. Bạn thử lại giúp mình nhé." };
  }
}

/** Lưu cấu hình chung (logo, hotline, ảnh bìa, giới thiệu...). */
export async function saveSettingsAction(json: string) {
  await requireAuth();
  if (CHI_XEM) return { error: LOI_CHI_XEM };
  try {
    await saveSettings(JSON.parse(json) as SiteSettings);
    refreshSite();
    return { ok: true as const };
  } catch (err) {
    console.error("Lỗi khi lưu cấu hình", err);
    return { error: "Lưu không thành công. Bạn thử lại giúp mình nhé." };
  }
}

// ------------------------------------------------------------ đặt bàn
export async function updateBookingAction(id: string, status: Booking["status"]) {
  await requireAuth();
  if (CHI_XEM) return { error: LOI_CHI_XEM };
  const all = await getBookings();
  const next = all.map((b) => (b.id === id ? { ...b, status } : b));
  await saveBookings(next);
  revalidatePath("/admin/dat-ban");
  return { ok: true as const };
}

export async function deleteBookingAction(id: string) {
  await requireAuth();
  if (CHI_XEM) return { error: LOI_CHI_XEM };
  const all = await getBookings();
  await saveBookings(all.filter((b) => b.id !== id));
  revalidatePath("/admin/dat-ban");
  return { ok: true as const };
}
