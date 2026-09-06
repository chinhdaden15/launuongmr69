/** Kiểu dữ liệu dùng chung cho toàn bộ website Mr.69 */

/** Chuỗi song ngữ. Mọi nội dung hiển thị đều dùng kiểu này. */
export type Bilingual = { vi: string; en: string };

export type Locale = "vi" | "en";

/** Cấu hình chung của thương hiệu — sửa trong /admin/cai-dat */
export type SiteSettings = {
  brandName: string;
  logo: string;
  tagline: Bilingual;
  hotline: string;
  email: string;
  zalo: string;
  facebook: string;
  messenger: string;
  /** Đường dẫn kênh TikTok, ví dụ https://www.tiktok.com/@launuongmr69 */
  tiktok: string;
  hero: HeroSlide[];
  about: {
    image: string;
    title: Bilingual;
    body: Bilingual;
  };
  bookingNote: Bilingual;
  /** Email nhận thông báo khi có đơn đặt bàn mới */
  notifyEmail: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: Bilingual;
  title: Bilingual;
  subtitle: Bilingual;
  ctaLabel: Bilingual;
  ctaHref: string;
  order: number;
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: Bilingual;
  desc: Bilingual;
  image: string;
  order: number;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: Bilingual;
  desc: Bilingual;
  /** Giá theo VND, lưu dạng số nguyên. 0 = "theo thời giá" */
  price: number;
  unit: Bilingual;
  image: string;
  featured: boolean;
  available: boolean;
  order: number;
};

/**
 * Ảnh menu — mỗi tấm là một trang thực đơn do quán tự thiết kế, bên trong
 * đã có sẵn tên món và giá. Trang Thực đơn chỉ hiển thị những ảnh này.
 */
export type MenuPoster = {
  id: string;
  /** Thuộc nhóm nào — quyết định ảnh hiện ở tab nào trên trang Thực đơn. */
  categoryId: string;
  image: string;
  /** Mô tả ảnh — không hiện ra ngoài, dùng cho Google và người khiếm thị. */
  caption: Bilingual;
  order: number;
};

export type Promotion = {
  id: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  body: Bilingual;
  image: string;
  badge: Bilingual;
  startDate: string;
  endDate: string;
  published: boolean;
  order: number;
};

export type Branch = {
  id: string;
  name: Bilingual;
  address: Bilingual;
  phone: string;
  hours: { label: Bilingual; time: string }[];
  mapEmbed: string;
  mapLink: string;
  image: string;
  status: "open" | "coming-soon";
  order: number;
};

export type GalleryPhoto = {
  id: string;
  image: string;
  caption: Bilingual;
  album: "khong-gian" | "mon-an" | "su-kien";
  order: number;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  branchId: string;
  date: string;
  time: string;
  guests: number;
  note: string;
  status: "new" | "confirmed" | "done" | "cancelled";
  createdAt: string;
};
