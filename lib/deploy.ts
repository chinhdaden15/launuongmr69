import "server-only";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const chay = promisify(execFile);

/**
 * Đẩy mọi thay đổi lên GitHub để Vercel tự dựng lại website.
 *
 * Chỉ chạy được trên MÁY của chủ quán — nơi có git và có quyền ghi file.
 * Đây là giải pháp tạm cho giai đoạn dữ liệu còn nằm trong file. Khi chuyển
 * sang Supabase, nội dung sửa xong là hiện ngay trên mạng, không cần đẩy nữa,
 * lúc đó bỏ hẳn nút này đi.
 *
 * Dùng execFile với danh sách tham số rời (không phải chuỗi lệnh) để không có
 * cách nào chèn thêm lệnh lạ vào.
 */
export type KetQuaDeploy = {
  ok: boolean;
  /** Câu thông báo hiển thị cho chủ quán đọc. */
  loi?: string;
  /** Số file đã đưa lên trong lần này. */
  soFile?: number;
};

async function git(...args: string[]) {
  const { stdout } = await chay("git", args, {
    cwd: process.cwd(),
    timeout: 120_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  return stdout.trim();
}

export async function dayLenMang(): Promise<KetQuaDeploy> {
  try {
    await git("rev-parse", "--git-dir");
  } catch {
    return { ok: false, loi: "Thư mục dự án chưa cài git nên chưa đẩy lên được." };
  }

  let remote = "";
  try {
    remote = await git("remote", "get-url", "origin");
  } catch {
    return {
      ok: false,
      loi: "Chưa nối với GitHub. Xem hướng dẫn trong file DUA-LEN-VERCEL.md.",
    };
  }
  if (!remote) {
    return { ok: false, loi: "Chưa nối với GitHub." };
  }

  const thayDoi = await git("status", "--porcelain");
  const soFile = thayDoi ? thayDoi.split("\n").length : 0;

  if (soFile > 0) {
    const ngay = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    await git("add", "-A");
    await git("commit", "-m", `Cập nhật nội dung từ trang quản trị — ${ngay}`);
  }

  // Còn mốc nào chưa đẩy không? Có thể lần trước lưu rồi mà đẩy hỏng.
  let chuaDay = "";
  try {
    chuaDay = await git("log", "origin/main..HEAD", "--oneline");
  } catch {
    chuaDay = "co"; // chưa từng đẩy lần nào
  }

  if (!soFile && !chuaDay) {
    return { ok: true, soFile: 0 };
  }

  try {
    await git("push", "origin", "HEAD");
  } catch (err) {
    const chiTiet = err instanceof Error ? err.message : String(err);
    console.error("Đẩy lên GitHub thất bại:", chiTiet);
    return {
      ok: false,
      loi:
        "Đã lưu trên máy nhưng đẩy lên GitHub không thành công. " +
        "Kiểm tra lại kết nối mạng rồi bấm lại, hoặc mở Terminal chạy: npm run luu",
    };
  }

  return { ok: true, soFile };
}
