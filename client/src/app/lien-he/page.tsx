import React from "react";
import { Metadata } from "next";
import { ContactClientPage } from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Liên Hệ & Ghé Thăm Showroom | Chickie Studio",
  description:
    "Ghé thăm showroom Chickie Studio tại số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội để thử váy thiết kế, áo dài và nhận tư vấn đặt lịch trực tiếp. Hotline 0987.654.321.",
  openGraph: {
    title: "Liên Hệ & Ghé Thăm Showroom | Chickie Studio",
    description:
      "Địa chỉ showroom, chỉ đường Google Maps và kênh tư vấn trực tuyến nhanh chóng cùng Chickie Studio Hà Nội.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClientPage />;
}
