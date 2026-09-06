/**
 * Lưu mọi thay đổi và đưa lên mạng — chạy bằng: npm run luu
 *
 * Sau khi bạn thay ảnh hay sửa nội dung trong trang admin, file trên máy đã
 * đổi nhưng bản trên Vercel thì chưa. Lệnh này gói mọi thay đổi lại rồi đẩy
 * lên, Vercel sẽ tự dựng lại website sau khoảng 2 phút.
 */
import { execSync } from "node:child_process";

const chay = (lenh) => execSync(lenh, { encoding: "utf8" }).trim();
const thu = (lenh) => {
  try {
    return chay(lenh);
  } catch {
    return null;
  }
};

if (!thu("git rev-parse --git-dir")) {
  console.error("✗ Thư mục này chưa cài git. Chạy: git init");
  process.exit(1);
}

const thayDoi = chay("git status --porcelain");
if (!thayDoi) {
  console.log("Không có gì mới để lưu — bản trên mạng đang khớp với máy bạn.");
  process.exit(0);
}

const soFile = thayDoi.split("\n").length;
console.log(`Có ${soFile} file thay đổi:\n`);
console.log(
  thayDoi
    .split("\n")
    .slice(0, 12)
    .map((d) => "   " + d)
    .join("\n"),
);
if (soFile > 12) console.log(`   ... và ${soFile - 12} file nữa`);

const ngay = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
chay("git add -A");
chay(`git commit -q -m "Cập nhật nội dung website — ${ngay}"`);
console.log("\n✓ Đã lưu lại trên máy.");

if (!thu("git remote get-url origin")) {
  console.log(
    "\nChưa nối với GitHub nên chưa đẩy lên được.\n" +
      "Xem hướng dẫn trong file DUA-LEN-VERCEL.md.",
  );
  process.exit(0);
}

console.log("Đang đẩy lên GitHub...");
try {
  execSync("git push", { stdio: "inherit" });
  console.log(
    "\n✓ Xong. Vercel đang dựng lại website, khoảng 2 phút nữa là bản trên mạng cập nhật.",
  );
} catch {
  console.error(
    "\n✗ Đẩy lên không thành công. Kiểm tra lại mạng, hoặc xem DUA-LEN-VERCEL.md.",
  );
  process.exit(1);
}
