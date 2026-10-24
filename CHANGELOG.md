# Changelog - Chickie Studio

Mọi thay đổi đáng chú ý của dự án **Chickie Studio** sẽ được ghi chép lại tại file này.
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/), và tuân thủ [Semantic Versioning](https://semver.org/lang/vi/).

---

## [Unreleased]

### Added
- **UI Architecture (Client & CRM)**:
  - Tích hợp toàn bộ bộ UI Component (Button, TextField, PasswordField, SearchField, TextArea, Select, Checkbox, RadioGroup, Switch, Badge, Card, Spinner, Skeleton) và các primitives shadcn/ui trực tiếp vào `client/src/components/ui/` và `crm/src/components/ui/`.
  - Cấu hình path aliases `@chickie/ui` và `@chickie/ui/*` trỏ về `./src/components/ui` trong từng ứng dụng.
  - Bộ kiểm thử tự động toàn diện với vitest và vitest-axe: 134 tests (Client), 133 tests (CRM) đều pass với 0 lỗi accessibility và 0 inline CSS (`style={{ ... }}` = 0).
  - Tỷ lệ bao phủ kiểm thử: Client 97.44% lines, CRM 96.58% lines (vượt ngưỡng yêu cầu 80%).

### Removed
- Xóa hoàn toàn thư mục `packages/ui` và các file `package.json`, `package-lock.json`, `node_modules` ở thư mục gốc (monorepo root), giữ cấu trúc dự án sạch gọn chỉ gồm `client`, `crm`, `server`.

### Added
- **Docs & Architecture**:
  - Khởi tạo hệ thống tài liệu theo dõi tính năng [docs/FEATURES.md](docs/FEATURES.md) với 44 tính năng tổng thể (8 modules: AUTH, CAT, BOK, PAY, CUS, RPT, CNT, SET).
  - Hoàn thiện 100% hồ sơ đặc tả chi tiết (📝 SPEC) cho toàn bộ 17 tính năng cốt lõi P0 (MVP).
  - Khởi tạo mẫu đặc tả tính năng chuẩn [docs/features/_TEMPLATE.md](docs/features/_TEMPLATE.md).
  - Thiết lập thư mục quyết định kiến trúc [docs/adr/](docs/adr/) và tài liệu ADR đầu tiên `0001-chon-kien-truc-monorepo.md`.
  - Khởi tạo hệ thống quy tắc phát triển AI Agent (`.agent/`) cho cả 4 phân vùng: `client`, `crm`, `server`, `docs`.

---

## [0.1.0] - 2026-10-24

### Added
- Khởi tạo cấu trúc dự án Monorepo Chickie Studio gồm Client (Next.js), CRM (React Vite) và Server (Spring Boot 3 + MySQL).
- Tài liệu mô tả dự án [docs/PROJECT_DESCRIPTION.md](docs/PROJECT_DESCRIPTION.md) và cấu trúc dự án [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).
