"use client";

import { useRef, useState } from "react";

/**
 * Ô chọn ảnh: kéo thả hoặc bấm để tải lên, có xem trước.
 * Ảnh tải lên được lưu vào public/uploads và điền đường dẫn vào ô.
 */
export function ImagePicker({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  /** Báo đã nén được bao nhiêu, ví dụ "Đã nén 4.2MB → 310KB". */
  const [daNen, setDaNen] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    setDaNen("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải lên thất bại");
      onChange(data.url);

      // Cho chủ quán thấy ảnh đã được nén nhẹ đi bao nhiêu.
      const { cuKb, moiKb } = data as { cuKb?: number; moiKb?: number };
      if (cuKb && moiKb && cuKb > moiKb * 1.1) {
        const g = (kb: number) =>
          kb >= 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${kb}KB`;
        setDaNen(`Đã nén nhẹ ảnh: ${g(cuKb)} → ${g(moiKb)} cho web tải nhanh.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải lên thất bại");
    } finally {
      setBusy(false);
    }
  }

  const isVideo = /\.(mp4|webm)$/i.test(value);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`flex items-center gap-4 rounded border-2 border-dashed p-3 transition-colors ${
          dragging ? "border-emerald-600 bg-emerald-50" : "border-stone-300 bg-white"
        }`}
      >
        {/* Xem trước */}
        <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-stone-100">
          {value ? (
            isVideo ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              // Ảnh admin dùng thẻ img thường để hiện được mọi đường dẫn.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <span className="text-[10px] text-stone-400">Chưa có ảnh</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded bg-stone-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700 disabled:opacity-50"
            >
              {busy ? "Đang tải..." : "Chọn file"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded border border-stone-300 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100"
              >
                Xoá ảnh
              </button>
            ) : null}
          </div>

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/ten-anh.jpg"
            className="mt-2 w-full rounded border border-stone-200 px-2 py-1 font-mono text-[11px] text-stone-600"
          />

          <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
            {error ? (
              <span className="text-red-600">{error}</span>
            ) : daNen ? (
              <span className="text-green-700">{daNen}</span>
            ) : (
              hint || "Kéo thả file vào đây, hoặc bấm Chọn file. Tối đa 25MB."
            )}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
