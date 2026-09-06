# Mr.69 — Lẩu & Nướng

Website chính thức của quán lẩu nướng Mr.69, kèm trang quản trị để tự cập nhật
nội dung mà không cần biết lập trình.

---

## 1. Chạy trên máy của bạn

Mở Terminal, vào thư mục dự án rồi chạy:

```bash
npm run dev
```

Sau đó mở trình duyệt:

| Địa chỉ | Nội dung |
|---|---|
| http://localhost:3000 | Trang chủ (tiếng Việt) |
| http://localhost:3000/en | Bản tiếng Anh |
| http://localhost:3000/admin | Trang quản trị |

Mật khẩu admin mặc định: `mr69@2026` — đổi trong file `.env.local`.

Muốn dừng: bấm `Ctrl + C` trong Terminal.

---

## 2. Bản đồ các mục — sửa ở đâu

Mỗi mục trên trang chủ là một file riêng trong `components/site/`.
Muốn chỉnh **bố cục** thì sửa file; muốn chỉnh **nội dung** thì vào `/admin`.

| # | Mục trên web | File bố cục | Nội dung sửa ở |
|---|---|---|---|
| 1 | Thanh điều hướng | `components/site/Header.tsx` | `lib/nav.ts` |

Bấm vào logo (hoặc mục menu) khi đang đứng sẵn ở chính trang đó thì trang cuộn
lên đầu — xem hàm `veDauTrang` trong `Header.tsx`. Không có nó thì trình duyệt
chẳng làm gì cả, khách tưởng nút hỏng.

| 2 | Ảnh bìa chạy slide | `components/site/Hero.tsx` | Admin → Cài đặt chung |
| 3 | Giới thiệu quán | `components/site/AboutSection.tsx` | Admin → Cài đặt chung |
| 4 | Các nhóm món | `components/site/MenuCategories.tsx` | Admin → Thực đơn |
| 5 | Món đặc trưng | `components/site/FeaturedDishes.tsx` | Admin → Thực đơn → *Món đặc trưng* |
| 6 | Ưu đãi & Sự kiện | `components/site/PromotionsSection.tsx` | Admin → Ưu đãi & Combo |
| 7 | Thư viện ảnh | `components/site/GalleryStrip.tsx` | Admin → Thư viện ảnh |
| 8 | Chi nhánh | `components/site/BranchSection.tsx` | Admin → Chi nhánh |
| 9 | Chân trang | `components/site/Footer.tsx` | Admin → Cài đặt chung |
| 10 | Nút gọi / Zalo nổi | `components/site/FloatingContact.tsx` | Admin → Cài đặt chung |
| 11 | Form đặt bàn | `components/site/BookingForm.tsx` | — |

### Hai loại dữ liệu món — đừng nhầm

| | Dùng ở đâu | Sửa ở |
|---|---|---|
| **Ảnh menu** | Trang Thực đơn. Giá nằm sẵn trong ảnh. | Admin → Thực đơn → *Ảnh menu* |
| **Nhóm món** | Vừa là 6 thẻ ở trang chủ, vừa là các tab trên trang Thực đơn. | Admin → Thực đơn → *Nhóm món* |
| **Món đặc trưng** | 4 thẻ có giá ở trang chủ. | Admin → Thực đơn → *Món đặc trưng* |

Muốn đổi giá trên trang Thực đơn: thiết kế lại tấm ảnh menu rồi tải đè lên,
không sửa trong web.

### Trang Thực đơn hoạt động thế nào

Thanh chọn mục ở đầu trang: **MENU · KHAI VỊ · LẨU · NƯỚNG · ĂN VẶT · MÓN THÊM · GIẢI KHÁT**

- Tab **MENU** hiện **toàn bộ** ảnh menu
- Bấm sang mục khác thì chỉ còn ảnh của mục đó
- Bấm vào một ảnh để xem toàn màn hình (phím ← → lật trang, Esc đóng)

Mỗi ảnh menu khi thêm mới phải chọn **Thuộc mục** — đó là thứ quyết định ảnh
hiện ở tab nào. Các tab lấy từ mục *Nhóm món*, nên muốn thêm/đổi tên/bỏ tab thì
sửa ở đó. Mục nào chưa có ảnh nào sẽ tự ẩn khỏi thanh chọn.

Thứ tự ảnh chính là thứ tự bạn xếp trong admin — dùng mũi tên ↑ ↓ để kéo lên
kéo xuống. Ảnh nên là ảnh dọc tỉ lệ 4:5 (khoảng 900×1125), chữ trong ảnh để to
cho dễ đọc trên điện thoại.

