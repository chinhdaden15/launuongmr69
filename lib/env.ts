/**
 * Website đang chạy ở đâu?
 *
 * Trên máy của bạn: ghi được file, nên trang admin sửa và lưu bình thường.
 * Trên Vercel: máy chủ KHÔNG cho ghi file, nên trang admin chỉ xem được.
 *
 * Vercel tự đặt sẵn biến VERCEL=1 nên không cần khai báo gì thêm.
 * Muốn thử chế độ chỉ-xem ngay trên máy thì thêm CHI_XEM=1 vào .env.local.
 */
export const CHI_XEM =
  process.env.VERCEL === "1" || process.env.CHI_XEM === "1";

/** Câu báo dùng chung khi khách bấm Lưu trên bản đã đưa lên mạng. */
export const LOI_CHI_XEM =
  "Bản trên mạng chỉ xem được, không lưu được. Máy chủ Vercel không cho ghi file. " +
  "Bạn sửa ở máy mình rồi đưa lên lại, hoặc nhờ chuyển dữ liệu sang Supabase để sửa trực tiếp trên mạng.";

/**
 * Có ẩn hẳn trang quản trị đi không?
 *
 * Trên bản đưa lên mạng, trang quản trị chỉ xem được chứ không lưu được gì,
 * nên để đó chỉ tổ cho người lạ dò mật khẩu. Mặc định ẩn hẳn — vào /admin sẽ
 * ra trang "không tìm thấy" y như gõ sai địa chỉ, không lộ ra là có trang này.
 *
 * Muốn bật lại để khoe giao diện cho ai đó xem: thêm biến BAT_ADMIN=1 trong
 * Vercel → Settings → Environment Variables, rồi Redeploy. Xem xong nhớ xoá đi.
 *
 * Trên máy của bạn thì trang quản trị luôn dùng được bình thường.
 */
export const AN_ADMIN = CHI_XEM && process.env.BAT_ADMIN !== "1";
