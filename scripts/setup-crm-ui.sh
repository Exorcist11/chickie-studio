#!/usr/bin/env bash
# ==============================================================================
# Chickie Studio - CRM UI Setup Script (React Vite + shadcn/ui + Tailwind)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRM_DIR="$REPO_ROOT/crm"

echo "================================================================="
echo "💼 CHICKIE STUDIO - CÀI ĐẶT THƯ VIỆN UI CHO CRM (REACT VITE)"
echo "================================================================="

# 1. Kiểm tra môi trường Node.js (Yêu cầu Node 20+)
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ LỖI: Yêu cầu Node.js phiên bản 20 trở lên. Hiện tại: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v) đạt yêu cầu (>= 20)."

# 2. Kiểm tra thư mục CRM và package.json
if [ ! -f "$CRM_DIR/package.json" ]; then
  echo "⚠️ THÔNG BÁO: Chưa tìm thấy crm/package.json!"
  echo "👉 Vui lòng khởi tạo ứng dụng CRM React TypeScript trước bằng lệnh:"
  echo "   npm create vite@latest crm -- --template react-ts"
  exit 1
fi
echo "✅ Đã tìm thấy thư mục CRM tại: $CRM_DIR"

cd "$CRM_DIR"

# 3. Gỡ bỏ dứt điểm tàn dư Ant Design (nếu còn)
if grep -q "antd" package.json 2>/dev/null; then
  echo "🧹 Đang gỡ bỏ Ant Design khỏi CRM..."
  npm uninstall antd @ant-design/icons || true
fi
rm -f src/theme/antdTheme.ts

# 4. Cài đặt các thư viện phụ thuộc (Dependencies)
echo ""
echo "📦 [1/5] Đang cài đặt các thư viện chức năng cho CRM..."
npm install \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  react-router-dom \
  @tanstack/react-query \
  axios \
  @tanstack/react-table \
  react-hook-form \
  zod \
  @hookform/resolvers \
  i18next \
  react-i18next \
  i18next-browser-languagedetector \
  react-dropzone \
  @fontsource-variable/inter \
  @fontsource-variable/playfair-display \
  recharts \
  sonner \
  react-day-picker \
  date-fns \
  cmdk

# 5. Cài đặt các thư viện kiểm thử và công cụ phát triển (DevDependencies)
echo ""
echo "🛠️ [2/5] Đang cài đặt thư viện Test và DevTools..."
npm install -D \
  vitest \
  @vitejs/plugin-react \
  jsdom \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest-axe \
  @tanstack/react-query-devtools \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-prettier

# 6. Cấu hình components.json cho shadcn/ui
echo ""
echo "⚙️ [3/5] Khởi tạo cấu hình components.json cho shadcn/ui..."
cat << 'EOF' > components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/main.scss",
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

# 7. Đồng bộ Design Tokens và Áp dụng Theme
echo ""
echo "🎨 [4/5] Áp dụng Chickie Design Tokens (Burgundy & Sidebar Dark)..."
npm run theme:apply

# 8. Danh sách Component shadcn đã thiết lập
echo ""
echo "🧩 [5/5] Kiểm tra danh mục component UI dùng chung..."
echo "Danh mục component được cấu hình theo Mục 4 của Kế hoạch UI:"
echo "- Primitives (components/ui): button, input, label, textarea, select, checkbox, radio-group, switch, toggle-group, badge, card, avatar, separator, skeleton, alert, tooltip, scroll-area, collapsible, dialog, alert-dialog, sheet, dropdown-menu, popover, command, tabs, table, calendar, breadcrumb, pagination, sidebar, chart, sonner, form."
echo "- Composite/Common (components/common): DataTable, StatusBadge, PageHeader, FilterBar, FormField, ConfirmModal, ImageUploader, AppLayout, StatCard, RevenueChart, EmptyState, ErrorState, PageLoading."

echo ""
echo "================================================================="
echo "🎉 HOÀN TẤT THIẾT LẬP UI CHO CRM (REACT VITE)!"
echo "👉 Kiểm tra hệ thống: npm run typecheck && npm run test:coverage"
echo "================================================================="