### Ảnh bìa trang chủ chuyển cảnh thế nào

Các ảnh bìa nằm cạnh nhau thành một dải ngang và **trượt** sang khi đổi ảnh —
ảnh và chữ đi cùng nhau. Không dùng kiểu mờ dần chồng lên nhau vì nhìn hay bị
giật mắt.

Dải ảnh **chạy vòng tròn**: hết ảnh cuối thì trượt tiếp sang phải về ảnh đầu,
không bao giờ tua ngược lại. Làm được vậy nhờ nhân thêm hai bản sao ở hai đầu
dải — sau khi trượt vào bản sao, hệ thống nhảy thầm về ảnh thật tương ứng trong
đúng một khoảnh khắc, mắt không nhận ra vì hai khung hình giống hệt nhau.

| Muốn đổi | Sửa ở |
|---|---|
| Tốc độ trượt (đang là 0,9 giây) | `.hero-track` trong `app/globals.css` **và** hằng số `MS_TRUOT` trong `Hero.tsx` — hai chỗ phải khớp nhau |
| Thời gian giữa hai ảnh (đang là 7 giây) | hằng số `GIAY_MOI_ANH` trong `components/site/Hero.tsx` |
| Phải kéo bao xa mới đổi ảnh (đang là 15% bề ngang) | số `0.15` trong hàm `nhacTay` của `Hero.tsx` |
| Búng nhanh cỡ nào thì tính là đổi ảnh | hằng số `VUOT_NHANH` trong `Hero.tsx` |
| Nhịp trượt nốt sau khi buông tay (đang 0,38 giây) | hằng số `MS_THA_TAY` trong `Hero.tsx` |
| Nội dung từng ảnh bìa | Admin → Cài đặt chung → Ảnh bìa trang chủ |

**Vuốt tay được:** trên điện thoại khách đặt ngón lên ảnh kéo ngang, dải ảnh đi
theo ngón tay. Nhấc tay ra thì sang ảnh kế nếu **kéo quá 15% bề ngang màn hình**
hoặc **búng nhanh một cái** (dù kéo chưa xa); chưa đạt thì trượt về chỗ cũ. Kéo
dọc thì nhường cho trang cuộn bình thường.

Lúc buông tay, ảnh trượt nốt bằng một nhịp **riêng** (0,38 giây, đi tiếp theo đà
rồi chậm dần) chứ không dùng nhịp của phần tự chạy. Nếu dùng chung thì ảnh sẽ
khựng lại một cái rồi mới đi tiếp, vì nhịp tự chạy khởi động chậm — trong khi
ngón tay vừa buông ra thì đang đi rất nhanh.

Bấm vào chấm bên dưới để nhảy tới ảnh bất kỳ — đồng hồ đếm 7 giây sẽ tự đặt lại
từ đầu nên ảnh không nhảy ngay sau khi khách vừa bấm hoặc vừa vuốt. Máy nào bật
chế độ "giảm chuyển động" thì ảnh đổi ngay, không trượt.

### Vuốt ngang trên điện thoại

Năm mục trên trang chủ đều dùng chung kiểu **vuốt trái/phải** khi xem bằng điện
thoại, thay vì xếp dọc kéo dài: Nhóm món · Món đặc trưng · Ưu đãi · Không gian ·
Chi nhánh. Mỗi lần xem một thẻ, thẻ kế tiếp ló ra ở mép phải, bên dưới có hàng
chấm cho biết đang ở thẻ thứ mấy (bấm vào chấm là nhảy tới thẻ đó).

Từ máy tính bảng trở lên thì quay về lưới bình thường, hàng chấm tự ẩn.

| Muốn đổi | Sửa ở |
|---|---|
| Bề rộng mỗi thẻ khi vuốt (đang là `82vw`) | `components/site/swipe-item.ts` |
| Cách chạy của dải vuốt và hàng chấm | `components/site/SwipeRow.tsx` |
| Số cột trên máy tính của từng mục | thuộc tính `gridClass` trong mục đó |

> Lưu ý khi sửa code: hằng số `SWIPE_ITEM` phải nằm ở file riêng không có
> `"use client"`. Nếu để chung trong `SwipeRow.tsx` thì Next.js hiểu nhầm nó là
> mã phía trình duyệt và class sẽ không áp được — thẻ sẽ co lại còn 0px.

