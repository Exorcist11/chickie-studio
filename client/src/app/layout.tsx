import type { Metadata } from "next";
import { fontLora, fontBeVietnamPro } from "@/lib/fonts";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Chickie Studio | Dịch Vụ Cho Thuê Váy & Combo Chụp Ảnh",
  description:
    "Chickie Studio - Cho thuê váy thiết kế cao cấp, áo dài truyền thống & combo máy ảnh chuyên nghiệp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${fontLora.variable} ${fontBeVietnamPro.variable} antialiased`}
    >
      <body className="min-h-screen bg-warm-white text-ink font-sans selection:bg-burgundy selection:text-white">
        {children}
      </body>
    </html>
  );
}
