import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Đăng nhập admin đơn giản, không cần dịch vụ ngoài.
 * Mật khẩu đặt trong file .env.local (ADMIN_PASSWORD).
 * Phiên đăng nhập lưu trong cookie đã ký HMAC nên không giả mạo được.
 */

const COOKIE = "mr69_admin";
const MAX_AGE = 60 * 60 * 12; // 12 tiếng

/**
 * Chuỗi bí mật để ký phiên đăng nhập.
 *
 * KHÔNG được đặt giá trị dự phòng cố định ở đây. Mã nguồn nằm trên GitHub, ai
 * đọc được cũng sẽ biết chuỗi đó và tự làm ra được một phiên đăng nhập giả mà
 * không cần mật khẩu. Chưa khai báo thì dùng một chuỗi ngẫu nhiên sinh lúc
 * chạy — phiên đăng nhập sẽ mất mỗi lần khởi động lại, đủ để bạn nhận ra là
 * thiếu cấu hình.
 */
const SECRET_TAM = crypto.randomBytes(32).toString("hex");

function secret() {
  return process.env.AUTH_SECRET || SECRET_TAM;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createToken() {
  const payload = String(Date.now() + MAX_AGE * 1000);
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const expected = sign(payload);
  // So sánh theo thời gian cố định để tránh dò mật khẩu qua độ trễ.
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(payload) > Date.now();
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;

  // Chưa khai báo mật khẩu thì KHÔNG cho ai vào cả.
  // Trước đây chỗ này để tạm mật khẩu "mr69" cho tiện, nhưng mã nguồn nằm
  // trên GitHub nên ai cũng đọc được — thà khoá hẳn còn hơn để cửa mở.
  if (!expected) {
    console.error(
      "Chưa khai báo ADMIN_PASSWORD nên trang quản trị đang bị khoá. " +
        "Ở máy: thêm vào file .env.local. Trên Vercel: vào Settings → " +
        "Environment Variables.",
    );
    return false;
  }

  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isLoggedIn(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export async function login() {
  const jar = await cookies();
  jar.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export const ADMIN_COOKIE = COOKIE;

/** Dùng ở đầu mỗi trang admin: chưa đăng nhập thì đá về trang đăng nhập. */
export async function requireAdmin() {
  const { redirect } = await import("next/navigation");
  if (!(await isLoggedIn())) redirect("/admin/login");
}
