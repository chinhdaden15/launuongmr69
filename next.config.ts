import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Bảo Next.js gói kèm thư mục /data và /public/uploads vào bản chạy trên
   * máy chủ. Không có dòng này thì trang admin trên Vercel sẽ báo lỗi vì không
   * tìm thấy file dữ liệu (các trang công khai vẫn chạy bình thường, vì chúng
   * đã được dựng sẵn thành HTML tĩnh lúc đóng gói).
   */
  outputFileTracingIncludes: {
    "/admin/**": ["./data/**/*"],
    "/api/**": ["./data/**/*"],
  },
};

export default nextConfig;
