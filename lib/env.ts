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
