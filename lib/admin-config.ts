/**
 * Định nghĩa các ô nhập liệu cho từng mục trong trang admin.
 *
 * Muốn thêm một ô mới (ví dụ "Thành phần" cho món ăn):
 *   1. Thêm trường vào lib/types.ts
 *   2. Thêm một dòng vào mảng fields bên dưới
 *   3. Hiển thị nó ở giao diện ngoài trang chủ
 * Không cần sửa gì thêm — giao diện admin tự sinh theo định nghĩa này.
 */

export type FieldDef =
  | { key: string; label: string; type: "text" | "slug" | "number" | "image" | "checkbox" | "date" | "html"; hint?: string }
  | { key: string; label: string; type: "textarea"; rows?: number; hint?: string }
  | { key: string; label: string; type: "bilingual"; hint?: string }
  | { key: string; label: string; type: "bilingual-textarea"; rows?: number; hint?: string }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; hint?: string }
  | { key: string; label: string; type: "category"; hint?: string }
  | { key: string; label: string; type: "hours"; hint?: string };

export type CollectionConfig = {
  /** Tên file dữ liệu trong thư mục /data */
  name: string;
  title: string;
  description: string;
  /** Trường dùng làm tiêu đề mỗi dòng trong danh sách */
  titleField: string;
  fields: FieldDef[];
  /** Giá trị mặc định khi bấm "Thêm mới" */
  blank: Record<string, unknown>;
};

const BILINGUAL = { vi: "", en: "" };

export const MENU_CATEGORIES: CollectionConfig = {
  name: "menu-categories",
  title: "Nhóm món",
  description:
    "Các nhóm hiện trên trang chủ và trang thực đơn (Lẩu, Nướng, Combo...). Kéo số thứ tự để đổi vị trí.",
  titleField: "name",
  fields: [
    { key: "name", label: "Tên nhóm", type: "bilingual" },
    { key: "slug", label: "Đường dẫn", type: "slug", hint: "Chỉ dùng chữ thường và dấu gạch ngang, ví dụ: lau-nuong" },
    { key: "desc", label: "Mô tả ngắn", type: "bilingual-textarea", rows: 3 },
    { key: "image", label: "Ảnh nhóm", type: "image", hint: "Ảnh ngang, khoảng 900×700" },
    { key: "order", label: "Thứ tự hiển thị", type: "number" },
  ],
  blank: { name: BILINGUAL, slug: "", desc: BILINGUAL, image: "", order: 99 },
};

export const MENU_ITEMS: CollectionConfig = {
  name: "menu-items",
  title: "Món đặc trưng (hiện ở TRANG CHỦ)",
  description:
    "Chỉ những món bật 'Nổi bật' mới hiện ra, ở khối Món đặc trưng trên trang chủ. " +
    "Trang Thực đơn KHÔNG lấy dữ liệu ở đây — trang đó dùng ảnh menu bên dưới.",
  titleField: "name",
  fields: [
    { key: "name", label: "Tên món", type: "bilingual" },
    { key: "categoryId", label: "Thuộc nhóm", type: "category" },
    { key: "desc", label: "Mô tả", type: "bilingual-textarea", rows: 3 },
    { key: "price", label: "Giá (VNĐ)", type: "number", hint: "Nhập số, ví dụ 189000. Để 0 nghĩa là 'theo thời giá'." },
    { key: "unit", label: "Đơn vị", type: "bilingual", hint: "Ví dụ: / phần 200g" },
    { key: "image", label: "Ảnh món", type: "image", hint: "Ảnh ngang, khoảng 800×600" },
    { key: "featured", label: "Món nổi bật (hiện ở trang chủ)", type: "checkbox" },
    { key: "available", label: "Còn phục vụ", type: "checkbox" },
    { key: "order", label: "Thứ tự trong nhóm", type: "number" },
  ],
  blank: {
    name: BILINGUAL, categoryId: "", desc: BILINGUAL, price: 0,
    unit: { vi: "/ phần", en: "/ portion" }, image: "",
    featured: false, available: true, order: 99,
  },
};

export const MENU_POSTERS: CollectionConfig = {
  name: "menu-posters",
  title: "Ảnh menu (hiện ở TRANG THỰC ĐƠN)",
  description:
    "Các trang thực đơn do quán tự thiết kế, bên trong đã có sẵn tên món và giá. " +
    "Trên trang Thực đơn, tab MENU hiện tất cả ảnh; bấm sang mục nào thì chỉ còn " +
    "ảnh của mục đó — nên nhớ chọn đúng 'Thuộc mục' cho từng ảnh. " +
    "Dùng mũi tên ↑ ↓ để sắp thứ tự. Muốn đổi giá thì thiết kế lại ảnh rồi tải đè lên.",
  titleField: "caption",
  fields: [
    { key: "image", label: "Ảnh trang menu", type: "image", hint: "Ảnh dọc tỉ lệ 4:5, khoảng 900×1125. Chữ trong ảnh nên to, rõ để đọc được trên điện thoại." },
    { key: "categoryId", label: "Thuộc mục", type: "category", hint: "Ảnh sẽ hiện khi khách bấm vào mục này trên thanh chọn. Tab MENU luôn hiện tất cả." },
    { key: "caption", label: "Mô tả ảnh", type: "bilingual", hint: "Không hiện ra ngoài. Dùng cho Google và người khiếm thị. Ví dụ: Trang menu lẩu — phần 1" },
    { key: "order", label: "Thứ tự", type: "number" },
  ],
  blank: { image: "", categoryId: "", caption: BILINGUAL, order: 99 },
};

