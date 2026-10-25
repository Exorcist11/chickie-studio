import * as React from "react";
import { Sparkles, Calendar, Camera, CheckCircle2, LucideIcon } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui";
import { RentalStep } from "@/types/home";

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  calendar: Calendar,
  camera: Camera,
  "check-circle": CheckCircle2,
};

export interface ProcessStepsProps {
  steps?: RentalStep[];
  title?: string;
  description?: string;
}

const DEFAULT_STEPS: RentalStep[] = [
  {
    stepNumber: 1,
    title: "Chọn mẫu & size",
    description: "Khám phá bộ sưu tập váy áo, máy ảnh và chọn dải ngày nhận/trả đồ thuận tiện.",
    icon: "sparkles",
  },
  {
    stepNumber: 2,
    title: "Đặt cọc giữ đồ",
    description: "Xác nhận thông tin, chuyển khoản cọc nhanh qua VietQR hoặc thanh toán trực tiếp.",
    icon: "calendar",
  },
  {
    stepNumber: 3,
    title: "Nhận đồ xinh",
    description: "Nhận đồ đã được giặt ủi thơm tho phẳng phiu tại tiệm hoặc giao tận nơi.",
    icon: "camera",
  },
  {
    stepNumber: 4,
    title: "Trả đồ & hoàn cọc",
    description: "Gửi trả đồ sau buổi chụp và nhận lại tiền cọc an toàn, nhanh chóng.",
    icon: "check-circle",
  },
];

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  steps = DEFAULT_STEPS,
  title = "Quy Trình Thuê Đồ Đơn Giản",
  description = "Chỉ với 4 bước nhanh chóng, trang phục xinh xắn sẽ được giao tận tay bạn",
}) => {
  return (
    <Section className="py-14 md:py-20 bg-gradient-to-b from-warm-white via-ivory/40 to-warm-white border-b border-line">
      <Container className="space-y-12">
        <SectionHeading
          title={title}
          description={description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => {
            const IconComponent = ICON_MAP[step.icon] || Sparkles;

            return (
              <div
                key={step.stepNumber}
                className="group relative flex flex-col p-6 rounded-3xl bg-white border border-line shadow-card hover:shadow-raised hover:-translate-y-1 transition-all duration-300"
              >
                {/* Step badge & icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-burgundy/10 border border-burgundy/20 flex items-center justify-center text-burgundy group-hover:bg-burgundy group-hover:text-warm-white transition-colors duration-300 shadow-xs">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-ivory text-burgundy border border-line">
                    0{step.stepNumber}
                  </span>
                </div>

                {/* Step title & description */}
                <h3 className="font-serif text-lg font-medium text-ink group-hover:text-burgundy transition-colors mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {step.description}
                </p>

                {/* Bottom luxury accent bar */}
                <div className="mt-auto pt-4">
                  <div className="w-8 h-0.5 bg-line group-hover:w-full group-hover:bg-gold transition-all duration-500 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
