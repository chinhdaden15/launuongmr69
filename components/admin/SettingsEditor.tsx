"use client";

import { useState, useTransition } from "react";
import { saveSettingsAction } from "@/app/admin/actions";
import { ImagePicker } from "./ImagePicker";
import type { HeroSlide, SiteSettings } from "@/lib/types";

const inputCls =
  "w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700";
const labelCls = "mb-1.5 block text-xs font-semibold text-stone-700";
const cardCls = "rounded-lg border border-stone-200 bg-white p-6";

/** Ô nhập song ngữ dùng riêng cho trang cài đặt. */
function Bi({
  label, value, onChange, rows, hint,
}: {
  label: string;
  value: { vi: string; en: string };
  onChange: (v: { vi: string; en: string }) => void;
  rows?: number;
  hint?: string;
}) {
  const v = value ?? { vi: "", en: "" };
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["vi", "en"] as const).map((lang) => (
          <div key={lang}>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {lang === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
            </span>
            {rows ? (
              <textarea
                rows={rows}
                value={v[lang] ?? ""}
                onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
                className={`${inputCls} resize-y`}
              />
            ) : (
              <input
                value={v[lang] ?? ""}
                onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
                className={inputCls}
              />
            )}
          </div>
        ))}
      </div>
      {hint ? <p className="mt-1 text-[11px] text-stone-500">{hint}</p> : null}
    </div>
  );
}

/** Nút lưu, dùng lại ở đầu và cuối trang cài đặt. */
function SaveButton({
  onSave, dirty, pending,
}: {
  onSave: () => void;
  dirty: boolean;
  pending: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={!dirty || pending}
      className="rounded bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {pending ? "Đang lưu..." : dirty ? "Lưu thay đổi" : "Đã lưu"}
    </button>
  );
}

/**
 * CÀI ĐẶT CHUNG — logo, thông tin liên hệ, ảnh bìa trang chủ và khối giới thiệu.
 */
