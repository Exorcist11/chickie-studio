# Changelog - Chickie Studio

Tất cả những thay đổi quan trọng của dự án **Chickie Studio** sẽ được ghi chép lại trong tài liệu này.
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/) và tuân thủ [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

- **CRM Modular Architecture & Primitive UI Components (Tái Cấu Trúc CRM Chuẩn Hóa)**:
  - Tái cấu trúc toàn bộ 13 common component sang kiến trúc thư mục module độc lập: `crm/src/components/common/<ComponentName>/` gồm `<ComponentName>.tsx`, `<ComponentName>.test.tsx`, `<ComponentName>.scss`, `index.ts`.
  - Bổ sung nhóm Primitive Components chuẩn shadcn/ui tại `crm/src/components/ui/`: `Button` (cva variants, sizes, loading state), `Input` (accessible labels, errors, icons), `Card` (CardHeader, CardTitle, CardContent, CardFooter), `Badge` (semantic badge variants).
  - Triệt tiêu hoàn toàn inline CSS (`style={{ ... }}` = 0): Thay thế các thuộc tính style động bằng CSS Custom Properties (`--col-width`, `--swatch-color`) và quản lý kiểu dáng qua hệ thống SCSS phân tầng.
  - Tạo `client/src/app/layout.tsx` cho Next.js App Router tích hợp Google Fonts `Playfair Display` + `Inter` và pipeline SCSS toàn cục.
  - Xác minh kiểm thử và build production:
    - CRM: 18 test suites, 48 unit tests pass 100%, coverage đạt **98.85%** lines/statements, **85.27%** branches, `tsc && vite build` hoàn thành trong 4.01s.
    - Client: 26 test suites, 88 unit & a11y tests pass 100%, coverage đạt **97.04%** lines, **87.53%** branches, `next build` hoàn thành tối ưu 100% static pages.

- **CRM Complete Refactor to shadcn/ui Standard (Gỡ Bỏ Hoàn Toàn Ant Design)**:
  - Gỡ bỏ hoàn toàn `antd` và `@ant-design/icons` khỏi `crm/package.json`.
  - Cài đặt và cấu hình `tailwindcss` v3, `postcss`, `autoprefixer`, `class-variance-authority` cho CRM, đồng bộ 100% tokens màu và typography với Client.
  - Refactor toàn diện 13 component dùng chung tại `crm/src/components/common/` sang thuần Tailwind + CVA + Lucide Icons: `StatusBadge`, `PageHeader`, `DataTable`, `FilterBar`, `FormField`, `ConfirmModal`, `ImageUploader`, `AppLayout`, `StatCard`, `RevenueChart`, `EmptyState`, `ErrorState`, `PageLoading`.
  - Tối ưu kích thước bundle build của CRM từ 568 kB xuống chỉ còn 217 kB.

- **Global UI/UX Engineering Rules (Thiết Lập Quy Chuẩn Kỹ Thuật UI/UX Toàn Dự Án)**:
  - Khảo sát và audit toàn diện hệ thống với skill `UX/UI Pro Max`.
  - Thống nhất **`shadcn/ui`** làm thư viện UI tiêu chuẩn duy nhất cho toàn hệ thống (Next.js Client và React Vite CRM).
  - Ban hành lệnh **CẤM TUYỆT ĐỐI Inline CSS (`style={{ ... }}`)** trong toàn bộ component; bắt buộc quản lý CSS tùy chỉnh qua file SCSS/CSS và class utility Tailwind.
  - Ban hành văn bản quy chuẩn kiến trúc [docs/UI_UX_ENGINEERING_RULES.md](UI_UX_ENGINEERING_RULES.md).
  - Cập nhật quy tắc cốt lõi trong [AGENTS.md](../AGENTS.md) lên 9 nguyên tắc bắt buộc cho mọi AI Agent và Developer.
  - Cập nhật quy tắc `.agent/` chuyên biệt: [client/.agent/07-ui-ux-shadcn.md](../client/.agent/07-ui-ux-shadcn.md) và [crm/.agent/07-ui-ux-shadcn.md](../crm/.agent/07-ui-ux-shadcn.md).
  - Xuất bản bộ Design System chuẩn [design-system/chickie-studio/MASTER.md](../design-system/chickie-studio/MASTER.md).

- **UI & Design System (UI-001)**:
  - Triển khai toàn diện bộ Design System tokens (Burgundy `#641D2B`, Champagne Gold `#B8914F`, Ink `#302528`, Warm White `#FFFCF8`, Ivory `#F8F1E8`, Line `#EADFD6`) và Typography (`Playfair Display` + `Inter`).
  - Xây dựng 25 component UI dùng chung cho Client (Next.js 14 App Router + Tailwind): Button, Input, Select, Textarea, DateRangeField, Chip, Badge, Rating, ColorSwatch, SizeSelector, Card, ProductCard, ServiceCard, TestimonialCard, SectionHeading, Container, Section, Modal, ConfirmModal, Toast, Skeleton, EmptyState, Spinner, Logo, Header, Footer.
  - Xây dựng 13 component dùng chung cho CRM (React 18 + Vite + Ant Design 5): StatusBadge (order/item status), PageHeader, DataTable (phân trang, chọn dòng), FilterBar (tìm kiếm, trạng thái, ngày), FormField (tích hợp Zod schema validator), ConfirmModal, ImageUploader (xem trước, giới hạn loại file và dung lượng 5MB), AppLayout (sidebar Dark Ink, active Burgundy), StatCard (số liệu Playfair Display, xu hướng tăng/giảm), RevenueChart (biểu đồ doanh thu SVG màu Burgundy), EmptyState, ErrorState, PageLoading.
  - Xây dựng trang xem trước Component Showcase cho cả Client (`/dev/components`) và CRM (`crm/src/pages/DevComponentsPage.tsx`) kèm cơ chế khóa chặn trên môi trường production.
  - Thiết lập từ điển đa ngôn ngữ song ngữ Tiếng Việt (`vi.json`) và Tiếng Anh (`en.json`) đồng bộ 100% key cho cả Client và CRM.
  - Bộ kiểm thử tự động toàn diện:
    - Client: 26 test suites, 88 unit & a11y tests (Vitest + RTL + vitest-axe), đạt độ bao phủ coverage **97.04%** lines, **87.53%** branches.
    - CRM: 15 test suites, 35 unit tests (Vitest + RTL), đạt độ bao phủ coverage **98.79%** lines, **88.81%** branches.
  - Xuất bản tài liệu danh mục component chi tiết tại [docs/COMPONENTS.md](COMPONENTS.md).

---

## [0.1.0] - 2026-10-24

### Added
- Khởi tạo kiến trúc dự án đa phân vùng (Monorepo-style): `client/`, `crm/`, `server/`, `docs/`.
- Thiết lập quy định và hướng dẫn bắt buộc cho AI Agent và lập trình viên trong `.agent/` cho từng phân vùng và [AGENTS.md](../AGENTS.md).
- Thiết lập hệ thống tài liệu quản lý tiến độ [docs/FEATURES.md](FEATURES.md) theo dõi 45 tính năng.
- Hoàn thành 100% hồ sơ đặc tả kỹ thuật chi tiết (SPEC) cho toàn bộ 17 tính năng cốt lõi MVP P0.
- Tài liệu hướng dẫn kiến trúc Architectural Decision Records ([docs/adr/README.md](adr/README.md)).
