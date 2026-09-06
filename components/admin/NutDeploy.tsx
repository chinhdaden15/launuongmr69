"use client";

import { useState, useTransition } from "react";
import { deployAction } from "@/app/admin/actions";

/**
 * NÚT ĐƯA NỘI DUNG LÊN MẠNG
 *
 * Sửa xong trong trang quản trị thì nội dung mới chỉ nằm trên máy. Bấm nút này
 * để đẩy lên GitHub, Vercel tự dựng lại website sau khoảng 2 phút.
 *
 * ĐÂY LÀ NÚT TẠM. Khi chuyển dữ liệu sang Supabase, nội dung sửa xong sẽ hiện
 * ngay trên mạng, không cần đẩy nữa — lúc đó xoá thành phần này và chỗ gọi nó
 * trong app/admin/layout.tsx là xong.
 */
export function NutDeploy() {
  const [pending, startTransition] = useTransition();
  const [bao, setBao] = useState<{ ok: boolean; chu: string } | null>(null);

  function bam() {
    setBao(null);
    startTransition(async () => {
      const kq = await deployAction();
      if (!kq.ok) {
        setBao({ ok: false, chu: kq.loi ?? "Không đưa lên được." });
        return;
      }
      setBao({
        ok: true,
        chu:
          kq.soFile === 0
            ? "Không có gì mới — bản trên mạng đang khớp với máy bạn."
            : `Đã đưa ${kq.soFile} thay đổi lên. Khoảng 2 phút nữa website cập nhật.`,
      });
    });
  }

  return (
    <div className="border-t border-stone-200 px-3 py-4">
      <button
        type="button"
        onClick={bam}
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded bg-stone-800 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Đang đưa lên...
          </>
        ) : (
          <>↑ Đưa lên mạng</>
        )}
      </button>

      {bao ? (
        <p
          className={`mt-2.5 text-[11px] leading-relaxed ${bao.ok ? "text-green-700" : "text-red-600"}`}
        >
          {bao.chu}
        </p>
      ) : (
        <p className="mt-2.5 text-[11px] leading-relaxed text-stone-500">
          Sửa xong hết thì bấm nút này để bản trên mạng cập nhật theo.
        </p>
      )}
    </div>
  );
}
