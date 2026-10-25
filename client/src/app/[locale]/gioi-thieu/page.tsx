import React from "react";
import { Metadata } from "next";
import { AboutClientPage } from "./AboutClientPage";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Câu Chuyện Thương Hiệu | Chickie Studio",
  description:
    "Khám phá câu chuyện thương hiệu Chickie Studio - More than just a dress. Dịch vụ cho thuê váy thiết kế cao cấp, áo dài kỷ yếu chuẩn form và cam kết giặt hấp y tế tại Hà Nội.",
  openGraph: {
    title: "Về Chickie Studio | More Than Just A Dress",
    description:
      "Hành trình mang đến vẻ đẹp rạng rỡ cho hàng nghìn nàng thơ trong mọi khoảnh khắc thanh xuân đáng nhớ.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClientPage />;
}
