import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { isLoggedIn } from "@/lib/auth";
import { CHI_XEM, LOI_CHI_XEM } from "@/lib/env";

/**
 * Nhận file ảnh/video từ trang admin và lưu vào public/uploads.
 *
 * Khi đưa lên tên miền thật, đổi phần ghi file bên dưới sang Vercel Blob
 * hoặc Supabase Storage — phần còn lại của trang admin giữ nguyên.
 */

const MAX_BYTES = 25 * 1024 * 1024; // 25MB

/**
 * Ảnh tải lên được tự động thu nhỏ và nén lại.
 *
 * Ảnh chụp bằng điện thoại thường nặng 4–8MB một tấm. Để nguyên như vậy thì
 * khách vào web bằng 4G sẽ phải chờ rất lâu, và kho mã nguồn phình lên rất
 * nhanh (đưa lên rồi thì gỡ ra rất khó). Nén lại còn khoảng 200–400KB mà mắt
 * thường gần như không phân biệt được.
 *
 * Đổi 2000 thành số lớn hơn nếu muốn ảnh nét hơn, hoặc 82 lên 90 để ít nén đi.
 */
const CANH_DAI_TOI_DA = 2000;
const DO_NEN = 82;

/** Ảnh vector và ảnh động thì giữ nguyên, nén lại chỉ làm hỏng. */
const GIU_NGUYEN = new Set(["image/svg+xml", "image/gif", "video/mp4", "video/webm"]);

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (CHI_XEM) {
    return NextResponse.json({ error: LOI_CHI_XEM }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Không có file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File quá lớn (tối đa ${MAX_BYTES / 1024 / 1024}MB)` },
      { status: 400 },
    );
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Chỉ nhận ảnh (jpg, png, webp, gif, svg) và video (mp4, webm)" },
      { status: 400 },
    );
  }

  // Tên file an toàn: giữ phần tên gốc cho dễ nhận ra, thêm mã ngẫu nhiên
  // để không bao giờ ghi đè lên file cũ.
  const base = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "anh";

  const gocBuf = Buffer.from(await file.arrayBuffer());
  const ma = crypto.randomBytes(4).toString("hex");
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });

  // --- Ảnh vector, ảnh động, video: chép thẳng, không đụng vào ---
  if (GIU_NGUYEN.has(file.type)) {
    const filename = `${base}-${ma}${ext}`;
    await fs.writeFile(path.join(dir, filename), gocBuf);
    return NextResponse.json({
      url: `/uploads/${filename}`,
      cuKb: Math.round(gocBuf.length / 1024),
      moiKb: Math.round(gocBuf.length / 1024),
    });
  }

  // --- Ảnh thường: thu nhỏ và nén lại thành WebP ---
  try {
    const nenBuf = await sharp(gocBuf, { failOn: "none" })
      // rotate() xoay ảnh về đúng chiều máy ảnh đã chụp — không có dòng này
      // thì ảnh chụp dọc bằng điện thoại hay bị nằm ngang.
      .rotate()
      // "inside" = thu nhỏ sao cho lọt vào khung 2000×2000 mà vẫn giữ đúng tỉ
      // lệ; "withoutEnlargement" = ảnh nhỏ sẵn thì để nguyên, không phóng to.
      .resize({
        width: CANH_DAI_TOI_DA,
        height: CANH_DAI_TOI_DA,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: DO_NEN })
      .toBuffer();

    // Nếu nén xong lại nặng hơn ảnh gốc (hiếm, gặp ở ảnh đã tối ưu sẵn) thì
    // giữ ảnh gốc cho lành.
    if (nenBuf.length >= gocBuf.length) {
      const filename = `${base}-${ma}${ext}`;
      await fs.writeFile(path.join(dir, filename), gocBuf);
      return NextResponse.json({
        url: `/uploads/${filename}`,
        cuKb: Math.round(gocBuf.length / 1024),
        moiKb: Math.round(gocBuf.length / 1024),
      });
    }

    const filename = `${base}-${ma}.webp`;
    await fs.writeFile(path.join(dir, filename), nenBuf);
    return NextResponse.json({
      url: `/uploads/${filename}`,
      cuKb: Math.round(gocBuf.length / 1024),
      moiKb: Math.round(nenBuf.length / 1024),
    });
  } catch (err) {
    // File ảnh hỏng hoặc định dạng lạ — cứ lưu nguyên bản, đừng chặn chủ quán.
    console.error("Không nén được ảnh, giữ nguyên bản:", err);
    const filename = `${base}-${ma}${ext}`;
    await fs.writeFile(path.join(dir, filename), gocBuf);
    return NextResponse.json({
      url: `/uploads/${filename}`,
      cuKb: Math.round(gocBuf.length / 1024),
      moiKb: Math.round(gocBuf.length / 1024),
    });
  }
}
