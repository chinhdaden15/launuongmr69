# Mr.69 — ghi chú cho phiên làm việc sau

## Bối cảnh
Website quán lẩu nướng Mr.69. Chủ quán không biết lập trình — mọi thứ hướng tới
việc họ tự cập nhật được qua `/admin`. Giao diện tham khảo: omnuong.vn (WordPress),
đã dựng lại bằng Next.js cho nhanh và nhẹ hơn.

## Bảng màu — 6 mã chủ đạo do chủ quán cung cấp
kem `#f6f2e7` · kem xám `#e6e2d6` · đen mềm `#2e2e2e` · xanh sage `#afc69d` ·
nâu đồng `#8b6e3d` · vàng nhạt `#d4c08a`.
Thêm 4 màu suy ra vì bảng gốc không có màu đủ tối để đặt chữ trắng lên:
xanh đậm `#374a32` (header/footer/khối tối), xanh vừa `#55704a` (nút, tên nhóm),
xám chữ `#5f5c55`, phủ ảnh `#1a231a`. Tất cả ở `@theme` trong `app/globals.css`.

## Bố cục theo OM Nướng
- Thanh điều hướng: nền xanh ĐẶC ở mọi lúc (chủ quán không thích lớp mờ).
- Nhóm món: ảnh bo góc ở trên, tên nhóm xanh ở dưới ảnh, mô tả dưới cùng.
- Ảnh bìa: dải `translate3d` trượt ngang (`.hero-track`, 900ms), KHÔNG dùng
  crossfade opacity — chủ quán thấy chớp mờ bị giật mắt. Chạy vòng tròn bằng
  cách nhân bản slide đầu/cuối ở hai đầu dải; tới bản sao thì tắt transition
  (`.hero-track--instant`) và nhảy thầm về slide thật. Panel không hiển thị có
  `inert` để Tab không lọt vào nút ngoài màn hình.
- Vuốt tay ở ảnh bìa: xử lý bằng touch handler thủ công, KHÔNG dùng scroll-snap
  (sẽ đá nhau với cơ chế nhân bản để chạy vòng tròn). Trong lúc kéo thì ghi
  thẳng `style.transform`/`style.transition` vào DOM để không phải render lại
  từng frame; React chỉ vào cuộc khi nhấc tay. `touch-pan-y` trên track để trang
  vẫn cuộn dọc được. Autoplay và bộ đếm quay vòng đều tạm dừng khi `dangVuot`.
- Nhịp lúc buông tay (`MS_THA_TAY` 380ms, easeOutQuint) PHẢI tách khỏi nhịp tự
  chạy (900ms ease-in-out). Dùng chung thì ảnh khựng một nhịp khi buông tay vì
  ease-in-out khởi động từ tốc độ 0. Gán inline `style.transition` lúc buông rồi
  xoá sau 420ms để trả về nhịp tự chạy.
- Vận tốc búng phải đo giữa mốc LÙI MỘT NHỊP và lúc nhấc tay. Đo giữa lần
  touchmove cuối và touchend thì hai điểm gần trùng nhau, vận tốc luôn ra 0.
- BA CHỖ TRONG HERO KHÔNG ĐƯỢC DÙNG (đã dính lỗi thật, đừng "tối ưu" lại):
  1. `transitionend` để phát hiện trượt xong — máy bật giảm chuyển động thì
     `transition:none`, sự kiện không bao giờ bắn, dải trượt luôn ra ngoài.
  2. `requestAnimationFrame` để bật lại transition — ngừng chạy khi tab ở nền,
     hiệu ứng kẹt ở trạng thái tắt vĩnh viễn.
  3. `Date.now()` trong thân render — ESLint `react-hooks/purity` chặn.
  Tất cả đều thay bằng `setTimeout`.
- Chủ quán không muốn cuộn dọc dài trên điện thoại. Năm mục trang chủ (Nhóm
  món, Món đặc trưng, Ưu đãi, Không gian, Chi nhánh) đều bọc trong `SwipeRow`:
  scroll-snap ngang + hàng chấm, `sm:` trở lên quay về lưới. Ba thẻ ưu đãi giờ
  đồng cỡ (đã bỏ kiểu thẻ đầu rộng 2 cột vì không hợp với dải vuốt).