**Thứ tự các mục trên trang chủ** nằm trong `app/[locale]/page.tsx`.
Kéo khối lên/xuống là đổi vị trí; bọc trong `{/* ... */}` là tạm ẩn.

### Các trang con

| Trang | File |
|---|---|
| Giới thiệu | `app/[locale]/gioi-thieu/page.tsx` |
| Thực đơn | `app/[locale]/thuc-don/page.tsx` |
| Thanh chọn mục + lưới ảnh | `components/site/MenuBrowser.tsx` |
| Lưới ảnh + xem phóng to | `components/site/MenuPosterGrid.tsx` |
| Không gian | `app/[locale]/khong-gian/page.tsx` |
| Ưu đãi | `app/[locale]/uu-dai/page.tsx` |
| Chi tiết ưu đãi | `app/[locale]/uu-dai/[slug]/page.tsx` |
| Chi nhánh | `app/[locale]/chi-nhanh/page.tsx` |
| Đặt bàn | `app/[locale]/dat-ban/page.tsx` |
| Liên hệ | `app/[locale]/lien-he/page.tsx` |

---

### Logo mạng xã hội

Nằm trong `components/site/BrandIcons.tsx`, vẽ theo đúng logo chính thức của
từng bên (lấy từ bộ Simple Icons). Dùng ở ba chỗ: cột nút nổi bên phải màn hình,
chân trang, và trang Liên hệ.

Mỗi kênh chỉ hiện khi đã khai báo đường dẫn trong **Admin → Cài đặt chung** —
để trống ô nào thì nút đó tự ẩn, không để lại chỗ trống.

Muốn thêm một mạng xã hội mới (ví dụ Instagram):
1. Tải hình vẽ: `curl -sL https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg`
2. Chép đoạn `d="..."` vào một hàm mới trong `BrandIcons.tsx`
3. Thêm trường vào `SiteSettings` (`lib/types.ts`), ô nhập trong `SettingsEditor.tsx`,
   rồi thêm vào ba danh sách ở `FloatingContact.tsx`, `Footer.tsx`, `lien-he/page.tsx`

## 3. Đổi màu và font toàn website

Mở `app/globals.css`, sửa khối `@theme` ở đầu file:

```css
/* 6 mã màu chủ đạo của quán */
--color-cream:      #f6f2e7;   /* kem sáng  — nền chính */
--color-cream-deep: #e6e2d6;   /* kem xám   — nền khối xen kẽ */
--color-ink:        #2e2e2e;   /* đen mềm   — màu chữ chính */
--color-sage:       #afc69d;   /* xanh sage — chữ, viền trên nền tối */
--color-accent:     #8b6e3d;   /* nâu đồng  — giá tiền, link, nhãn */
--color-gold:       #d4c08a;   /* vàng nhạt — nhãn, viền trên nền tối */

/* 4 màu suy ra thêm (bảng gốc không có màu đủ tối để đặt chữ trắng lên) */
--color-forest:     #374a32;   /* xanh đậm — header, footer, khối tối */
--color-brand:      #55704a;   /* xanh vừa — nút bấm, tên nhóm món */
--color-ink-soft:   #5f5c55;   /* xám chữ  — đoạn văn, mô tả */
--color-shade:      #1a231a;   /* CHỈ để phủ lên ảnh */

/* Bo góc — đổi một dòng là mọi ảnh, thẻ trên web bo theo */
--radius-card:      1.25rem;   /* 20px — ảnh, thẻ */
--radius-soft:      0.875rem;  /* 14px — ảnh nhỏ, ô nhập liệu */
```

Nút bấm bo tròn hoàn toàn (hình viên thuốc). Muốn nút bo vuông vắn hơn thì
đổi `rounded-full` thành `rounded-card` trong `components/site/Button.tsx`.

Sửa một dòng ở đây là **cả website đổi theo**. Font đổi trong `app/layout.tsx`
(hiện dùng **Phudu** cho tiêu đề và **Be Vietnam Pro** cho chữ thường — cả hai
đều miễn phí và đủ dấu tiếng Việt).

---

### Dòng chữ vàng nhỏ trên tiêu đề

Đã bỏ khỏi tất cả các mục vì trùng nội dung với tiêu đề bên dưới. Nếu sau này
muốn hiện lại ở mục nào, thêm lại thuộc tính `eyebrow` cho mục đó, ví dụ trong
`app/[locale]/page.tsx`:

```tsx
<PromotionsSection
  eyebrow="Ưu đãi"      // ← thêm dòng này là chữ nhỏ hiện lại
  title={dict.home.promoTitle}
```

