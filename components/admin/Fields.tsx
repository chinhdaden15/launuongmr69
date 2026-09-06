"use client";

import { useState } from "react";
import type { FieldDef } from "@/lib/admin-config";
import { ImagePicker } from "./ImagePicker";

type Row = Record<string, unknown>;
type Bi = { vi: string; en: string };

const inputCls =
  "w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700";
const labelCls = "mb-1.5 block text-xs font-semibold text-stone-700";
const hintCls = "mt-1 text-[11px] leading-relaxed text-stone-500";

/**
 * Ô nhập số.
 *
 * Không dùng thẳng `value={Number(...)}` được: khi chủ quán bôi đen số 0 rồi
 * bấm xoá, ô trở thành rỗng, `Number("")` ra 0 nên số 0 lập tức nhảy lại vào ô
 * — gõ số mới không được. Ở đây giữ nguyên đúng những gì đang gõ (kể cả ô
 * trống), chỉ quy ra số khi báo ngược lên trên.
 *
 * Ô trống được hiểu là 0, khớp với quy ước "để 0 nghĩa là theo thời giá".
 */
function ONhapSo({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [dangGo, setDangGo] = useState(value ? String(value) : "");

  return (
    <input
      type="number"
      inputMode="numeric"
      value={dangGo}
      placeholder="0"
      onChange={(e) => {
        const v = e.target.value;
        setDangGo(v);
        onChange(v === "" ? 0 : Number(v));
      }}
      onFocus={(e) => e.currentTarget.select()}
      className={`${inputCls} max-w-[200px]`}
    />
  );
}

/** Ô nhập song ngữ: hai khung Việt / Anh nằm cạnh nhau. */
function Bilingual({
  value, onChange, rows,
}: {
  value: Bi;
  onChange: (v: Bi) => void;
  rows?: number;
}) {
  const v = value ?? { vi: "", en: "" };
  return (
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
  );
}

/** Bảng giờ mở cửa: mỗi dòng gồm nhãn song ngữ và khung giờ. */
function HoursEditor({
  value, onChange,
}: {
  value: { label: Bi; time: string }[];
  onChange: (v: { label: Bi; time: string }[]) => void;
}) {
  const list = value ?? [];
  return (
    <div className="space-y-2">
      {list.map((row, i) => (
        <div key={i} className="flex flex-wrap items-end gap-2 rounded bg-stone-50 p-2">
          <div className="min-w-[150px] flex-1">
            <span className="mb-1 block text-[10px] text-stone-400">Nhãn (VI / EN)</span>
            <div className="flex gap-1.5">
              <input
                value={row.label?.vi ?? ""}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = { ...row, label: { ...row.label, vi: e.target.value } };
                  onChange(next);
                }}
                className={inputCls}
              />
              <input
                value={row.label?.en ?? ""}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = { ...row, label: { ...row.label, en: e.target.value } };
                  onChange(next);
                }}
                className={inputCls}
              />
            </div>
          </div>
          <div className="w-40">
            <span className="mb-1 block text-[10px] text-stone-400">Giờ</span>
            <input
              value={row.time ?? ""}
              placeholder="16:00 – 24:00"
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...row, time: e.target.value };
                onChange(next);
              }}
              className={inputCls}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(list.filter((_, j) => j !== i))}
            className="rounded border border-stone-300 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50"
          >
            Xoá
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...list, { label: { vi: "", en: "" }, time: "" }])
        }
        className="rounded border border-dashed border-stone-400 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100"
      >
        + Thêm dòng giờ
      </button>
    </div>
  );
}

/** Vẽ một ô nhập liệu dựa trên định nghĩa trong lib/admin-config.ts */
export function Field({
  def, row, onChange, categories,
}: {
  def: FieldDef;
  row: Row;
  onChange: (key: string, value: unknown) => void;
  categories: { id: string; label: string }[];
}) {
  const value = row[def.key];
  const set = (v: unknown) => onChange(def.key, v);

  const body = (() => {
    switch (def.type) {
      case "bilingual":
        return <Bilingual value={value as Bi} onChange={set} />;
      case "bilingual-textarea":
        return <Bilingual value={value as Bi} onChange={set} rows={def.rows ?? 3} />;
      case "image":
        return <ImagePicker value={String(value ?? "")} onChange={set} hint={def.hint} />;
      case "textarea":
        return (
          <textarea
            rows={def.rows ?? 3}
            value={String(value ?? "")}
            onChange={(e) => set(e.target.value)}
            className={`${inputCls} resize-y`}
          />
        );
      case "html":
        return (
          <textarea
            rows={3}
            value={String(value ?? "")}
            onChange={(e) => set(e.target.value)}
            placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
            className={`${inputCls} resize-y font-mono text-xs`}
          />
        );
      case "number":
        return <ONhapSo value={Number(value ?? 0)} onChange={set} />;
      case "date":
        return (
          <input
            type="date"
            value={String(value ?? "")}
            onChange={(e) => set(e.target.value)}
            className={`${inputCls} max-w-[200px]`}
          />
        );
      case "checkbox":
        return (
          <label className="inline-flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => set(e.target.checked)}
              className="h-4 w-4 accent-emerald-700"
            />
            <span className="text-sm text-stone-700">{def.label}</span>
          </label>
        );
      case "select":
        return (
          <select
            value={String(value ?? "")}
            onChange={(e) => set(e.target.value)}
            className={`${inputCls} max-w-[280px]`}
          >
            {def.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );
      case "category":
        return (
          <select
            value={String(value ?? "")}
            onChange={(e) => set(e.target.value)}
            className={`${inputCls} max-w-[280px]`}
          >
            <option value="">— Chọn nhóm —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        );
      case "hours":
        return (
          <HoursEditor
            value={value as { label: Bi; time: string }[]}
            onChange={set}
          />
        );
      case "slug":
        return (
          <input
            value={String(value ?? "")}
            onChange={(e) =>
              set(
                e.target.value
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/đ/g, "d")
                  .replace(/[^a-z0-9-]+/g, "-"),
              )
            }
            className={`${inputCls} font-mono`}
          />
        );
      default:
        return (
          <input
            value={String(value ?? "")}
            onChange={(e) => set(e.target.value)}
            className={inputCls}
          />
        );
    }
  })();

  return (
    <div>
      {def.type !== "checkbox" ? (
        <label className={labelCls}>{def.label}</label>
      ) : null}
      {body}
      {def.hint && def.type !== "image" ? (
        <p className={hintCls}>{def.hint}</p>
      ) : null}
    </div>
  );
}
