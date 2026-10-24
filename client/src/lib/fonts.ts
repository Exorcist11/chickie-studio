import { Lora, Be_Vietnam_Pro } from "next/font/google";

export const fontLora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const fontBeVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-vietnam",
  display: "swap",
});

// Backward compatibility aliases
export const fontPlayfair = fontLora;
export const fontInter = fontBeVietnamPro;
