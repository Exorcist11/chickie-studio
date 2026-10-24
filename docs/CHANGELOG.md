# Changelog - Chickie Studio

Tất cả những thay đổi quan trọng của dự án **Chickie Studio** sẽ được ghi chép lại trong tài liệu này.
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/) và tuân thủ [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

- **Category Management Module (CAT-001 - ✅ DONE)**:
  - **Server Spring Boot 3**:
    - Tạo Flyway migration `V3__create_categories_table.sql` gồm bảng `categories` và seed 5 danh mục ban đầu.
    - Xây dựng Entity `Category` kế thừa `BaseEntity`, `CategoryRepository` với kiểm tra trùng slug URL.
    - Ánh xạ DTO qua MapStruct `CategoryMapper`, kiểm tra dữ liệu bằng Jakarta Validation (`@Pattern(regexp = "^[a-z0-9-]+$")`).
    - Triển khai `CategoryServiceImpl` với cơ chế kiểm tra `ConflictException` khi trùng slug khi tạo và sửa.
    - Cung cấp API Public `GET /api/public/categories` và API Admin bảo vệ bởi RBAC `@PreAuthorize("hasRole('ADMIN')")`: `GET`, `POST`, `PUT`, `DELETE /api/admin/categories`.
    - Kiểm thử tự động Server: 65 tests pass 100%, JaCoCo coverage $\ge 80\%$ line và branch (`mvn verify` pass).
  - **CRM Category Management**:
    - Mở rộng `apiClient.ts` hỗ trợ phương thức `PUT` và `DELETE` kèm chuẩn hóa mã lỗi HTTP.
    - Xây dựng màn hình quản lý danh mục `CategoriesPage.tsx` (`/categories`) tích hợp `DataTable`, `FilterBar`, `PageHeader`, `ConfirmModal`.
    - Modal Thêm / Chỉnh sửa danh mục với Zod schema validation, tự động sinh slug từ tên tiếng Việt (slugify).
    - Đồng bộ từ điển đa ngôn ngữ `vi.json` và `en.json` cho toàn bộ nhãn và thông báo danh mục.
    - Kiểm thử tự động CRM: 26 test suites, 76 unit tests pass 100%, coverage đạt **94.21%** lines, **88.55%** branches, `tsc && vite build` hoàn thành trong 3.87s.
  - **Client Dynamic Category Showcase**:
    - Tích hợp hàm API `getPublicCategories()` kèm fallback dữ liệu an toàn khi SSR / SSG.
    - Hiển thị danh mục nổi bật trực tiếp trên trang chủ Landing Page liên kết đến `/products?category=${slug}`.
    - Kiểm thử tự động Client: 27 test suites, 91 unit & a11y tests pass 100%, Next.js static build 100% pass.

- **Server Backend Architecture & CRM Authentication (AUTH-001, AUTH-002, AUTH-003 - ✅ DONE)**:
  - **Khởi tạo kiến trúc Backend Spring Boot 3**:
    - Thiết lập dự án Spring Boot 3.3.5 với Java 21 LTS, Spring Data JPA, Spring Security, Flyway Migration MySQL, MapStruct, JJWT 0.12 và JaCoCo.
    - Cấu hình Maven Wrapper (`server/mvnw.cmd` và `server/mvnw`) thực thi độc lập.
    - Tạo các bảng cơ sở dữ liệu qua Flyway migration: `V1__init_auth_and_users.sql` (bảng `users` và tài khoản admin mặc định) và `V2__create_refresh_tokens.sql` (bảng `refresh_tokens`).
    - Kiến trúc phân tầng sạch: `BaseEntity`, `ApiResponse<T>`, DTO Java record, MapStruct `UserMapper`, `GlobalExceptionHandler`.
    - Bảo mật và chống tấn công: Mã hóa BCrypt, Brute-force defense (tự động khóa tạm thời 15 phút sau 5 lần đăng nhập thất bại), Refresh Token Rotation, Token Reuse Detection và `@PreAuthorize("hasRole('ADMIN')")`.
    - Kiểm thử tự động Server: 38/38 unit & WebMvcTest pass 100%, JaCoCo coverage đạt ngưỡng $\ge 80\%$ line và branch (`mvn clean verify` pass).
  - **CRM Authentication & Role-Based Access Control (RBAC)**:
    - Xây dựng `apiClient.ts` hỗ trợ tự động gửi Bearer token và silent refresh ngầm kèm cơ chế xếp hàng request khi gặp 401 Unauthorized.
    - Xây dựng `AuthContext` và hook `useAuth()` quản lý trạng thái phiên, khôi phục phiên khi F5.
    - Xây dựng `RoleGuard` và `PermissionGate` kiểm soát quyền truy cập trang và phân vùng giao diện giữa Admin và Nhân viên (Staff).
    - Thiết kế trang `LoginPage` (`crm/src/pages/auth/LoginPage.tsx`) chuẩn nhận diện sang trọng, xác thực form bằng Zod, quản lý qua SCSS module, 0 inline CSS.
    - Thiết kế trang `ForbiddenPage` (403 Access Denied) và layout tích hợp `MainDashboardLayout`.
    - Bổ sung từ điển song ngữ `vi.json` và `en.json` đầy đủ các key cho `auth` và `permission`.
    - Kiểm thử tự động CRM: 24 test suites, 66 unit tests pass 100%, độ phủ coverage đạt **94.15%** lines, **86.58%** branches, `tsc && vite build` hoàn thành trong 3.72s.

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
