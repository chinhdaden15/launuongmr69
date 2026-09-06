import type { ReactNode } from "react";

/** Khung giới hạn bề ngang chung cho mọi mục. Sửa max-w ở đây là đổi toàn site. */
export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 ${wide ? "max-w-[1560px]" : "max-w-[1240px]"} ${className}`}
    >
      {children}
    </div>
  );
}
