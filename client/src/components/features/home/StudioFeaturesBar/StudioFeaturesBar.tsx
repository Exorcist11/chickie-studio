import * as React from "react";
import { Sparkles, HeartHandshake, Camera, Palette } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export interface StudioFeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: StudioFeatureItem[] = [
  {
    icon: Sparkles,
    title: "Thiết kế tinh tế",
    description: "Tôn vinh cá tính riêng",
  },
  {
    icon: HeartHandshake,
    title: "Dịch vụ chuyên nghiệp",
    description: "Tận tâm trong từng chi tiết",
  },
  {
    icon: Camera,
    title: "Trang thiết bị hiện đại",
    description: "Đáp ứng mọi nhu cầu",
  },
  {
    icon: Palette,
    title: "Đội ngũ sáng tạo",
    description: "Luôn đồng hành cùng bạn",
  },
];

export interface StudioFeaturesBarProps {
  features?: StudioFeatureItem[];
  className?: string;
}

export const StudioFeaturesBar: React.FC<StudioFeaturesBarProps> = ({
  features = DEFAULT_FEATURES,
  className,
}) => {
  return (
    <section className={cn("py-8 md:py-12 bg-warm-white", className)}>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-ivory/50 border border-line shadow-xs">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 p-3 rounded-2xl transition-colors hover:bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-burgundy stroke-[1.75]" />
                </div>
                <div className="text-left space-y-0.5">
                  <h4 className="text-sm font-semibold text-ink leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
