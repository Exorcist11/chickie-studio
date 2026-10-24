# Changelog - Chickie Studio

Tất cả những thay đổi quan trọng của dự án **Chickie Studio** sẽ được ghi chép lại trong tài liệu này.
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/) và tuân thủ [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

- **Triển Khai Hoàn Thiện Tính Năng Quản Lý Sản Phẩm, Biến Thể & Thư Viện Ảnh (CAT-002 - ✅ DONE)**:
  - **CRM Frontend (`crm/`)**:
    - **Types & Service API**:
      - `ProductListResponse`, `ProductDetailResponse`, `CreateProductInput`, `UpdateProductInput`, `ProductStatus`, `PageResult` trong [src/types/product.ts](file:///e:/chickie-studio/crm/src/types/product.ts).
      - `productService` trong [src/services/product.service.ts](file:///e:/chickie-studio/crm/src/services/product.service.ts) tích hợp đầy đủ: `getProducts` (hỗ trợ phân trang, tìm kiếm, lọc theo categoryId và status), `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`.
    - **TanStack Query Keys & Hooks**:
      - `productKeys` factory và custom hooks (`useProductsQuery`, `useProductDetailQuery`, `useCreateProductMutation`, `useUpdateProductMutation`, `useDeleteProductMutation`) trong [src/hooks/queries/productKeys.ts](file:///e:/chickie-studio/crm/src/hooks/queries/productKeys.ts) với cơ chế tự động invalidate queries sau mutation.
    - **Giao diện Quản Lý Sản Phẩm (BEM SCSS & shadcn/ui)**:
      - `ProductsPage.tsx`: Header, thống kê tóm tắt, bộ lọc đa năng `FilterBar` (search keyword, category select, status select), bảng dữ liệu `DataTable` phân trang server-side, action buttons (xem, sửa, xóa với xác nhận an toàn).
      - `ProductModal.tsx`: Modal tạo/sửa sản phẩm chia 4 Tabs trực quan: Thông tin cơ bản, Giá & Trạng thái, Biến thể Size/Màu linh hoạt (thêm/xóa biến thể động), Thư viện hình ảnh (hỗ trợ đặt ảnh đại diện thumbnail).
      - `ProductViewModal.tsx`: Modal xem chi tiết sản phẩm với thông tin sản phẩm, danh sách biến thể và gallery ảnh thumbnail.
      - SCSS module BEM chuẩn hoá: [ProductsPage.module.scss](file:///e:/chickie-studio/crm/src/pages/products/ProductsPage.module.scss), [ProductModal.module.scss](file:///e:/chickie-studio/crm/src/pages/products/components/ProductModal/ProductModal.module.scss), [ProductViewModal.module.scss](file:///e:/chickie-studio/crm/src/pages/products/components/ProductViewModal/ProductViewModal.module.scss) (tuyệt đối không inline CSS).
    - **Đa ngôn ngữ (i18n)**:
      - Bổ sung namespace `product` đầy đủ trong cả [vi.json](file:///e:/chickie-studio/crm/src/i18n/locales/vi.json) và [en.json](file:///e:/chickie-studio/crm/src/i18n/locales/en.json).
    - **Routing & Fixes**:
      - Đăng ký route `/products` trong [src/App.tsx](file:///e:/chickie-studio/crm/src/App.tsx).
      - Khắc phục triệt để warning controlled/uncontrolled trong [Select.tsx](file:///e:/chickie-studio/crm/src/components/ui/Select/Select.tsx).
    - **Kiểm thử tự động CRM**:
      - 11 unit & integration tests ([product.service.test.ts](file:///e:/chickie-studio/crm/src/services/product.service.test.ts), [productKeys.test.ts](file:///e:/chickie-studio/crm/src/hooks/queries/productKeys.test.ts), [ProductsPage.test.tsx](file:///e:/chickie-studio/crm/src/pages/products/ProductsPage.test.tsx)). Toàn bộ CRM đạt **41 test files, 165 tests pass 100%**, coverage đạt ngưỡng quy định $\ge 80\%$.
  - **Flyway Migration `V5__create_products_and_variants.sql`**:
    - Tạo bảng `products` (mã sản phẩm duy nhất, slug, giá thuê, tiền cọc, chất liệu, dịp, liên kết category).
    - Tạo bảng `product_variants` (kích cỡ, màu sắc, mã SKU duy nhất, ràng buộc foreign key cascade).
    - Tạo bảng `product_images` (URL ảnh, cờ thumbnail, thứ tự hiển thị, cascade delete).
    - Đầy đủ index tối ưu tìm kiếm theo category, trạng thái và sản phẩm.
  - **Domain Entities & Utilities**:
    - `Product` (extends `BaseEntity`), `ProductVariant`, `ProductImage`, `ProductStatus` (`ACTIVE`, `INACTIVE`, `ARCHIVED`).
    - `SlugUtils` trong `common/util` hỗ trợ chuẩn hóa slug tiếng Việt, xử lý chữ đ/Đ và loại bỏ dấu trùng lặp.
  - **DTOs & MapStruct Mapper**:
    - `CreateProductRequest`, `UpdateProductRequest` với Bean Validation chặt chẽ (`@Positive`, `@NotEmpty`, `@NotBlank`).
    - `ProductDetailResponse`, `ProductListResponse`, `ProductVariantResponse`, `ProductImageResponse`.
    - `ProductMapper` tự động trích xuất thumbnail, đếm biến thể không gây N+1 query.
  - **Tầng Dịch Vụ Nghiệp Vụ (`ProductServiceImpl`)**:
    - Xử lý nghiệp vụ: Tự sinh mã sản phẩm nếu trống, sinh slug từ tên, sinh SKU theo chuẩn `{CODE}-{SIZE}-{COLOR}`.
    - Đảm bảo quy tắc nghiệp vụ BR-01..BR-03: Bắt buộc có biến thể và ảnh, tự động gán ảnh đầu tiên làm thumbnail nếu chưa chọn, chống trùng lặp slug/mã sản phẩm/SKU.
    - Giao dịch an toàn với `@Transactional`.
  - **REST API Endpoints**:
    - `AdminProductController` (`/api/admin/products`): CRUD sản phẩm, phân quyền `@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")`.
    - `PublicProductController` (`/api/public/products`): Xem danh mục sản phẩm công khai và chi tiết theo ID hoặc Slug.
  - **Kiểm thử tự động & Coverage**:
    - 29 unit tests và controller tests mới ([ProductServiceTest.java](file:///e:/chickie-studio/server/src/test/java/com/chickiestudio/product/service/ProductServiceTest.java), [ProductControllerTest.java](file:///e:/chickie-studio/server/src/test/java/com/chickiestudio/product/controller/ProductControllerTest.java), [ProductMapperTest.java](file:///e:/chickie-studio/server/src/test/java/com/chickiestudio/product/mapper/ProductMapperTest.java), [SlugUtilsTest.java](file:///e:/chickie-studio/server/src/test/java/com/chickiestudio/common/util/SlugUtilsTest.java)).
    - Toàn bộ Backend đạt **102/102 tests pass (100%)**.
    - JaCoCo Line Coverage: `ProductServiceImpl` đạt **98.3%**, `AdminProductController` đạt **100%**, `PublicProductController` đạt **100%**, `ProductMapper` đạt **100%**.

- **Triển Khai Bộ TanStack (TanStack Query + TanStack Form) Cho Dự Án CRM (TAN-001 - ✅ DONE)**:
  - **Cấu hình TanStack Query tập trung**:
    - Khởi tạo `QueryClient` chuẩn hóa tại [src/lib/queryClient.ts](file:///e:/chickie-studio/crm/src/lib/queryClient.ts) với `staleTime: 5 phút`, `retry: 1`, `mutations.retry: 0`.
    - Bao bọc toàn bộ ứng dụng bằng `<QueryClientProvider client={queryClient}>` trong [src/App.tsx](file:///e:/chickie-studio/crm/src/App.tsx).
    - Xây dựng Query Keys Factory tập trung [src/hooks/queries/authKeys.ts](file:///e:/chickie-studio/crm/src/hooks/queries/authKeys.ts) tuân thủ quy chuẩn `crm/.agent/03-react-vite.md`.
    - Triển khai custom mutation hook [src/hooks/queries/useLoginMutation.ts](file:///e:/chickie-studio/crm/src/hooks/queries/useLoginMutation.ts) gọi `login` từ `AuthContext` và tự động invalidate `authKeys.all` sau khi đăng nhập thành công.
  - **Tích hợp TanStack Form cho `LoginPage.tsx`**:
    - Sử dụng `useForm` và `<form.Field>` từ `@tanstack/react-form` quản lý form state độc lập.
    - Validate schema Zod chuẩn Standard Schema cho cả `onChange` và `onSubmit`.
    - Gọi mutation API đăng nhập qua `useLoginMutation.mutateAsync` và tự động điều hướng về trang đích được ghi nhớ.
  - **Kiểm thử tự động & Coverage**:
    - Viết unit test cho [src/hooks/queries/useLoginMutation.test.tsx](file:///e:/chickie-studio/crm/src/hooks/queries/useLoginMutation.test.tsx) (đạt 100% coverage), [src/hooks/queries/authKeys.test.ts](file:///e:/chickie-studio/crm/src/hooks/queries/authKeys.test.ts) (đạt 100% coverage), [src/lib/queryClient.test.ts](file:///e:/chickie-studio/crm/src/lib/queryClient.test.ts) (đạt 100% coverage).
    - Cập nhật bộ test [src/pages/auth/LoginPage.test.tsx](file:///e:/chickie-studio/crm/src/pages/auth/LoginPage.test.tsx) với `renderWithProviders`: 7/7 tests pass.
    - Toàn bộ CRM đạt **36 test files, 144 tests pass 100%**, lint và typecheck pass với **0 errors, 0 warnings**.

- **Chuẩn Hóa Component Trang Đăng Nhập & Khắc Phục Lỗi Mất Phiên Khi F5 (AUTH-001, AUTH-003 - Fix Bug)**:
  - **Áp dụng bộ component UI chuẩn hệ thống cho `LoginPage.tsx`**:
    - Thay thế toàn bộ primitive `Input` và wrapper `FormField` thô bằng Chickie Base `TextField` và `PasswordField` từ `@/components/ui`.
    - Sử dụng chuẩn `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Button` của hệ thống.
    - Loại bỏ mã CSS dead code (`&__toggle-pw`) và quản lý toggle password ẩn/hiện tự động ngay trong `PasswordField`.
  - **Tách class dài vào SCSS & Chuẩn hóa BEM (`LoginPage.scss`)**:
    - Chuyển toàn bộ chuỗi class Tailwind dài trong JSX sang file SCSS với tiền tố BEM (`.login-page__*`) sử dụng `@apply` và design tokens (`--color-burgundy`, `--color-gold`, `--color-warm-white`, `--color-line`).
    - Khắc phục class token không tồn tại (`text-champagne-gold` -> `text-gold`, `var(--color-champagne-gold)` -> `var(--color-gold)`).
  - **Khắc phục triệt để lỗi reload F5 quay về trang đăng nhập mà không giữ trang hiện tại**:
    - **Lưu trữ & Khôi phục phiên bền vững (`localStorage`)**: Persist `user` và `accessToken` vào `localStorage` (`chickie_crm_user`, `chickie_crm_token`). Khởi tạo `user` đồng bộ ngay khi mount giúp `RoleGuard` không bị reset về `false` và không đá người dùng về `/login`.
    - **Cập nhật Backend Profile API**: Mở rộng `AuthService.getProfile(username)` và `AuthController.getProfile()` trả về thông tin `UserResponse` đầy đủ thay vì chỉ authorities.
    - **Cơ chế Fallback Resilient trên CRM**: `authService.getProfile()` hỗ trợ phân giải từ `res.data.user`, cache `localStorage`, và authorities fallback.
    - **Ghi nhớ URL Đích (Target Navigation Preservation)**: `RoleGuard` lưu `location` vào `state={{ from: location }}` khi redirect về login; `LoginPage` tự động điều hướng chính xác về trang đích người dùng đang thao tác sau khi đăng nhập hoặc nếu đã có phiên hoạt động.
  - **Khắc Phục Toàn Diện Warnings (ESLint, Sass, React Router, Tests & Build)**:
    - **ESLint**: Cấu hình `allowExportNames` trong `.eslintrc.json` cho rule `react-refresh/only-export-components`, giảm từ 8 warnings xuống **0 warnings**.
    - **Dart Sass Deprecation**: Cấu hình `api: "modern-compiler"` trong `vite.config.ts` và `vitest.config.ts`, loại bỏ hoàn toàn 17 cảnh báo `legacy-js-api` của Dart Sass khi build và test.
    - **React Router Future Flags**: Khai báo `v7_startTransition: true` và `v7_relativeSplatPath: true` trên `<BrowserRouter>` (`App.tsx`) và `<MemoryRouter>` (`LoginPage.test.tsx`, `RoleGuard.test.tsx`, `ForbiddenPage.test.tsx`), triệt tiêu warning v7.
    - **TypeScript & Node Config**: Cài đặt `@types/node` trong `crm`, khai báo `"types": ["node"]` tại `tsconfig.node.json`, chuyển đổi alias `path.resolve(__dirname, ...)` sang chuẩn ESM `fileURLToPath(new URL(..., import.meta.url))` trong `vite.config.ts` và `vitest.config.ts`.
    - **IDE Editor Warnings**: Cấu hình `.vscode/settings.json` (`scss.lint.unknownAtRules: "ignore"`) loại bỏ toàn bộ 15 cảnh báo `@apply` của Tailwind trong file SCSS.
    - **Vitest & React Warnings**: Mock `HTMLCanvasElement.prototype.getContext` trong `vitest.setup.ts` cho `axe-core`, thêm `onChange` handler cho test `SearchField`, bọc `waitFor` cho async state update trong `AuthContext.test.tsx`.
  - **Kiểm thử tự động & Coverage**:
    - Server: 73 unit/integration tests pass 100%.
    - CRM: 34 test files, 141 tests pass 100%, coverage `AuthContext` đạt **99.01%** lines, **87.5%** branches. Typecheck, Lint, Test và Production Build đều pass 100% với **0 errors, 0 warnings**.

- **Chuyển Toàn Bộ UI Package Trực Tiếp Vào Client và CRM (UI-001 - ✅ DONE)**:
  - **Tích hợp bộ component UI và primitives trực tiếp vào `client/src/components/ui/` và `crm/src/components/ui/`**:
    - Primitives: `input.tsx`, `label.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `badge.tsx`, `card.tsx`, `skeleton.tsx`, `button.tsx`.
    - Base Components: `Button`, `TextField`, `PasswordField`, `SearchField`, `TextArea` (hoặc `Textarea`), `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Badge`, `Card`, `Spinner`, `Skeleton`.
  - **Dọn dẹp triệt để thư mục gốc (Root Cleanup)**:
    - Xóa hoàn toàn thư mục `packages/ui` và các file `package.json`, `package-lock.json`, `node_modules` ở thư mục gốc monorepo.
    - Cấu hình path alias `@chickie/ui` và `@chickie/ui/*` trỏ về `./src/components/ui` trong từng project (`tsconfig.json`, `vite.config.ts`), đảm bảo import đồng bộ mà không cần package ngoài.
  - **Kiểm thử tự động & Accessibility (WAI-ARIA)**:
    - Client: 31 test files, 134 tests pass 100%, coverage đạt **97.44%** lines, **90.30%** branches, 0 lỗi a11y (`vitest-axe`).
    - CRM: 34 test files, 133 tests pass 100%, coverage đạt **96.58%** lines, **91.11%** branches, 0 lỗi a11y (`vitest-axe`).
    - Lint và build production ở cả Client (Next.js) và CRM (Vite) thành công 100% với 0 errors.

- **Component Architecture & Monorepo Package @chickie/ui (UI-000 - ✅ DONE)**:
  - **Khởi tạo kiến trúc 4 lớp (4-Tier Layered Architecture)**:
    - Lập [ADR 0002](adr/0002-kien-truc-component-boc-shadcn-package-ui.md) và tài liệu đặc tả [docs/UI_LIBRARIES.md](UI_LIBRARIES.md) chuẩn hóa kiến trúc bọc shadcn/ui thay vì gọi trực tiếp.
    - Tạo cấu trúc Monorepo Workspace: root `package.json` kích hoạt `workspaces: ["packages/*", "client", "crm"]`.
    - Thiết lập package `packages/ui` (`@chickie/ui`) với `exports` đóng chặt: chỉ mở `"."` và theme tokens, hoàn toàn cô lập `src/primitives` để cưỡng chế kỷ luật bằng cấu trúc.
    - Cấu hình Design Tokens `packages/ui/src/styles/shadcn-theme.css`, `components.json` trỏ alias ui vào primitives.
  - **Lớp Primitive & Base Button**:
    - Triển khai primitive button (`packages/ui/src/primitives/button.tsx`) chuẩn cva/shadcn.
    - Triển khai Chickie Base `Button` (`packages/ui/src/base/Button/Button.tsx`) bọc primitive: variant hẹp theo design system (`primary | secondary | tertiary`), size (`md | sm`), touch target chuẩn 44px, hỗ trợ icon (`leftIcon`, `rightIcon`), trạng thái `loading` kèm spinner SVG và WAI-ARIA `aria-busy`.
    - Bộ kiểm thử tự động `Button.test.tsx`: 9 tests pass 100%, kiểm thử accessibility WAI-ARIA với `vitest-axe` không có vi phạm, độ phủ coverage đạt **100%** statements, branches, functions và lines.
  - **Cưỡng chế quy tắc (ESLint) & Tích hợp Client/CRM**:
    - Cấu hình ESLint `no-restricted-imports` ở cả Client và CRM cấm import trực tiếp từ primitives bên ngoài (`@radix-ui/*`, `antd`, `@chickie/ui/src/*`).
    - Cấu hình Next.js `transpilePackages: ['@chickie/ui']` và Tailwind content quét `packages/ui/src`.
    - Cấu hình CRM Vite resolve alias và Tailwind content quét `packages/ui/src`.
    - Cập nhật trang xem trước `/dev/components` ở cả Client và CRM demo Base Button từ `@chickie/ui`.
    - Đồng bộ scripts `setup-client-ui.sh`, `setup-crm-ui.sh`, danh mục `COMPONENTS.md` và lộ trình `FEATURES.md`.
    - Toàn bộ test suites pass 100% (Client 91 tests, CRM 76 tests, packages/ui 9 tests), build production cả Next.js và Vite hoàn thành tối ưu.

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
