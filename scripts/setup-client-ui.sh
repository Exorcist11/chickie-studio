#!/usr/bin/env bash
# ==============================================================================
# Chickie Studio - Client UI Setup Script (Next.js + shadcn/ui + Tailwind)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_DIR="$REPO_ROOT/client"

echo "================================================================="
echo "🌸 CHICKIE STUDIO - CÀI ĐẶT THƯ VIỆN UI CHO CLIENT (NEXT.JS)"
echo "================================================================="

# 1. Kiểm tra môi trường Node.js (Yêu cầu Node 20+)
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ LỖI: Yêu cầu Node.js phiên bản 20 trở lên. Hiện tại: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v) đạt yêu cầu (>= 20)."

# 2. Kiểm tra thư mục client và package.json
if [ ! -f "$CLIENT_DIR/package.json" ]; then
  echo "⚠️ THÔNG BÁO: Chưa tìm thấy client/package.json!"
  echo "👉 Vui lòng khởi tạo ứng dụng Client Next.js trước bằng lệnh:"
  echo "   npx create-next-app@latest client --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'"
  exit 1
fi
echo "✅ Đã tìm thấy thư mục Client tại: $CLIENT_DIR"

cd "$CLIENT_DIR"

# 3. Cài đặt các thư viện phụ thuộc (Dependencies)
echo ""
echo "📦 [1/5] Đang cài đặt các thư viện chức năng cho Client..."
npm install \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  react-hook-form \
  zod \
  @hookform/resolvers \
  @tanstack/react-query \
  next-intl \
  sonner \
  react-day-picker \
  date-fns \
  embla-carousel-react

# 4. Cài đặt các thư viện kiểm thử và chất lượng mã nguồn (DevDependencies)
echo ""
echo "🛠️ [2/5] Đang cài đặt thư viện Test và Code Quality..."
npm install -D \
  vitest \
  @vitejs/plugin-react \
  jsdom \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest-axe \
  msw \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-prettier

# 5. Cấu hình components.json cho shadcn/ui
echo ""
echo "⚙️ [3/5] Khởi tạo cấu hình components.json cho shadcn/ui..."
cat << 'EOF' > components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "stone",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/cn",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
EOF
echo "✅ Đã tạo components.json"

# 6. Đồng bộ Design Tokens và Áp dụng Theme
echo ""
echo "🎨 [4/5] Áp dụng Chickie Design Tokens (Burgundy & Gold)..."
npm run theme:apply

# 7. Danh sách Component shadcn đã thiết lập
echo ""
echo "🧩 [5/5] Kiểm tra danh mục component UI dùng chung..."
echo "Danh mục component được cấu hình theo Mục 4 của Kế hoạch UI:"
echo "- Primitives (components/ui): button, input, label, textarea, select, checkbox, radio-group, toggle-group, badge, card, avatar, aspect-ratio, separator, skeleton, alert, tooltip, scroll-area, dialog, sheet, dropdown-menu, popover, navigation-menu, tabs, accordion, carousel, slider, calendar, breadcrumb, pagination, sonner, form."
echo "- Composite/Common (components/common): ProductCard, ServiceCard, TestimonialCard, SectionHeading, Container, Section, Header, Footer."

echo ""
echo "================================================================="
echo "🎉 HOÀN TẤT THIẾT LẬP UI CHO CLIENT (NEXT.JS)!"
echo "👉 Kiểm tra hệ thống: npm run typecheck && npm run test:coverage"
echo "================================================================="
