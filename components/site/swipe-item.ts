/**
 * Lớp CSS bắt buộc cho mỗi <li> nằm trong <SwipeRow>.
 *
 * Hằng số này để ở file riêng (KHÔNG có "use client") vì các mục chạy phía máy
 * chủ cần dùng tới nó. Nếu để chung trong SwipeRow.tsx thì Next.js sẽ hiểu nhầm
 * nó là mã phía trình duyệt và class sẽ không áp được.
 *
 * Muốn đổi bề rộng mỗi thẻ khi vuốt trên điện thoại: sửa số 82vw ở đây.
 */
export const SWIPE_ITEM = "w-[82vw] shrink-0 snap-center sm:w-auto";
