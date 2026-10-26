import React, { useState } from "react";
import { cn } from "../../../lib/cn";
import "./RevenueChart.scss";

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders?: number;
}

export interface RevenueChartProps {
  title?: string;
  subtitle?: string;
  data: RevenueDataPoint[];
  className?: string;
  height?: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  title = "Biểu đồ doanh thu",
  subtitle = "Doanh thu 6 tháng gần nhất",
  data,
  className,
  height = 240,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.revenue), 1);
  const chartPadding = { top: 30, right: 20, bottom: 40, left: 20 };
  const width = 600;
  const plotWidth = width - chartPadding.left - chartPadding.right;
  const plotHeight = height - chartPadding.top - chartPadding.bottom;

  const points = data.map((d, index) => {
    const x =
      chartPadding.left +
      (data.length > 1 ? (index / (data.length - 1)) * plotWidth : plotWidth / 2);
    const y = chartPadding.top + plotHeight - (d.revenue / maxVal) * plotHeight;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const areaPoints = `${chartPadding.left},${chartPadding.top + plotHeight} ${polylinePoints} ${
    chartPadding.left + plotWidth
  },${chartPadding.top + plotHeight}`;

  return (
    <div
      className={cn(
        "bg-white rounded-card border border-line p-6 shadow-card flex flex-col",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="font-playfair text-lg font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={title}
          className="w-full h-auto min-w-[400px] block"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#641D2B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#641D2B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartPadding.top + plotHeight * (1 - ratio);
            return (
              <line
                key={i}
                x1={chartPadding.left}
                y1={y}
                x2={chartPadding.left + plotWidth}
                y2={y}
                stroke="#EADFD6"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            );
          })}

          {/* Fill Area */}
          <polygon points={areaPoints} fill="url(#revenueGradient)" />

          {/* Revenue Line */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#641D2B"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Labels */}
          {points.map((p, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <g key={index}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#FFFFFF"
                  stroke="#641D2B"
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                <text
                  x={p.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#6B5D60"
                  fontSize="12"
                  fontFamily="var(--font-body, 'Be Vietnam Pro', sans-serif)"
                >
                  {p.label}
                </text>

                {isHovered && (
                  <g className="animate-fadeIn">
                    <rect
                      x={p.x - 45}
                      y={p.y - 38}
                      width={90}
                      height={26}
                      rx={4}
                      fill="#302528"
                    />
                    <text
                      x={p.x}
                      y={p.y - 21}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {(p.revenue / 1000000).toFixed(1)}M ₫
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

