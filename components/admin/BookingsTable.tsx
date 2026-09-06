"use client";

import { useState, useTransition } from "react";
import { deleteBookingAction, updateBookingAction } from "@/app/admin/actions";
import type { Booking } from "@/lib/types";

const STATUS: Record<Booking["status"], { label: string; cls: string }> = {
  new: { label: "Mới", cls: "bg-amber-100 text-amber-900 border-amber-300" },
  confirmed: { label: "Đã xác nhận", cls: "bg-blue-50 text-blue-800 border-blue-300" },
  done: { label: "Đã đến", cls: "bg-green-50 text-green-800 border-green-300" },
  cancelled: { label: "Đã huỷ", cls: "bg-stone-100 text-stone-500 border-stone-300" },
};

/** Bảng đơn đặt bàn: lọc theo trạng thái, đổi trạng thái, gọi điện, xoá. */
export function BookingsTable({
  bookings,
  branchNames,
}: {
  bookings: Booking[];
  branchNames: Record<string, string>;
}) {
  const [filter, setFilter] = useState<"all" | Booking["status"]>("all");
  const [pending, startTransition] = useTransition();

  const list = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    done: bookings.filter((b) => b.status === "done").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const tabs: { key: "all" | Booking["status"]; label: string }[] = [
    { key: "all", label: `Tất cả (${counts.all})` },
    { key: "new", label: `Mới (${counts.new})` },
    { key: "confirmed", label: `Đã xác nhận (${counts.confirmed})` },
    { key: "done", label: `Đã đến (${counts.done})` },
    { key: "cancelled", label: `Đã huỷ (${counts.cancelled})` },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === tab.key
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-stone-300 bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded border border-dashed border-stone-300 py-16 text-center text-sm text-stone-500">
          Chưa có đơn nào trong mục này.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {list.map((b) => (
            <li
              key={b.id}
              className={`rounded-lg border bg-white p-4 ${b.status === "new" ? "border-amber-400" : "border-stone-200"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-stone-900">{b.name}</span>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS[b.status].cls}`}>
                      {STATUS[b.status].label}
                    </span>
                  </p>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
                    <a href={`tel:${b.phone}`} className="font-medium text-emerald-800 hover:underline">
                      📞 {b.phone}
                    </a>
                    {b.email ? <span>{b.email}</span> : null}
                  </p>

                  <p className="mt-1 text-sm text-stone-600">
                    <strong className="text-stone-800">{b.date}</strong> lúc{" "}
                    <strong className="text-stone-800">{b.time}</strong> · {b.guests} người ·{" "}
                    {branchNames[b.branchId] || "Chưa rõ chi nhánh"}
                  </p>

                  {b.note ? (
                    <p className="mt-2 rounded bg-stone-50 px-3 py-2 text-sm italic text-stone-600">
                      “{b.note}”
                    </p>
                  ) : null}

                  <p className="mt-2 text-[11px] text-stone-400">
                    Gửi lúc {new Date(b.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {(["confirmed", "done", "cancelled"] as const).map((s) =>
                    b.status === s ? null : (
                      <button
                        key={s}
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await updateBookingAction(b.id, s);
                          })
                        }
                        className="rounded border border-stone-300 px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                      >
                        {STATUS[s].label}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (!confirm("Xoá hẳn đơn này? Không khôi phục lại được.")) return;
                      startTransition(async () => {
                        await deleteBookingAction(b.id);
                      });
                    }}
                    className="rounded border border-stone-300 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