export const PROMOTIONS: CollectionConfig = {
  name: "promotions",
  title: "Ưu đãi & Combo",
  description:
    "Chương trình khuyến mãi và sự kiện. Bỏ tick 'Đang chạy' để tạm ẩn mà không xoá.",
  titleField: "title",
  fields: [
    { key: "title", label: "Tiêu đề", type: "bilingual" },
    { key: "slug", label: "Đường dẫn", type: "slug", hint: "Ví dụ: set-lau-song-vi-359k" },
    { key: "badge", label: "Nhãn góc ảnh", type: "bilingual", hint: "Ví dụ: Ưu đãi / Sự kiện / Hằng ngày" },
    { key: "excerpt", label: "Mô tả ngắn", type: "bilingual-textarea", rows: 2 },
    { key: "body", label: "Nội dung đầy đủ", type: "bilingual-textarea", rows: 10, hint: "Mỗi dòng xuống dòng sẽ thành một đoạn trên web." },
    { key: "image", label: "Ảnh", type: "image", hint: "Ảnh ngang, khoảng 1200×800" },
    { key: "startDate", label: "Bắt đầu", type: "date" },
    { key: "endDate", label: "Kết thúc", type: "date" },
    { key: "published", label: "Đang chạy", type: "checkbox" },
    { key: "order", label: "Thứ tự", type: "number" },
  ],
  blank: {
    title: BILINGUAL, slug: "", badge: { vi: "Ưu đãi", en: "Offer" },
    excerpt: BILINGUAL, body: BILINGUAL, image: "",
    startDate: "", endDate: "", published: true, order: 99,
  },
};

export const BRANCHES: CollectionConfig = {
  name: "branches",
  title: "Chi nhánh",
  description:
    "Các cơ sở của Mr.69. Thêm cơ sở mới ở đây là trang chủ, chân trang và form đặt bàn tự cập nhật theo.",
  titleField: "name",
  fields: [
    { key: "name", label: "Tên cơ sở", type: "bilingual" },
    { key: "address", label: "Địa chỉ", type: "bilingual-textarea", rows: 2 },
    { key: "phone", label: "Số điện thoại", type: "text" },
    { key: "hours", label: "Giờ mở cửa", type: "hours" },
    { key: "image", label: "Ảnh mặt tiền", type: "image", hint: "Ảnh ngang, khoảng 1200×800" },
    { key: "mapLink", label: "Link Google Maps", type: "text", hint: "Dán link chỉ đường từ Google Maps" },
    { key: "mapEmbed", label: "Mã nhúng bản đồ", type: "html", hint: "Trên Google Maps bấm Chia sẻ → Nhúng bản đồ → sao chép đoạn mã <iframe> rồi dán vào đây" },
    {
      key: "status", label: "Trạng thái", type: "select",
      options: [
        { value: "open", label: "Đang hoạt động" },
        { value: "coming-soon", label: "Sắp khai trương" },
      ],
    },
    { key: "order", label: "Thứ tự", type: "number" },
  ],
  blank: {
    name: BILINGUAL, address: BILINGUAL, phone: "",
    hours: [{ label: { vi: "Hằng ngày", en: "Daily" }, time: "16:00 – 24:00" }],
    image: "", mapLink: "", mapEmbed: "", status: "open", order: 99,
  },
};

export const GALLERY: CollectionConfig = {
  name: "gallery",
  title: "Thư viện ảnh",
  description: "Ảnh không gian, món ăn và sự kiện hiện ở trang Không gian.",
  titleField: "caption",
  fields: [
    { key: "image", label: "Ảnh", type: "image", hint: "Ảnh ngang, khoảng 1000×750" },
    { key: "caption", label: "Chú thích", type: "bilingual" },
    {
      key: "album", label: "Thuộc album", type: "select",
      options: [
        { value: "khong-gian", label: "Không gian" },
        { value: "mon-an", label: "Món ăn" },
        { value: "su-kien", label: "Sự kiện" },
      ],
    },
    { key: "order", label: "Thứ tự", type: "number" },
  ],
  blank: { image: "", caption: BILINGUAL, album: "khong-gian", order: 99 },
};

export const COLLECTIONS: Record<string, CollectionConfig> = {
  "menu-categories": MENU_CATEGORIES,
  "menu-items": MENU_ITEMS,
  "menu-posters": MENU_POSTERS,
  promotions: PROMOTIONS,
  branches: BRANCHES,
  gallery: GALLERY,
};
