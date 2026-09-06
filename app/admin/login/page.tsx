"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

/** Trang đăng nhập admin. Mật khẩu đặt trong file .env.local */
export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-8 shadow-sm"
      >
        <p className="text-center text-2xl font-bold tracking-tight">Mr.69</p>
        <p className="mt-1 text-center text-[11px] uppercase tracking-widest text-stone-400">
          Trang quản trị
        </p>

        <label
          htmlFor="password"
          className="mt-8 mb-2 block text-xs font-semibold text-stone-700"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
        />

        {state?.error ? (
          <p className="mt-3 text-sm text-red-600">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {pending ? "Đang kiểm tra..." : "Đăng nhập"}
        </button>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-stone-500">
          Quên mật khẩu? Ở máy thì mở file{" "}
          <code className="rounded bg-stone-100 px-1">.env.local</code>, dòng{" "}
          <code className="rounded bg-stone-100 px-1">ADMIN_PASSWORD</code>. Trên
          bản đã đưa lên mạng thì vào Vercel → Settings → Environment Variables.
        </p>
      </form>
    </div>
  );
}
