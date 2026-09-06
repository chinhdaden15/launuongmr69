import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type {
  Booking,
  Branch,
  GalleryPhoto,
  MenuCategory,
  MenuItem,
  MenuPoster,
  Promotion,
  SiteSettings,
} from "./types";

/**
 * Lớp lưu trữ dữ liệu.
 *
 * Hiện tại đọc/ghi file JSON trong thư mục /data — chạy được ngay trên máy,
 * không cần đăng ký dịch vụ nào. Khi đưa lên tên miền thật, chỉ cần thay
 * phần thân của readCollection/writeCollection sang Supabase là xong,
 * toàn bộ giao diện và trang admin giữ nguyên.
 */

const DATA_DIR = path.join(process.cwd(), "data");

type Shape = {
  settings: SiteSettings;
  "menu-categories": MenuCategory[];
  "menu-items": MenuItem[];
  "menu-posters": MenuPoster[];
  promotions: Promotion[];
  branches: Branch[];
  gallery: GalleryPhoto[];
  bookings: Booking[];
};

async function readJson<K extends keyof Shape>(key: K): Promise<Shape[K]> {
  const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
  return JSON.parse(raw) as Shape[K];
}

async function writeJson<K extends keyof Shape>(key: K, value: Shape[K]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${key}.json`);
  // Ghi ra file tạm rồi đổi tên, tránh mất dữ liệu nếu tắt máy giữa chừng.
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}

const byOrder = <T extends { order: number }>(list: T[]) =>
  [...list].sort((a, b) => a.order - b.order);

export const getSettings = () => readJson("settings");
export const saveSettings = (v: SiteSettings) => writeJson("settings", v);

export async function getCategories() {
  return byOrder(await readJson("menu-categories"));
}
export const saveCategories = (v: MenuCategory[]) =>
  writeJson("menu-categories", v);

export async function getMenuItems() {
  return byOrder(await readJson("menu-items"));
}
export const saveMenuItems = (v: MenuItem[]) => writeJson("menu-items", v);

export async function getMenuPosters() {
  return byOrder(await readJson("menu-posters"));
}
export const saveMenuPosters = (v: MenuPoster[]) =>
  writeJson("menu-posters", v);

export async function getPromotions({ publishedOnly = false } = {}) {
  const all = byOrder(await readJson("promotions"));
  return publishedOnly ? all.filter((p) => p.published) : all;
}
export const savePromotions = (v: Promotion[]) => writeJson("promotions", v);

export async function getBranches() {
  return byOrder(await readJson("branches"));
}
export const saveBranches = (v: Branch[]) => writeJson("branches", v);

export async function getGallery(album?: GalleryPhoto["album"]) {
  const all = byOrder(await readJson("gallery"));
  return album ? all.filter((g) => g.album === album) : all;
}
export const saveGallery = (v: GalleryPhoto[]) => writeJson("gallery", v);

export async function getBookings() {
  const all = await readJson("bookings");
  return [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export const saveBookings = (v: Booking[]) => writeJson("bookings", v);

export async function addBooking(b: Booking) {
  const all = await readJson("bookings");
  all.push(b);
  await writeJson("bookings", all);
  return b;
}
