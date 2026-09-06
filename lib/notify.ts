import "server-only";
import type { Booking } from "./types";

/**
 * Gửi email báo khi có đơn đặt bàn mới.
 *
 * Dùng Resend (miễn phí 3.000 email/tháng). Nếu chưa cấu hình RESEND_API_KEY
 * thì chỉ ghi ra màn hình terminal — website vẫn chạy bình thường, đơn vẫn lưu.
 * Khi nào muốn bật, đăng ký resend.com rồi thêm key vào .env.local.
 */
export async function notifyNewBooking(
  booking: Booking,
  to: string,
  branchName: string,
) {
  const lines = [
    `Khách: ${booking.name}`,
    `Điện thoại: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : "",
    `Chi nhánh: ${branchName}`,
    `Thời gian: ${booking.date} lúc ${booking.time}`,
    `Số người: ${booking.guests}`,
    booking.note ? `Ghi chú: ${booking.note}` : "",
  ].filter(Boolean);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) {
    console.log("\n📩 ĐƠN ĐẶT BÀN MỚI\n" + lines.join("\n") + "\n");
    return { sent: false as const, reason: "chưa cấu hình email" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Mr.69 <onboarding@resend.dev>",
        to: [to],
        subject: `Đặt bàn mới — ${booking.name} · ${booking.guests} người · ${booking.date} ${booking.time}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return { sent: true as const };
  } catch (err) {
    // Không để lỗi email làm hỏng việc nhận đơn.
    console.error("Không gửi được email báo đơn:", err);
    return { sent: false as const, reason: "lỗi gửi" };
  }
}
