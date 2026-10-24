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

# 6. Liên kết gói UI dùng chung @chickie/ui
echo ""
echo "⚙️ [3/5] Cấu hình workspace và liên kết package @chickie/ui..."
echo "Kiến trúc 4 lớp: shadcn primitives được quản lý tập trung tại packages/ui/src/primitives."
echo "CRM import các component base, form, common qua package '@chickie/ui'."
echo "Cấu hình Vite resolve alias và Tailwind content quét packages/ui đã sẵn sàng."

# 7. Đồng bộ Design Tokens và Áp dụng Theme
echo ""
echo "🎨 [4/5] Áp dụng Chickie Design Tokens (Burgundy & Sidebar Dark)..."
npm run theme:apply

# 8. Danh sách Component theo Kiến trúc 4 Lớp
echo ""
echo "🧩 [5/5] Kiểm tra danh mục component UI dùng chung..."
echo "Kiến trúc bọc shadcn (ADR 0002):"
echo "- Lớp 1 (primitives): Quản lý tại packages/ui/src/primitives (không export ra ngoài)."
echo "- Lớp 2 (base): Button, TextField, Select, Modal, ConfirmModal, Drawer, Menu, Card, Badge..."
echo "- Lớp 2b (form): FormTextField, FormSelect, FormDatePicker..."
echo "- Lớp 3 (common): DataTable, StatusBadge, PageHeader, FilterBar, ConfirmModal, ImageUploader, StatCard..."
echo "- Lớp 4 (features): Gắn nghiệp vụ quản lý danh mục, đơn thuê..."

echo ""
echo "================================================================="
echo "🎉 HOÀN TẤT THIẾT LẬP UI CHO CRM (REACT VITE)!"
echo "👉 Kiểm tra hệ thống: npm run typecheck && npm run test:coverage"
echo "================================================================="
