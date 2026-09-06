import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isLoggedIn } from "@/lib/auth";
import { CHI_XEM, LOI_CHI_XEM } from "@/lib/env";

/**
 * Nhận file ảnh/video từ trang admin và lưu vào public/uploads.
 *
 * Khi đưa lên tên miền thật, đổi phần ghi file bên dưới sang Vercel Blob
 * hoặc Supabase Storage — phần còn lại của trang admin giữ nguyên.
 */

const MAX_BYTES = 25 * 1024 * 1024; // 25MB

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

  const filename = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return NextResponse.json({ url: `/uploads/${filename}` });
}