Hai chỗ vẫn còn chữ nhỏ và nên giữ:
- Dòng chữ trên ảnh bìa trang chủ (ví dụ "Ưu đãi đang chạy") — đây là nội dung
  bạn tự viết cho từng ảnh bìa, xoá được trong Admin → Cài đặt chung.
- Tiêu đề các cột ở chân trang ("Khám phá", "Chi nhánh") — đây là nhãn của danh
  sách bên dưới, không phải chữ lặp.

## 4. Sửa chữ cố định (nút bấm, nhãn, tiêu đề mục)

Nằm trong `messages/vi.json` và `messages/en.json`.
Ví dụ đổi chữ trên nút "Đặt bàn ngay": tìm `"bookNow"` trong `messages/vi.json`.

---

## 5. Đưa lên tên miền thật — ĐỌC KỸ PHẦN NÀY

Hiện tại dữ liệu (món ăn, ưu đãi...) lưu trong file JSON ở thư mục `data/`,
và ảnh lưu trong `public/uploads/`. **Cách này chỉ chạy được trên máy của bạn.**

Máy chủ của Vercel không cho ghi file, nên khi đưa lên tên miền thật, trang
admin sẽ **xem được nhưng không lưu được**. Phải chuyển hai thứ sang dịch vụ
lưu trữ trước khi lên thật:

1. **Dữ liệu** → đổi phần thân hàm trong `lib/store.ts` sang một cơ sở dữ liệu
   (Supabase hoặc Neon Postgres). Giao diện và trang admin **giữ nguyên**, chỉ
   đổi đúng file này.
2. **Ảnh/video** → đổi phần ghi file trong `app/api/upload/route.ts` sang
   Vercel Blob hoặc Supabase Storage.

Cả hai file đều đã được viết tách riêng sẵn cho việc này, có ghi chú ở đầu file.

### Chi phí sau khi lên thật

| Hạng mục | Chi phí |
|---|---|
| Tên miền launuongmr69.com | ~200–400k/năm (bạn đã mua) |
| Vercel Pro | ~500k/tháng |
| Vercel Blob (ảnh/video) | Gói Pro đã kèm sẵn dung lượng cơ bản |
| Supabase (dữ liệu) | Miễn phí ở gói Free |
| Resend (email báo đơn) | Miễn phí 3.000 email/tháng |

> Nếu muốn tiết kiệm: Cloudflare Pages miễn phí và cho phép dùng cho mục đích
> kinh doanh. Cấu trúc dự án này chạy được trên cả hai, không phải viết lại.

---

## 6. Ảnh mẫu — PHẢI THAY TRƯỚC KHI LÊN THẬT

Toàn bộ ảnh hiện tại là **ảnh kho miễn phí lấy từ Unsplash**, chỉ để bạn thấy
bố cục thật sự trông như thế nào. Giấy phép Unsplash cho dùng miễn phí kể cả
cho mục đích thương mại, không cần ghi nguồn.

> **Lưu ý quan trọng:** đây là ảnh món ăn và không gian của quán khác. Để trên
> website Mr.69 như thể là ảnh quán mình thì khách sẽ hiểu nhầm. Hãy thay bằng
> ảnh chụp thật tại quán trước khi đưa lên tên miền.

Thay ảnh: vào `/admin`, ở mỗi ô ảnh bấm **Chọn file** hoặc kéo thả file vào.

Muốn tải lại toàn bộ ảnh mẫu: `node scripts/tai-anh-mau.mjs`

Kích thước ảnh nên dùng:

| Loại | Kích thước |
|---|---|
| Ảnh bìa trang chủ | 1920 × 1080 |
| Ảnh giới thiệu | 900 × 1150 (ảnh dọc) |
| Ảnh nhóm món | 900 × 700 |
| Ảnh món ăn | 800 × 600 |
| Ảnh ưu đãi | 1200 × 800 |
| Ảnh chi nhánh | 1200 × 800 |
| Thư viện ảnh | 1000 × 750 |

Video: file tối đa 25MB. Video dài nên đăng lên YouTube rồi nhúng vào, vừa
miễn phí vừa không tốn dung lượng lưu trữ.

## 7. Các lệnh hay dùng

```bash
npm run dev      # chạy thử trên máy
npm run build    # đóng gói bản chạy thật (kiểm tra lỗi trước khi lên)
npm run start    # chạy thử bản đã đóng gói
npx tsc --noEmit # kiểm tra lỗi kiểu dữ liệu
npx eslint .     # kiểm tra lỗi code
```
