"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";

type Labels = {
  name: string; phone: string; email: string; branch: string;
  date: string; time: string; guests: string; note: string;
  notePlaceholder: string; submit: string; sending: string;
  successTitle: string; successBody: string;
  errorRequired: string; errorPhone: string; errorGeneric: string;
};

/**
 * MỤC 11 — FORM ĐẶT BÀN
 * Một cột trên điện thoại, hai cột trên máy tính.
 * Kiểm tra dữ liệu ngay tại trình duyệt trước khi gửi, rồi gửi lên máy chủ.
 * Đơn đặt bàn sẽ hiện trong /admin/dat-ban.
 */
export function BookingForm({
  branches,
  labels,
  locale,
}: {
  branches: { id: string; name: string; disabled: boolean }[];
  labels: Labels;
  locale: Locale;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const date = String(form.get("date") || "");

    if (!name || !phone || !date) return setError(labels.errorRequired);
    // Số điện thoại Việt Nam: 9–11 chữ số, cho phép khoảng trắng và dấu chấm.
    if (!/^[0-9\s.+()-]{9,15}$/.test(phone)) return setError(labels.errorPhone);

    setState("sending");
    try {
      const res = await fetch("/api/dat-ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("idle");
      setError(labels.errorGeneric);
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-card border border-accent/50 bg-cream-deep p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-cream">
          ✓
        </div>
        <h3 className="font-display text-2xl text-ink">{labels.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
          {labels.successBody}
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-soft border border-ink/20 bg-cream px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand";
  const label = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">{labels.name} *</label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="phone">{labels.phone} *</label>
          <input id="phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" className={field} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="email">{labels.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="branchId">{labels.branch}</label>
          <select id="branchId" name="branchId" className={field} defaultValue={branches[0]?.id}>
            {branches.map((b) => (
              <option key={b.id} value={b.id} disabled={b.disabled}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="date">{labels.date} *</label>
          <input id="date" name="date" type="date" required min={today} defaultValue={today} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="time">{labels.time}</label>
          <select id="time" name="time" className={field} defaultValue="18:30">
            {Array.from({ length: 17 }, (_, i) => {
              const h = 16 + Math.floor(i / 2);
              const m = i % 2 ? "30" : "00";
              return `${String(h).padStart(2, "0")}:${m}`;
            }).map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="guests">{labels.guests}</label>
          <input id="guests" name="guests" type="number" min={1} max={50} defaultValue={4} inputMode="numeric" className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="note">{labels.note}</label>
        <textarea id="note" name="note" rows={3} placeholder={labels.notePlaceholder} className={`${field} resize-none`} />
      </div>

      <input type="hidden" name="locale" value={locale} />

      {error ? (
        <p role="alert" className="border-l-2 border-brand bg-brand/8 px-4 py-3 text-sm text-brand">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full rounded-full bg-brand px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {state === "sending" ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
