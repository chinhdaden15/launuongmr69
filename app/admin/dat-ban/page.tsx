import { requireAdmin } from "@/lib/auth";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { getBookings, getBranches } from "@/lib/store";

export const dynamic = "force-dynamic";

/** QUẢN LÝ ĐƠN ĐẶT BÀN */
export default async function AdminBookingsPage() {
  await requireAdmin();
  const [bookings, branches] = await Promise.all([getBookings(), getBranches()]);

  const branchNames = Object.fromEntries(branches.map((b) => [b.id, b.name.vi]));

  return (
    <div>
      <header className="mb-6 border-b border-stone-200 pb-5">
        <h1 className="text-xl font-bold text-stone-900">Đơn đặt bàn</h1>
        <p className="mt-1 text-sm text-stone-600">
          Đơn khách gửi từ trang Đặt bàn. Bấm số điện thoại để gọi lại xác nhận,
          rồi đổi trạng thái để theo dõi.
        </p>
      </header>

      <BookingsTable bookings={bookings} branchNames={branchNames} />
    </div>
  );
}
