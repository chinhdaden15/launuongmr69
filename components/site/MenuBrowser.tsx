"use client";

import { useState } from "react";
import { Container } from "./Container";
import { MenuPosterGrid, type Poster } from "./MenuPosterGrid";

export type MenuTab = { id: string; label: string };
export type BrowsablePoster = Poster & { categoryId: string };

const ALL = "tat-ca";

/**
 * TRANG THỰC ĐƠN — thanh chọn mục + lưới ảnh (bố cục giống OM Nướng).
 *
 * Tab đầu tiên (MENU) hiện TOÀN BỘ ảnh menu.
 * Bấm sang mục khác thì chỉ còn ảnh của mục đó.
 *
 * Việc lọc chạy ngay trên trình duyệt nên bấm là đổi tức thì, không tải lại trang.
 * Toàn bộ ảnh vẫn nằm sẵn trong mã nguồn trang nên Google đọc được đầy đủ.
 *
 * Muốn thêm/bớt mục: vào /admin → Thực đơn → Nhóm món.
 */
export function MenuBrowser({
  tabs,
  posters,
  allLabel,
  emptyLabel,
}: {
  tabs: MenuTab[];
  posters: BrowsablePoster[];
  allLabel: string;
  emptyLabel: string;
}) {
  const [active, setActive] = useState(ALL);

  const shown =
    active === ALL ? posters : posters.filter((p) => p.categoryId === active);

  const allTabs: MenuTab[] = [{ id: ALL, label: allLabel }, ...tabs];

  return (
    <>
      {/* --- Thanh chọn mục --- */}
      <div className="sticky top-[74px] z-30 bg-cream-deep lg:top-[92px]">
        <div className="no-scrollbar mx-auto flex max-w-[1560px] gap-1 overflow-x-auto px-4 sm:px-8">
          {allTabs.map((tab) => {
            const on = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                aria-pressed={on}
                // Mục đang chọn có nền kem sáng nối liền với vùng ảnh bên dưới,
                // tạo cảm giác như một cái tab giấy nhô lên.
                className={`shrink-0 whitespace-nowrap rounded-t-2xl px-5 py-4 font-display text-base uppercase tracking-wide transition-colors lg:px-8 lg:py-5 lg:text-xl ${
                  on
                    ? "bg-cream text-brand"
                    : "text-brand/65 hover:bg-cream/45 hover:text-brand"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Lưới ảnh của mục đang chọn --- */}
      <div className="bg-cream pb-16 pt-10 lg:pb-24 lg:pt-14">
        <Container wide>
          {shown.length === 0 ? (
            <p className="py-20 text-center text-ink-soft">{emptyLabel}</p>
          ) : (
            <MenuPosterGrid posters={shown} />
          )}
        </Container>
      </div>
    </>
  );
}
