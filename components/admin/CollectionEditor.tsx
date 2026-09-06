"use client";

import { useState, useTransition } from "react";
import type { CollectionConfig } from "@/lib/admin-config";
import { saveCollectionAction } from "@/app/admin/actions";
import { Field } from "./Fields";

type Row = Record<string, unknown> & { id: string };

/**
 * Trình quản lý danh sách dùng chung cho Món ăn, Nhóm món, Ưu đãi,
 * Chi nhánh và Thư viện ảnh.
 *
 * Cách dùng: bấm vào một dòng để mở ra sửa, bấm "Thêm mới" để tạo dòng mới,
 * xong bấm "Lưu thay đổi". Trước khi lưu, mọi thay đổi chỉ nằm trên trình duyệt.
 */
export function CollectionEditor({
  config,
  initial,
  categories = [],
}: {
  config: CollectionConfig;
  initial: Row[];
  categories?: { id: string; label: string }[];
}) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const title = (row: Row) => {
    const v = row[config.titleField];
    if (v && typeof v === "object" && "vi" in (v as object)) {
      return (v as { vi: string }).vi || "(chưa đặt tên)";
    }
    return String(v || "(chưa đặt tên)");
  };

  function updateRow(id: string, key: string, value: unknown) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
    setDirty(true);
    setMessage(null);
  }

  function addRow() {
    const id = `${config.name}-${Date.now().toString(36)}`;
    const maxOrder = rows.reduce((m, r) => Math.max(m, Number(r.order) || 0), 0);
    const row = { ...structuredClone(config.blank), id, order: maxOrder + 1 } as Row;
    setRows((prev) => [...prev, row]);
    setOpenId(id);
    setDirty(true);
    setMessage(null);
    // Đợi mục mới được vẽ ra rồi cuộn tới, khỏi phải tự đi tìm.
    setTimeout(() => {
      document
        .getElementById(`muc-${id}`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 60);
  }

  function removeRow(id: string) {
    if (!confirm("Xoá mục này? Thao tác chỉ có hiệu lực sau khi bạn bấm Lưu thay đổi.")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (openId === id) setOpenId(null);
    setDirty(true);
  }

  function move(id: string, dir: -1 | 1) {
    setRows((prev) => {
      const i = prev.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      // Đánh lại số thứ tự theo vị trí mới.
      return next.map((r, k) => ({ ...r, order: k + 1 }));
    });
    setDirty(true);
  }

  function save() {
    startTransition(async () => {
      const result = await saveCollectionAction(config.name, JSON.stringify(rows));
      if (result?.error) {
        setMessage({ ok: false, text: result.error });
      } else {
        setDirty(false);
        setMessage({ ok: true, text: "Đã lưu. Mở website ra là thấy thay đổi ngay." });
      }
    });
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-stone-900">{config.title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
            {config.description}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={addRow}
            className="rounded border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            + Thêm mới
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className="rounded bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {pending ? "Đang lưu..." : dirty ? "Lưu thay đổi" : "Đã lưu"}
          </button>
        </div>
      </header>

      {message ? (
        <p
          className={`mb-5 rounded border-l-4 px-4 py-3 text-sm ${
            message.ok
              ? "border-green-600 bg-green-50 text-green-800"
              : "border-red-600 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {dirty ? (
        <p className="mb-5 rounded border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bạn có thay đổi chưa lưu. Nhớ bấm <strong>Lưu thay đổi</strong> trước khi rời trang.
        </p>
      ) : null}

      <ul className="space-y-2">
        {rows.map((row, i) => {
          const open = openId === row.id;
          return (
            <li
              key={row.id}
              id={`muc-${row.id}`}
              className={`overflow-hidden rounded border bg-white ${open ? "border-emerald-600 shadow-sm" : "border-stone-200"}`}
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span className="w-7 shrink-0 text-center text-xs font-medium text-stone-400">
                  {i + 1}
                </span>

                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : row.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  {typeof row.image === "string" && row.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.image}
                      alt=""
                      className="h-10 w-14 shrink-0 rounded object-cover"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-stone-900">
                      {title(row)}
                    </span>
                    {row.published === false || row.available === false ? (
                      <span className="text-[11px] text-red-600">Đang ẩn / tạm hết</span>
                    ) : null}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(row.id, -1)}
                    disabled={i === 0}
                    aria-label="Lên trên"
                    className="rounded px-2 py-1 text-stone-500 hover:bg-stone-100 disabled:opacity-25"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(row.id, 1)}
                    disabled={i === rows.length - 1}
                    aria-label="Xuống dưới"
                    className="rounded px-2 py-1 text-stone-500 hover:bg-stone-100 disabled:opacity-25"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : row.id)}
                    className="rounded px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-50"
                  >
                    {open ? "Thu gọn" : "Sửa"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Xoá
                  </button>
                </div>
              </div>

              {open ? (
                <div className="grid gap-5 border-t border-stone-200 bg-stone-50 p-5">
                  {config.fields.map((def) => (
                    <Field
                      key={def.key}
                      def={def}
                      row={row}
                      categories={categories}
                      onChange={(key, value) => updateRow(row.id, key, value)}
                    />
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Nút thêm ngay cuối danh sách — khỏi phải cuộn ngược lên đầu trang.
          Nút ở đầu trang vẫn giữ cho ai quen bấm ở trên. */}
      {rows.length > 0 ? (
        <button
          type="button"
          onClick={addRow}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded border-2 border-dashed border-stone-300 py-4 text-sm font-medium text-stone-600 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
        >
          <span className="text-lg leading-none">+</span>
          Thêm {config.title.split(" (")[0].toLowerCase()} mới
        </button>
      ) : null}

      {rows.length === 0 ? (
        <p className="rounded border border-dashed border-stone-300 py-14 text-center text-sm text-stone-500">
          Chưa có mục nào. Bấm <strong>+ Thêm mới</strong> để bắt đầu.
        </p>
      ) : null}

      {rows.length > 3 ? (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className="rounded bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-45"
          >
            {pending ? "Đang lưu..." : dirty ? "Lưu thay đổi" : "Đã lưu"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
