# Đưa website lên Vercel cho đồng nghiệp xem

## Trả lời câu hỏi: ảnh có mất không?

**Không mất.** Ảnh nằm trong thư mục `public/uploads` và nội dung nằm trong
`data/*.json` — cả hai được đưa lên cùng mã nguồn. Vercel dựng sẵn toàn bộ trang
thành HTML tĩnh lúc đóng gói, nên bản trên mạng hiện đầy đủ y hệt bản ở máy.

Cách làm đúng: **sửa xong hết ở máy → mới đưa lên.**

## Cái gì chạy được, cái gì không

| | Trên máy bạn | Trên Vercel |
|---|---|---|
| Toàn bộ trang công khai, ảnh, menu | ✅ | ✅ |
| Vào trang admin | ✅ | ❌ đã tắt hẳn |
| Sửa và bấm Lưu trong admin | ✅ | ❌ |
| Tải ảnh mới lên qua admin | ✅ | ❌ |
| Khách đặt bàn | ✅ lưu vào admin | ⚠️ chỉ chạy nếu đã khai báo email |

Máy chủ Vercel không cho ghi file, đó là lý do.

## Trang admin đã tắt trên bản đưa lên mạng

Vào `launuongmr69.vercel.app/admin` sẽ ra trang **"Không tìm thấy trang"** y hệt
như gõ sai địa chỉ. Không lộ ra là website có trang quản trị, nên không ai ngồi
dò mật khẩu được.

Lý do tắt: trên Vercel admin có vào được cũng chẳng lưu được gì, mà để đó thì
người lạ vẫn dò được mật khẩu và đọc được tên, số điện thoại khách đặt bàn.

**Trên máy của bạn thì admin vẫn dùng bình thường**, không ảnh hưởng gì.

Muốn bật tạm để khoe giao diện cho ai xem: vào Vercel → Settings → Environment
Variables, thêm `BAT_ADMIN` = `1`, rồi Redeploy. Xem xong nhớ xoá biến đó đi.

## Các bước đưa lên (lần đầu, khoảng 10 phút)

### 1. Đưa mã nguồn lên GitHub

Tạo một kho chứa mới (repository) ở https://github.com/new — đặt tên
`launuongmr69`, chọn **Private** nếu chưa muốn ai xem mã nguồn. Đừng tick thêm
README hay .gitignore.

Xong rồi chạy ở Terminal, thay `TEN-CUA-BAN` bằng tên tài khoản GitHub:

```bash
git remote add origin https://github.com/TEN-CUA-BAN/launuongmr69.git
git branch -M main
git push -u origin main
```

### 2. Nối với Vercel

1. Vào https://vercel.com → đăng nhập bằng chính tài khoản GitHub
2. Bấm **Add New → Project**
3. Chọn kho `launuongmr69` vừa đẩy lên → **Import**
4. Vercel tự nhận ra đây là Next.js, không cần chỉnh gì
5. Mở phần **Environment Variables**, thêm hai dòng:

   | Tên | Giá trị |
   |---|---|
   | `ADMIN_PASSWORD` | mật khẩu bạn muốn dùng cho trang admin |
   | `AUTH_SECRET` | một chuỗi ngẫu nhiên thật dài, xem cách tạo bên dưới |

6. Bấm **Deploy**, đợi khoảng 2 phút

Tạo chuỗi ngẫu nhiên cho `AUTH_SECRET`:

```bash
openssl rand -base64 48
```

Xong Vercel cho bạn một đường dẫn dạng `launuongmr69.vercel.app` — gửi cho đồng
nghiệp là xem được.

### 3. Mỗi lần thay ảnh hay sửa nội dung

Đây là bước **hay bị quên nhất**. Sửa trong trang admin ở máy thì file trên máy
đã đổi, nhưng bản trên mạng vẫn là bản cũ cho tới khi bạn đẩy lên.

Sửa xong hết, chạy một lệnh này ở Terminal:

```bash
npm run luu
```

Lệnh này gói mọi thay đổi lại rồi đẩy lên GitHub, Vercel tự dựng lại website.
Khoảng 2 phút sau là bản trên mạng cập nhật theo. Nó cũng liệt kê ra những file
nào đã đổi để bạn xem lại trước khi đẩy.

## Ảnh tự động được nén

Ảnh tải lên qua trang admin được tự thu nhỏ về tối đa 2000px và nén lại thành
định dạng WebP. Ảnh chụp điện thoại 2MB xuống còn khoảng 280KB — nhẹ hơn 7 lần
mà mắt thường gần như không thấy khác.

Việc này quan trọng vì hai lý do: khách vào web bằng 4G không phải chờ lâu, và
kho mã nguồn không phình lên (ảnh đã đẩy lên rồi thì gỡ ra rất khó).

Logo dạng SVG và ảnh động GIF thì giữ nguyên, không nén.

Muốn ảnh nét hơn: sửa `CANH_DAI_TOI_DA` và `DO_NEN` ở đầu file
`app/api/upload/route.ts`.

## Muốn form đặt bàn chạy được trên bản đã đưa lên

Đăng ký miễn phí ở https://resend.com (3.000 email/tháng), lấy API key, rồi thêm
vào Environment Variables trên Vercel:

| Tên | Giá trị |
|---|---|
| `RESEND_API_KEY` | key lấy từ Resend |
| `RESEND_FROM` | `Mr.69 <onboarding@resend.dev>` |

Khi đó khách đặt bàn thì đơn gửi thẳng vào email của bạn.

> **Chưa khai báo email thì form đặt bàn trên Vercel sẽ báo lỗi và mời khách gọi
> hotline.** Tôi cố ý làm vậy: thà báo lỗi còn hơn nhận đơn rồi làm mất — khách
> đã đặt bàn mà tới quán không có chỗ thì tệ hơn nhiều.

## Khi nào cần làm tiếp

Bản này đủ để đồng nghiệp xem và góp ý. Nhưng nếu muốn:

- **Sửa nội dung trực tiếp trên mạng** (không phải về máy sửa rồi đẩy lên)
- **Lưu đơn đặt bàn của khách**
- **Chạy trên tên miền thật launuongmr69.com với khách hàng thật**

thì cần chuyển dữ liệu sang Supabase (miễn phí) và ảnh sang Vercel Blob. Hai
file cần đổi là `lib/store.ts` và `app/api/upload/route.ts`, đã viết tách sẵn
cho việc đó. Giao diện và trang admin giữ nguyên.
