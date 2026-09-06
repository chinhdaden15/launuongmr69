import type { Metadata, Viewport } from "next";
import { Phudu, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Phudu: font tiêu đề, do nhóm chữ Việt thiết kế, đủ dấu tiếng Việt.
const phudu = Phudu({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-phudu",
  display: "swap",
});

// Be Vietnam Pro: font chữ thường, thay cho Visby CF (bản trả phí).
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://launuongmr69.com"),
  title: {
    default: "Mr.69 — Lẩu & Nướng",
    template: "%s | Mr.69",
  },
  description:
    "Lẩu sôi, than hồng và những phần thịt ướp theo công thức riêng. Mr.69 — không gian lẩu nướng mộc mạc, ấm cúng.",
  openGraph: {
    type: "website",
    siteName: "Mr.69 — Lẩu & Nướng",
    locale: "vi_VN",
  },
};

export const viewport: Viewport = {
  themeColor: "#374a32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${phudu.variable} ${beVietnam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
