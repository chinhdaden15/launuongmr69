import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { addBooking, getBranches, getSettings } from "@/lib/store";
import { notifyNewBooking } from "@/lib/notify";
import { CHI_XEM } from "@/lib/env";
import type { Booking } from "@/lib/types";

/** Nhận đơn đặt bàn từ trang /dat-ban, lưu lại và gửi email báo cho chủ quán. */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim().slice(0, 120);
    const phone = String(body.phone || "").trim().slice(0, 30);
    const date = String(body.date || "").slice(0, 10);

    if (!name || !phone || !date) {
      return NextResponse.json({ error: "thiếu thông tin" }, { status: 400 });
    }
    if (!/^[0-9\s.+()-]{9,15}$/.test(phone)) {
      return NextResponse.json({ error: "số điện thoại không hợp lệ" }, { status: 400 });
    }

    const branches = await getBranches();
    const branchId = branches.some((b) => b.id === body.branchId)
      ? String(body.branchId)
      : (branches[0]?.id ?? "");

    const booking: Booking = {
      id: crypto.randomUUID(),
      name,
      phone,
      email: String(body.email || "").trim().slice(0, 160),
      branchId,
      date,
      time: String(body.time || "18:30").slice(0, 5),
      guests: Math.min(Math.max(Number(body.guests) || 2, 1), 50),
      note: String(body.note || "").trim().slice(0, 600),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const settings = await getSettings();
    const branchName =
      branches.find((b) => b.id === branchId)?.name.vi ?? "Chưa chọn";

    if (!CHI_XEM) {
      // Trên máy: lưu vào file để xem lại trong trang admin.
      await addBooking(booking);
      await notifyNewBooking(booking, settings.notifyEmail, branchName);
      return NextResponse.json({ ok: true, id: booking.id });
    }

    // Trên Vercel không ghi file được, nên đơn chỉ tới được chủ quán qua email.
    // Nếu chưa khai báo RESEND_API_KEY thì thà báo lỗi để khách gọi hotline,
    // còn hơn nhận đơn rồi làm mất — khách sẽ tới quán mà không có bàn.
    const ketQua = await notifyNewBooking(
      booking,
      settings.notifyEmail,
      branchName,
    );
    if (!ketQua.sent) {
      console.error(
        "Không nhận được đơn đặt bàn: đang chạy trên Vercel mà chưa cấu hình " +
          "RESEND_API_KEY, đơn sẽ bị mất nên đã từ chối.",
      );
      return NextResponse.json({ error: "chua cau hinh nhan don" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, id: booking.id });
  } catch {
    return NextResponse.json({ error: "lỗi máy chủ" }, { status: 500 });
  }
}