- CẢNH BÁO: `SWIPE_ITEM` phải ở `swipe-item.ts` (không `"use client"`). Export
  hằng số từ file client rồi import vào server component sẽ ra một hàm stub,
  class không áp được, thẻ co về 0px — đã dính lỗi này một lần.
- Trang Thực đơn: thanh tab kiểu "tab giấy" của OM (tab đang chọn nền `cream`
  nhô lên khỏi dải `cream-deep`, nối liền vùng ảnh bên dưới). Tab đầu là MENU =
  hiện tất cả; các tab sau lọc theo `categoryId`. Lọc chạy client-side trong
  `MenuBrowser.tsx` nên trang vẫn tĩnh (SSG) và Google vẫn đọc được đủ ảnh.
  Lưới 2/3/4/5 cột, tự thu hẹp căn giữa khi mục ít ảnh. Dữ liệu ở
  `data/menu-posters.json`. `menu-items` chỉ còn phục vụ khối "Món đặc trưng".
- Sáu nhóm theo yêu cầu chủ quán: Khai vị · Lẩu · Nướng · Ăn vặt · Món thêm ·
  Giải khát (id: cat-khai-vi, cat-lau, cat-nuong, cat-nhau, cat-them, cat-uong).
- Ảnh và thẻ bo góc `--radius-card`, nút bấm `rounded-full`.
- KHÔNG dùng dòng chữ nhỏ (`eyebrow`) phía trên tiêu đề mục — chủ quán thấy
  thừa vì trùng nội dung tiêu đề. Prop `eyebrow` vẫn còn (optional) nhưng không
  trang nào truyền vào. Giữ lại chữ nhỏ ở: eyebrow từng ảnh bìa (nội dung admin)
  và tiêu đề cột chân trang.

## Ảnh
Ảnh mẫu tải từ Unsplash bằng `scripts/tai-anh-mau.mjs` — CHỈ là ảnh tạm, phải
thay bằng ảnh thật của quán trước khi lên tên miền.

## Kỹ thuật
- Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · TypeScript
- Song ngữ vi/en qua `app/[locale]/`, từ điển ở `messages/`
- Dữ liệu: file JSON trong `data/`, đọc/ghi qua `lib/store.ts`
- Ảnh: `public/uploads/`, tải lên qua `app/api/upload/route.ts`
- Đăng nhập admin: mật khẩu trong `.env.local`, phiên ký HMAC (`lib/auth.ts`)

## Quy ước
- **Toàn bộ chú thích trong code viết bằng tiếng Việt** — chủ quán đọc được.
- Mọi nội dung hiển thị dùng kiểu `Bilingual = { vi, en }`; hàm `t()` tự lùi về
  tiếng Việt khi bản tiếng Anh còn trống.
- Trang admin sinh giao diện tự động từ `lib/admin-config.ts`. Thêm ô nhập mới
  chỉ cần thêm một dòng vào đó, không phải viết giao diện.
- Màu và font khai báo tập trung trong khối `@theme` của `app/globals.css`.

## Logo mạng xã hội
`components/site/BrandIcons.tsx` — path lấy nguyên từ Simple Icons, KHÔNG tự vẽ
lại. Tất cả tô bằng `currentColor`. Dùng ở FloatingContact, Footer, trang Liên
hệ; mỗi nơi đều lọc bỏ kênh chưa khai báo link. Màu nền chuẩn: Zalo `#0068FF`,
Messenger `#0084FF`, TikTok đen, Facebook `#0866FF`.

## Trang quản trị trên Vercel
Đã tắt hẳn bằng `proxy.ts` — `/admin/*` và `/api/upload` bị rewrite sang đường
dẫn không tồn tại nên trả 404 thật, không lộ dấu vết. Điều khiển bằng `AN_ADMIN`
trong `lib/env.ts` (bật lại bằng biến `BAT_ADMIN=1`). Trên máy không ảnh hưởng.

Nút "Đưa lên mạng" (`NutDeploy.tsx`) chạy git add/commit/push, chỉ hiện khi
`!CHI_XEM`. Là nút TẠM — chuyển sang Supabase rồi thì xoá.

## Việc còn phải làm trước khi lên tên miền thật
`lib/store.ts` và `app/api/upload/route.ts` hiện ghi xuống ổ đĩa — Vercel không
cho phép. Phải đổi sang Supabase/Neon (dữ liệu) và Vercel Blob/Supabase Storage
(ảnh). Hai file đó đã tách riêng sẵn cho việc này.
