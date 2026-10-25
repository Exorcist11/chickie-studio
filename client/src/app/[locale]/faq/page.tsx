import React from "react";
import { Metadata } from "next";
import { FaqClientPage } from "./FaqClientPage";

export const metadata: Metadata = {
  title: "Câu Hỏi Thường Gặp (FAQ) | Chickie Studio",
  description:
    "Giải đáp mọi thắc mắc về quy trình thuê váy thiết kế, thử đồ tại tiệm Chùa Láng, đổi size và chính sách giặt hấp chuyên nghiệp tại Chickie Studio.",
  openGraph: {
    title: "Câu Hỏi Thường Gặp (FAQ) | Chickie Studio",
    description:
      "Tổng hợp câu trả lời chi tiết cho khách hàng thuê trang phục và combo máy ảnh tại Chickie Studio Hà Nội.",
    type: "website",
  },
};

export default function FaqPage() {
  return <FaqClientPage />;
}