export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setMsg(null);
  }

  function setSlide(id: string, patch: Partial<HeroSlide>) {
    set(
      "hero",
      s.hero.map((sl) => (sl.id === id ? { ...sl, ...patch } : sl)),
    );
  }

  function addSlide() {
    set("hero", [
      ...s.hero,
      {
        id: `hero-${Date.now().toString(36)}`,
        image: "",
        eyebrow: { vi: "", en: "" },
        title: { vi: "", en: "" },
        subtitle: { vi: "", en: "" },
        ctaLabel: { vi: "Xem thêm", en: "Read more" },
        ctaHref: "/thuc-don",
        order: s.hero.length + 1,
      },
    ]);
  }

  function save() {
    startTransition(async () => {
      const res = await saveSettingsAction(JSON.stringify(s));
      if (res?.error) setMsg({ ok: false, text: res.error });
      else {
        setDirty(false);
        setMsg({ ok: true, text: "Đã lưu. Mở website ra là thấy thay đổi ngay." });
      }
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Cài đặt chung</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">
            Logo, hotline, mạng xã hội, ảnh bìa trang chủ và khối giới thiệu quán.
          </p>
        </div>
        <SaveButton onSave={save} dirty={dirty} pending={pending} />
      </header>

      {msg ? (
        <p className={`rounded border-l-4 px-4 py-3 text-sm ${msg.ok ? "border-green-600 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-800"}`}>
          {msg.text}
        </p>
      ) : null}

      {/* --- Thương hiệu --- */}
      <section className={cardCls}>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-stone-500">
          Thương hiệu
        </h2>
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Tên thương hiệu</label>
              <input
                value={s.brandName}
                onChange={(e) => set("brandName", e.target.value)}
                className={inputCls}
              />
            </div>
            <Bi label="Khẩu hiệu" value={s.tagline} onChange={(v) => set("tagline", v)} />
          </div>

          <div>
            <label className={labelCls}>Logo</label>
            <ImagePicker
              value={s.logo}
              onChange={(v) => set("logo", v)}
              hint="Nên dùng file PNG nền trong suốt hoặc SVG, cao khoảng 100px. Logo hiện trên nền tối nên chữ nên màu sáng."
            />
          </div>
        </div>
      </section>

      {/* --- Liên hệ --- */}
      <section className={cardCls}>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-stone-500">
          Liên hệ
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Hotline</label>
            <input value={s.hotline} onChange={(e) => set("hotline", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email hiển thị trên web</label>
            <input value={s.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Số Zalo</label>
            <input
              value={s.zalo}
              onChange={(e) => set("zalo", e.target.value)}
              placeholder="0900000069"
              className={inputCls}
            />
            <p className="mt-1 text-[11px] text-stone-500">Chỉ nhập số, không có khoảng trắng.</p>
          </div>
          <div>
            <label className={labelCls}>Link Facebook</label>
            <input value={s.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Link kênh TikTok</label>
            <input
              value={s.tiktok ?? ""}
              onChange={(e) => set("tiktok", e.target.value)}
              placeholder="https://www.tiktok.com/@launuongmr69"
              className={inputCls}
            />
            <p className="mt-1 text-[11px] text-stone-500">
              Để trống thì nút TikTok tự ẩn khỏi website.
            </p>
          </div>
          <div>
            <label className={labelCls}>Link Messenger</label>
            <input
              value={s.messenger}
              onChange={(e) => set("messenger", e.target.value)}
              placeholder="https://m.me/tenfanpage"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email nhận báo đơn đặt bàn</label>
            <input value={s.notifyEmail} onChange={(e) => set("notifyEmail", e.target.value)} className={inputCls} />
            <p className="mt-1 text-[11px] text-stone-500">
              Cần khai báo RESEND_API_KEY trong .env.local thì email mới gửi được.
            </p>
          </div>
        </div>
      </section>

      {/* --- Ảnh bìa --- */}
      <section className={cardCls}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Ảnh bìa trang chủ ({s.hero.length})
          </h2>
          <button
            type="button"
            onClick={addSlide}
            className="rounded border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            + Thêm ảnh bìa
          </button>
        </div>

        <div className="space-y-5">
          {s.hero.map((slide, i) => (
            <div key={slide.id} className="rounded border border-stone-200 bg-stone-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Ảnh bìa {i + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("Xoá ảnh bìa này?")) return;
                    set("hero", s.hero.filter((h) => h.id !== slide.id));
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Xoá
                </button>
              </div>

              <div className="grid gap-4">
                <ImagePicker
                  value={slide.image}
                  onChange={(v) => setSlide(slide.id, { image: v })}
                  hint="Ảnh ngang cỡ lớn, khoảng 1920×1080. Ảnh sẽ bị phủ lớp tối để chữ dễ đọc."
                />
                <Bi label="Chữ nhỏ phía trên" value={slide.eyebrow} onChange={(v) => setSlide(slide.id, { eyebrow: v })} />
                <Bi
                  label="Tiêu đề lớn"
                  value={slide.title}
                  onChange={(v) => setSlide(slide.id, { title: v })}
                  rows={2}
                  hint="Xuống dòng trong ô này sẽ thành ngắt dòng trên web."
                />
                <Bi label="Mô tả" value={slide.subtitle} onChange={(v) => setSlide(slide.id, { subtitle: v })} rows={2} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Bi label="Chữ trên nút" value={slide.ctaLabel} onChange={(v) => setSlide(slide.id, { ctaLabel: v })} />
                  <div>
                    <label className={labelCls}>Nút dẫn tới</label>
                    <select
                      value={slide.ctaHref}
                      onChange={(e) => setSlide(slide.id, { ctaHref: e.target.value })}
                      className={inputCls}
                    >
                      <option value="/thuc-don">Thực đơn</option>
                      <option value="/uu-dai">Ưu đãi & Combo</option>
                      <option value="/khong-gian">Không gian</option>
                      <option value="/dat-ban">Đặt bàn</option>
                      <option value="/gioi-thieu">Giới thiệu</option>
                      <option value="/chi-nhanh">Chi nhánh</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Giới thiệu --- */}
      <section className={cardCls}>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-stone-500">
          Khối giới thiệu quán
        </h2>
        <div className="grid gap-5">
          <ImagePicker
            value={s.about.image}
            onChange={(v) => set("about", { ...s.about, image: v })}
            hint="Ảnh dọc, khoảng 900×1150."
          />
          <Bi label="Tiêu đề" value={s.about.title} onChange={(v) => set("about", { ...s.about, title: v })} />
          <Bi
            label="Nội dung"
            value={s.about.body}
            onChange={(v) => set("about", { ...s.about, body: v })}
            rows={8}
            hint="Để trống một dòng giữa hai đoạn để tách đoạn trên web."
          />
        </div>
      </section>

      {/* --- Ghi chú đặt bàn --- */}
      <section className={cardCls}>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-stone-500">
          Ghi chú ở trang Đặt bàn
        </h2>
        <Bi
          label="Nội dung ghi chú"
          value={s.bookingNote}
          onChange={(v) => set("bookingNote", v)}
          rows={3}
          hint="Hiện ở khung bên phải form đặt bàn."
        />
      </section>

      <div className="flex justify-end pb-6">
        <SaveButton onSave={save} dirty={dirty} pending={pending} />
      </div>
    </div>
  );
}
