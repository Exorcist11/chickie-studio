import React from "react";
import { Metadata } from "next";
import { PolicyClientPage } from "./PolicyClientPage";

export const metadata: Metadata = {
  title: "Chính Sách Thuê Đồ & Đặt Cọc | Chickie Studio",
  description:
    "Quy định minh bạch về đặt cọc, biểu phí trễ hạn, giữ gìn váy thiết kế, áo dài và chính sách hoàn tiền tại Chickie Studio Hà Nội.",
  openGraph: {
    title: "Chính Sách Thuê Đồ & Đặt Cọc | Chickie Studio",
    description:
      "Tìm hiểu quyền lợi khách hàng, quy định bồi hoàn hư hại và quy trình giặt hấp chuyên nghiệp tại Chickie Studio.",
    type: "website",
  },
};

export default function PolicyPage() {
  return <PolicyClientPage />;
}
