"use client";

import * as React from "react";
import { X, Ruler, Check, Sparkles, Camera, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui";
import { BusinessPillar } from "../product-pillar.config";

export interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillar?: BusinessPillar;
  onSelectSize?: (size: string) => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  pillar = "COSTUME",
  onSelectSize,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-burgundy text-xs font-semibold uppercase tracking-wider">
              <Ruler className="w-4 h-4 text-burgundy" />
              <span>Bảng Thông Số Quy Đổi Kích Cỡ Chuẩn</span>
            </div>
            <h2 id="size-guide-title" className="font-serif text-2xl font-semibold text-ink">
              {pillar === "CAMERA"
                ? "Thông Số Thiết Bị & Cấu Hình Combo"
                : pillar === "PHOTOGRAPHY"
                ? "Quy Chuẩn Gói Dịch Vụ Chụp Ảnh"
                : "Hướng Dẫn Chọn Size Váy & Áo Dài"}
            </h2>
            <p className="text-xs text-ink-muted">
              {pillar === "CAMERA"
                ? "Kiểm tra kỹ bộ phụ kiện kèm theo để lựa chọn gói phù hợp nhu cầu"
                : pillar === "PHOTOGRAPHY"
                ? "Lựa chọn gói chụp phù hợp với số lượng thành viên và yêu cầu retouch"
                : "Số đo may đo chuẩn form nữ Việt Nam. Nếu số đo nằm giữa 2 size, tiệm khuyến khích chọn size lớn hơn."}
            </p>
          </div>

          <button
            type="button"
            aria-label="Đóng modal"
            onClick={onClose}
            className="text-ink-muted hover:text-ink p-1.5 rounded-full hover:bg-ivory transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Costume Size Table */}
        {pillar === "COSTUME" && (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-xs text-ink">
                <thead className="bg-ivory/80 text-ink uppercase tracking-wider font-semibold border-b border-line">
                  <tr>
                    <th scope="col" className="p-3">Size</th>
                    <th scope="col" className="p-3">Vòng 1 (Ngực)</th>
                    <th scope="col" className="p-3">Vòng 2 (Eo)</th>
                    <th scope="col" className="p-3">Vòng 3 (Mông)</th>
                    <th scope="col" className="p-3">Chiều cao</th>
                    <th scope="col" className="p-3">Cân nặng</th>
                    <th scope="col" className="p-3 text-right">Chọn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr className="hover:bg-ivory/30 transition-colors">
                    <td className="p-3 font-semibold text-burgundy">XS</td>
                    <td className="p-3">78 - 81 cm</td>
                    <td className="p-3">58 - 61 cm</td>
                    <td className="p-3">82 - 85 cm</td>
                    <td className="p-3">1m48 - 1m55</td>
                    <td className="p-3">38 - 43 kg</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          onSelectSize?.("XS");
                          onClose();
                        }}
                      >
                        Chọn XS
                      </Button>
                    </td>
                  </tr>
                  <tr className="bg-burgundy/5 font-medium hover:bg-burgundy/10 transition-colors">
                    <td className="p-3 font-bold text-burgundy">S (Phổ biến)</td>
                    <td className="p-3">82 - 85 cm</td>
                    <td className="p-3">62 - 66 cm</td>
                    <td className="p-3">86 - 90 cm</td>
                    <td className="p-3">1m52 - 1m62</td>
                    <td className="p-3">43 - 48 kg</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs h-7 px-2.5"
                        onClick={() => {
                          onSelectSize?.("S");
                          onClose();
                        }}
                      >
                        Chọn S
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-ivory/30 transition-colors">
                    <td className="p-3 font-semibold text-burgundy">M</td>
                    <td className="p-3">86 - 89 cm</td>
                    <td className="p-3">67 - 71 cm</td>
                    <td className="p-3">91 - 95 cm</td>
                    <td className="p-3">1m56 - 1m66</td>
                    <td className="p-3">49 - 54 kg</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          onSelectSize?.("M");
                          onClose();
                        }}
                      >
                        Chọn M
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-ivory/30 transition-colors">
                    <td className="p-3 font-semibold text-burgundy">L</td>
                    <td className="p-3">90 - 94 cm</td>
                    <td className="p-3">72 - 76 cm</td>
                    <td className="p-3">96 - 100 cm</td>
                    <td className="p-3">1m60 - 1m70</td>
                    <td className="p-3">55 - 60 kg</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          onSelectSize?.("L");
                          onClose();
                        }}
                      >
                        Chọn L
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Measuring Tips */}
            <div className="rounded-xl bg-ivory/50 border border-line p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-ink">
                <Sparkles className="w-4 h-4 text-burgundy" />
                <span>Mẹo Đo Số Đo Chuẩn Xác Bằng Thước Dây</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-ink-muted">
                <li className="space-y-1">
                  <strong className="text-ink block font-medium">1. Vòng ngực (Bust):</strong>
                  Đo vòng quanh phần nở nhất của ngực, giữ thước dây ngang thẳng lưng và thở tự nhiên.
                </li>
                <li className="space-y-1">
                  <strong className="text-ink block font-medium">2. Vòng eo (Waist):</strong>
                  Đo vòng quanh phần nhỏ nhất của eo (thường nằm trên rốn khoảng 2-3 cm).
                </li>
                <li className="space-y-1">
                  <strong className="text-ink block font-medium">3. Vòng mông (Hips):</strong>
                  Đo vòng quanh điểm nở nhất của mông khi đứng khép 2 chân thẳng.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Camera Spec Guide */}
        {pillar === "CAMERA" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-ivory/50 border border-line space-y-2">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <Camera className="w-4 h-4 text-burgundy" />
                  <span>Bộ Kit Tiêu Chuẩn Đi Kèm</span>
                </div>
                <ul className="space-y-1.5 text-ink-muted">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    <span>01 Thân máy (Body) đã sạc đầy 100% pin</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    <span>01 Ống kính kit đa dụng (16-50mm hoặc tương đương)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    <span>01 Thẻ nhớ tốc độ cao SanDisk 64GB/128GB</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    <span>Túi đựng chống sốc, dây đeo cổ và đầu đọc thẻ Type-C</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-ivory/50 border border-line space-y-2">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <ShieldCheck className="w-4 h-4 text-burgundy" />
                  <span>Chính Sách Bàn Giao Thiết Bị</span>
                </div>
                <p className="text-ink-muted leading-relaxed">
                  Thiết bị được kiểm tra cảm biến, lens sạch bụi và test quay/chụp trước mặt khách hàng. Tiệm hỗ trợ hướng dẫn cài đặt chế độ tự động cho các bạn chưa từng dùng máy ảnh.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Photography Service Guide */}
        {pillar === "PHOTOGRAPHY" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-ivory/50 border border-line space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink">
                <Heart className="w-4 h-4 text-burgundy" />
                <span>Đặc Quyền Gói Chụp Ảnh Tại Chickie Studio</span>
              </div>
              <ul className="space-y-1.5 text-ink-muted">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Toàn bộ file gốc (JPEG chất lượng cao) được trả ngay trong ngày</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Chỉnh sửa tone màu Hàn Quốc & bóp dáng tỉ mỉ theo yêu cầu</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Miễn phí mượn thêm 01 bộ phụ kiện (hoa cầm tay, nón cói, kính râm)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Đã hiểu & Tiếp tục đặt
          </Button>
        </div>
      </div>
    </div>
  );
};
