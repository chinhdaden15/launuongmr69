import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "cream";

// Nút bo tròn hoàn toàn (viên thuốc) — đổi rounded-full thành rounded-card
// nếu muốn nút bo góc vuông vắn hơn.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const variants: Record<Variant, string> = {
  solid: "bg-brand text-cream hover:bg-brand-dark",
  outline:
    "border border-brand/40 text-brand hover:border-brand hover:bg-brand hover:text-cream",
  cream:
    "border border-cream/45 text-cream hover:border-cream hover:bg-cream hover:text-forest",
  ghost: "text-accent underline-offset-4 hover:underline px-0 py-0",
};

/** Nút bấm dùng chung. Dùng `href` để ra link, `onClick` để ra nút thường. */
export function Button({
  href,
  children,
  variant = "solid",
  className = "",
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:");
    if (external) {
      return (
        <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
