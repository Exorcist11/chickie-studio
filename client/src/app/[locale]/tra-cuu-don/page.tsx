import React, { Suspense } from "react";
import { Metadata } from "next";
import { TrackingClientPage } from "./TrackingClientPage";
import { TrackingSkeleton } from "@/components/features/tracking";

export const metadata: Metadata = {
  title: "Tra Cứu Đơn Thuê Đồ Trực Tuyến | Chickie Studio",
  description:
    "Tra cứu tình trạng đơn thuê váy thiết kế, áo dài kỷ yếu và combo máy ảnh Sony/Canon tại Chickie Studio bằng mã đơn và số điện thoại.",
  openGraph: {
    title: "Tra Cứu Đơn Thuê Đồ | Chickie Studio",
    description:
      "Kiểm tra tiến trình xử lý đơn hàng, dải ngày nhận trả đồ và thông tin chuyển khoản cọc an toàn.",
    type: "website",
  },
};

export default function TrackingPage() {
  return (
    <Suspense fallback={<TrackingSkeleton className="max-w-5xl mx-auto p-8" />}>
      <TrackingClientPage />
    </Suspense>
  );
}
